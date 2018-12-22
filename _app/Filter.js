import React, { Component } from 'react';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: '',
      id: '',
      title: '',
      status: '',
      text: '',
      createDate: '',
      updateDate: '',
      creator: '',
      assignee: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    const model = [
      'open=',
      '_id=', 
      'issue_title=', 
      'status_text=', 
      'issue_text=',
      'created_on=',
      'updated_on=',
      'created_by=', 
      'assigned_to='
    ];
    
    const url = window.location.pathname + '?';
    
    const keys = Object.keys(this.state);
    const params = keys.map((el, i) => this.state[el] ? model[i] + this.state[el] + '&' : '');
    const query = params.reduce((acc, curr) => acc += curr).slice(0, -1);
    
    const route = url + query;
    
    this.props.filter(route);
    this.props.toggle({target:{id: 'filter_form'}});
  }
  
  handleClear(e) {
    this.setState({
      open: '',
      id: '',
      title: '',
      status: '',
      text: '',
      createDate: '',
      updateDate: '',
      creator: '',
      assignee: ''
    });
    this.props.filter(window.location.pathname);
    this.props.toggle({target:{id: 'filter_form'}});
  }
  
  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  }
  
  render() {
    return(
      <form id="submit_filter" className={this.props.filtering ? 'show-filter' : 'hide-filter'} onSubmit={this.handleSubmit}>
      
      <div className="row mb-1">
        <div className="col-sm-6 px-0">
          <button id="clear_filter" className="btn btn-sm btn-warning" type="button" onClick={this.handleClear}>Clear</button>
        </div>
        <div className="col-sm-6 px-0 align-self-end">
          <select name="open" value={this.state.open} onChange={this.handleChange}>
            <option value="">All</option>
            <option value="true">Open</option>
            <option value="false">Closed</option>
          </select>
        </div>
      </div>
      
      <div className="row border-bottom">
        <div className="col-sm-6 px-0">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend justify-content-center">
              <span className="input-group-text lbl-w-3 justify-content-center">ID</span>
            </div>
            <input className="form-control" type="text" name="id" value={this.state.id} onChange={this.handleChange} placeholder="Filter Id" />
          </div>
        </div>
        <div className="col-sm-6 px-0">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend justify-content-center">
              <span className="input-group-text lbl-w-4 justify-content-center">Title</span>
            </div>
            <input className="form-control" type="text" name="title" value={this.state.title} onChange={this.handleChange} placeholder="Filter Title" />
          </div>
        </div>
      </div>
      
      <div className="row border-bottom">
        <div className="col-sm-6 px-0">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text lbl-w-3">Text</span>
            </div>
            <input className="form-control" type="text" name="text" value={this.state.text} onChange={this.handleChange} placeholder="Filter Text" />
          </div>
        </div>
        <div className="col-sm-6 px-0">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend justify-content-center">
              <span className="input-group-text lbl-w-4 justify-content-center">Status</span>
            </div>
            <input className="form-control" type="text" name="status" value={this.state.status} onChange={this.handleChange} placeholder="Filter Status" />
          </div>
        </div>
      </div>
      
      <div className="row border-bottom">
        <div className="col-sm-6 px-0">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text lbl-w-6">Created by</span>
            </div>
            <input className="form-control" type="text" name="creator" value={this.state.creator} onChange={this.handleChange} placeholder="Filter Creator" />
          </div>
        </div>
        <div className="col-sm-6 px-0">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text">Assigned to</span>
            </div>
            <input className="form-control" type="text" name="assignee" value={this.state.assignee} onChange={this.handleChange} placeholder="Filter Assignee" />
          </div>
        </div>
      </div>
      
      <div className="row border-bottom">
        <div className="col-sm-6 px-0">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text lbl-w-6">Created on</span>
            </div>
            <input className="form-control" type="date" name="createDate" value={this.state.createDate} onChange={this.handleChange} placeholder="Filter Create Date" />
          </div>
        </div>
        <div className="col-sm-6 px-0">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text">Updated on</span>
            </div>
            <input className="form-control" type="date" name="updateDate" value={this.state.updateDate} onChange={this.handleChange} placeholder="Filter Update Date" />
          </div>
        </div>
      </div>
    
      <div className="row mt-3 justify-content-end">
        <button id="filter_cancel" className="btn btn-sm btn-danger mr-2" type="button" onClick={this.handleClear}>Cancel</button>
        <button className="btn btn-sm btn-success">Submit</button>
      </div>
      
    </form>
    );
  }
}

export { Filter };