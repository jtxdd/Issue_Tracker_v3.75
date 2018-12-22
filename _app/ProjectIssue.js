import React, { Component } from 'react';
import { IssueButtons } from '../_app/IssueButtons.js';

class ProjectIssue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readOnly: true,
      _id: '',
      open: '',
      issue_title: '',
      issue_text: '',
      created_by: '',
      assigned_to: '',
      status_text: '',
      created_on: '',
      updated_on: '',
      updating: false,
      route: '',
      saveState: {},
      confirm:(action, ID) => {
        return window.confirm(`${action} Issue Id: ${ID}`)
      },
      request:(method, data) => {
        return {
          method: method, 
          body: JSON.stringify(data), 
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
        }
      },
      formatDate:(date) => {
        const options = {
          year: '2-digit', month: '2-digit', day: '2-digit', 
          hour: '2-digit', minute: '2-digit'
        };
        return new Date(date).toLocaleString([], options);
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleUpdating = this.toggleUpdating.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleData = this.handleData.bind(this);
  }
  
  componentDidMount() {
    this.handleData('mount', this.props.issue);
  }
  
  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }
  
  toggleUpdating(e) {
    e.preventDefault();
    
    this.setState(prev => ({
      updating: !prev.updating, 
      readOnly: false, 
    }));
  }
      
  handleOpen() {
    this.setState(prev => ({ open: !prev.open }));
  }
  
  handleData(action, data) {
    const { saveState: ss, formatDate } = this.state;
    let issueActions = {
      mount:(data) => {
        const route = this.props.location.pathname;
        this.setState({
          _id:  data._id,
          open: data.open,
          issue_title: data.issue_title,
          issue_text:  data.issue_text,
          created_by:  data.created_by,
          assigned_to: data.assigned_to,
          status_text: data.status_text,
          created_on:  formatDate(data.created_on),
          updated_on:  formatDate(data.updated_on),
          saveState: {
            _id:  data._id,
            open: data.open,
            issue_title: data.issue_title,
            issue_text:  data.issue_text,
            created_by:  data.created_by,
            assigned_to: data.assigned_to,
            status_text: data.status_text,
            created_on:  formatDate(data.created_on),
            updated_on:  formatDate(data.updated_on),
          },
          route: route
        });
      },
      
      update:(data) => {
        if (data.docs) {
          const d = data.docs.value;
          this.setState({
            _id:  d._id,
            open: d.open,
            issue_title: d.issue_title,
            issue_text:  d.issue_text,
            created_by:  d.created_by,
            assigned_to: d.assigned_to,
            status_text: d.status_text,
            created_on: formatDate(d.created_on),
            updated_on: formatDate(d.updated_on),
            readOnly: true,
            updating: false
          });
        } else {
          this.setState({
            _id:  ss._id,
            open: ss.open,
            issue_title: ss.issue_title,
            issue_text:  ss.issue_text,
            created_by:  ss.created_by,
            assigned_to: ss.assigned_to,
            status_text: ss.status_text,
            created_on:  formatDate(ss.created_on),
            updated_on:  formatDate(ss.updated_on),
            readOnly: true,
            updating: false,
          });
        }
        this.props.notification(data.message);
      },
      
      close:(data) => {
        if (data.docs) {
          const d = data.docs.value;
          this.setState({
            open: d.open,
            updated_on: formatDate(d.updated_on),
            updating: false,
            readOnly: true,
          });
        } else {
          this.setState({
            open: ss.open,
            updated_on: formatDate(ss.updated_on),
            readOnly: true,
            updating: false
          });
        }
        this.props.notification(data.message);
      }
    };
    
    issueActions[action](data);
  }
  
  handleDelete(e) {
    e.preventDefault();
    const { request, confirm, route, _id } = this.state;
    
    if (confirm('Deleting', _id)) {
      const options = request('DELETE', {_id: _id});
      this.props.update(route, options);
    }
  }
  
  handleClose(e) {
    e.preventDefault();
    const { request, confirm, route, _id } = this.state;
    
    if (confirm('Closing', _id)) {
      const options = request('PUT', {_id: _id, close: true});
      
      fetch(route, options)
        .then(res => res.json())
        .then(result => this.handleData('close', result));
    }
  }
  
  handleCancel(e) {
    e.preventDefault();
    const { saveState: ss, formatDate } = this.state;
    
    this.setState({
      _id:  ss._id,
      open: ss.open,
      issue_title: ss.issue_title,
      issue_text:  ss.issue_text,
      created_by:  ss.created_by,
      assigned_to: ss.assigned_to,
      status_text: ss.status_text,
      created_on:  formatDate(ss.created_on),
      updated_on:  formatDate(ss.updated_on),
      readOnly: true,
      updating: false
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    const { request, confirm, route, saveState, _id } = this.state;
    
    let update = {};
    Object.keys(saveState).forEach(el => update[el] = this.state[el]);
    update.created_on = new Date(update.created_on).toISOString();
    update.updated_on = new Date().toISOString();
    
    if (confirm('Updating', _id)) {
      const options = request('PUT', update);
       fetch(route, options)
        .then(res => res.json())
        .then(result => this.handleData('update', result));
    }
  }
  
  render() {
    return(
      <form className="w-75 mb-5" onSubmit={this.handleSubmit}>
        <div className="row border-bottom">
          <div className="col px-0 d-flex clearfix">
            <div className="input-group input-group-sm float-left">
              <div className="input-group-prepend h-100">
                <span className="input-group-text h-100 lbl-w-3">ID</span>
              </div>
              <input type="text" className="form-control h-100" name="_id" value={this.state._id} onChange={this.handleChange} readOnly={this.state.readOnly} />
              {this.state.updating ? (
                <div className="input-group-append">
                  <div className="input-group-text px-0">
                    <button className="btn btn-sm btn-danger" type="button" disabled={this.state.open ? true : false} onClick={this.handleOpen}>Open</button>
                    <button className="btn btn-sm btn-success" type="button" disabled={this.state.open ? false : true} onClick={this.handleOpen}>Close</button>
                  </div>
                </div>
              ) : (
                <span className={this.state.open ? 'badge-danger p-1 float-right' : 'badge-secondary p-1 float-right'}>{this.state.open ? 'Open' : 'Closed'}</span>
                )}
            </div>
          </div>
        </div>
        
        <div className="row border-bottom">
          <div className="col px-0">
            <div className="input-group input-group-sm">
              <div className="input-group-prepend">
                <span className="input-group-text lbl-w-3">Title</span>
              </div>
              <input type="text" className="form-control" name="issue_title" value={this.state.issue_title} onChange={this.handleChange} readOnly={this.state.readOnly} />
            </div>
          </div>
        </div>
        
        <div className="row border-bottom">
          <div className="col px-0">
            <div className="input-group input-group-sm ht-3">
              <div className="input-group-prepend">
                <span className="input-group-text h-100 lbl-w-3">Text</span>
              </div>
              <textarea className="form-control h-100" name="issue_text" value={this.state.issue_text} onChange={this.handleChange} readOnly={this.state.readOnly} />      
            </div>
          </div>
        </div>
        
        <div className="row border-bottom">
          <div className="col-sm-6">
            <div className="row border-bottom">
              <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text lbl-w-6">Created by</span>
                </div>
                <input type="text" className="form-control" name="created_by" value={this.state.created_by} onChange={this.handleChange} readOnly={this.state.readOnly} />
              </div>
            </div>
            <div className="row border-bottom">
              <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text lbl-w-6">Assigned to</span>
                </div>
                <input type="text" className="form-control" name="assigned_to" value={this.state.assigned_to} onChange={this.handleChange} readOnly={this.state.readOnly} />
              </div>
            </div>
          </div>
          <div className="col-sm-6 d-flex px-0">
            <div className="input-group input-group-sm">
              <div className="input-group-prepend justify-content-center">
                <span className="input-group-text h-100 lbl-w-4 justify-content-center">Status</span>
              </div>
              <textarea className="form-control h-100" name="status_text" value={this.state.status_text} onChange={this.handleChange} readOnly={this.state.readOnly} />      
            </div>
          </div>
        </div>
        
        <div className="row border-bottom">
          <div className="col-sm-6 px-0">
            <div className="input-group input-group-sm">
              <div className="input-group-prepend">
                <span className="input-group-text lbl-w-4">Created</span>
              </div>
              <input type="text" className="form-control" name="created_on" value={this.state.created_on} onChange={this.handleChange} readOnly={this.state.readOnly} />
            </div>
          </div>
          <div className="col-sm-6 px-0">
            <div className="input-group input-group-sm">
              <div className="input-group-prepend">
                <span className="input-group-text lbl-w-4">Updated</span>
              </div>
              <input type="text" className="form-control" name="updated_on" value={this.state.updated_on} onChange={this.handleChange} readOnly={this.state.readOnly} />
            </div>
          </div>
        </div>
        
        <div className="row border-bottom">
          <IssueButtons 
            cancel={this.handleCancel}
            updater={this.toggleUpdating}
            delete={this.handleDelete}
            close={this.handleClose}
            save={this.handleSubmit}
            updating={this.state.updating}
            canClose={this.state.open}
          />
        </div>
      </form>
    );
  }
}

export { ProjectIssue };