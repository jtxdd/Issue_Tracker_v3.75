import React, { Component } from 'react';

class NewIssue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      new_title: '',
      new_text: '',
      new_creator: '',
      new_assignee: '',
      new_status: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }
    
  handleSubmit(e) {
    e.preventDefault();
    
    const {
      new_title: issue_title, 
      new_text:  issue_text,
      new_status: status_text,
      new_creator:  created_by, 
      new_assignee: assigned_to
    } = this.state;
    
    const issue = {
      open: true,
      issue_title, 
      issue_text, 
      created_by, 
      assigned_to, 
      status_text,
      created_on: new Date().toISOString(),
      updated_on: new Date().toISOString()
    };
    
    const options = {
      method: 'POST', 
      body: JSON.stringify(issue), 
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    };
        
    this.props.submit(window.location.pathname, options);
    this.handleClear({target:{id:'newIssue_cancel'}});
  }
  
  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  }
  
  handleClear(e) {
    this.setState({
      new_title: '',
      new_text: '',
      new_creator: '',
      new_assignee: '',
      new_status: ''
    });
    this.props.toggle(e);
  }
  
  render() {
    return(
      <form id="submit_newIssue" className={this.props.creating ? 'show-newIssue mt-2 w-75' : 'hide-newIssue'} onSubmit={this.handleSubmit}>
      
      <div className="row border-bottom">
        <div className="col px-0">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text lbl-w-3">Title</span>
            </div>
            <input className="form-control" type="text" name="new_title" value={this.state.new_title} onChange={this.handleChange} placeholder="New Issue Title" required />
          </div>
        </div>
      </div>
      
      <div className="row border-bottom">
        <div className="col px-0">
          <div className="input-group input-group-sm ht-3">
            <div className="input-group-prepend">
              <span className="input-group-text h-100 lbl-w-3">Text</span>
            </div>
            <textarea className="form-control h-100" name="new_text" value={this.state.new_text} onChange={this.handleChange} required />
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
              <input className="form-control" type="text" name="new_creator" value={this.state.new_creator} onChange={this.handleChange} placeholder="New Creator" required />
            </div>
          </div>
          <div className="row border-bottom">
            <div className="input-group input-group-sm">
              <div className="input-group-prepend">
                <span className="input-group-text lbl-w-6">Assigned to</span>
              </div>
              <input className="form-control" type="text" name="new_assignee" value={this.state.new_assignee} onChange={this.handleChange} placeholder="New Assignee" />
            </div>
          </div>
        </div>
        <div className="col-sm-6 d-flex px-0">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend justify-content-center">
              <span className="input-group-text h-100 lbl-w-4 justify-content-center">Status</span>
            </div>
            <textarea className="form-control h-100" name="new_status" value={this.state.new_status} onChange={this.handleChange} />
          </div>
        </div>
      </div>
      
      <div className="row mt-3 justify-content-end">
        <button id="newIssue_cancel" className="btn btn-sm btn-danger mr-2" type="button" onClick={this.handleClear}>Cancel</button>
        <button className="btn btn-sm btn-success">Submit</button>
      </div>
    </form>
    );
  }
}

export { NewIssue };