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
      saveState: {},
      updating: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }
  
  componentDidMount() {
    this.setState({
      _id: this.props.issue._id,
      open: this.props.issue.open,
      issue_title: this.props.issue.issue_title,
      issue_text: this.props.issue.issue_text,
      created_by: this.props.issue.created_by,
      assigned_to: this.props.issue.assigned_to,
      status_text: this.props.issue.status_text,
      created_on: new Date(this.props.issue.created_on).toLocaleString(),
      updated_on: new Date(this.props.issue.updated_on).toLocaleString(),
      updating: false,
      saveState: this.props.issue
    });
  }
  
  handleDelete() {
    //this DELETE id === deleteOne
  }
  
  handleClose(e) {
    e.preventDefault();
    let update = {_id: this.state._id, close: true};
    let options = {
      method: 'PUT', 
      body: JSON.stringify(update), 
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    };
    this.setState(prev => ({ updating: !prev.updating, readOnly: !prev.readOnly }));
    this.props.update(options);
  }
  
  handleCancel(e) {
    e.preventDefault();
    let ss = this.state.saveState;
    this.setState({
      _id: ss._id,
      open: ss.open,
      issue_title: ss.issue_title,
      issue_text: ss.issue_text,
      created_by: ss.created_by,
      assigned_to: ss.assigned_to,
      status_text: ss.status_text,
      created_on: ss.created_on,
      updated_on: ss.updated_on,
      readOnly: true,
      updating:false
    });
  }
  
  handleUpdate(e) {
    e.preventDefault();
    this.setState(prev => ({ updating: !prev.updating, readOnly: false }));
  }
  
  handleOpen(e) {
    //console.log(e.target.textContent);
    this.setState(prev => ({ open: !prev.open }));
  }
  
  handleSubmit(e) {
    e.preventDefault();
    let update = this.state;
    update.updated_on = new Date().toISOString();
    delete update.readOnly;
    delete update.saveState;
    delete update.updating;
    
    let options = {
      method: 'PUT', 
      body: JSON.stringify(update), 
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    };
    
    this.props.update(options);
    this.setState(prev => ({ updating: false, readOnly: true }));
  }
  
  handleChange(e) {
    let name = e.target.name;
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({ [name]: value });
  }
  
  render() {
    return(
      <form className="w-75 mb-5 border" onSubmit={this.handleSubmit}>
        
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
            updater={this.handleUpdate}
            delete={this.handleDelete}
            close={this.handleClose}
            save={this.handleSubmit}
            updating={this.state.updating}
          />
        </div>
      </form>
    );
  }
}

export { ProjectIssue };


/*
  <span className="float-right">
            <div className="input-group input-group-sm">
                  <div className="input-group-append h-100 justify-content-center">
                    <div className="input-group-text h-100 lbl-w-4 justify-content-center">
                      <input className="h-100" type="checkbox" name="open" checked={this.state.open} onChange={this.handleChange} />
                      <label>{this.state.open ? 'Open' : 'Closed'}</label>
                    </div>
                  </div>
                </div>
              </span>
*/