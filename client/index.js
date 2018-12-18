import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Projects } from '../_app/Projects.js';
import { Home } from '../_app/Home.js';
import { Filter } from '../_app/Filter.js';
import { NewIssue } from '../_app/NewIssue.js';
import { ProjectIssue } from '../_app/ProjectIssue.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      issues: [],
      id: '',
      open: '',
      title: '',
      text: '',
      creator: '',
      assignee: '',
      status: '',
      createDate: '',
      updateDate: '',
      filterToggle: false,
      newIssueToggle: false,
      new_title: '',
      new_text: '',
      new_creator: '',
      new_assignee: '',
      new_status: ''
    };
    this.handleFetch = this.handleFetch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitFilter = this.submitFilter.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.toggleNewIssue = this.toggleNewIssue.bind(this);
    this.submitNewIssue = this.submitNewIssue.bind(this);
    this.cancelNewIssue = this.cancelNewIssue.bind(this);
    this.resetNewIssue = this.resetNewIssue.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleUpdateIssue = this.handleUpdateIssue.bind(this);
  }
  
  componentDidMount() {
    fetch('/projects')
      .then(res => res.json())
      .then(result => {
        result.docs.forEach(el => {
          el.route = '/api/issues/' + el.title.replace(/\s/g, '_');
        });
        this.setState({ projects: result.docs });
      });
  }
  
  handleFetch(url) {
    fetch(url)
      .then(res => res.json())
      .then(result => {
        this.setState({issues: result.docs});
      });
    this.props.history.push(url);
  }
  
  handleUpdateIssue(options) {
    const url = this.props.location.pathname;
    fetch(url, options)
      .then(res => res.json())
      .then(result => this.setState({ issues: result.docs }));
    this.props.history.push(url);
  }
  
  handleError(err) {
    err.then(error => console.log(error));
  }
  
  toggleFilter() {
    this.setState(prev => ({filterToggle: !prev.filterToggle, newIssueToggle: false}));
  }
  
  toggleNewIssue() {
    this.setState(prev => ({newIssueToggle: !prev.newIssueToggle, filterToggle: false}));
  }
  
  clearFilters() {
    this.handleFetch(this.props.location.pathname);
    this.resetFilters();
  }
  
  resetFilters() {
    this.setState({
      id: '',
      open: '',
      title: '',
      text: '',
      creator: '',
      assignee: '',
      status: '',
      createDate: '',
      updateDate: '',
    });
  }
  
  submitFilter() {
    let model = ['_id=', 'open=', 'issue_title=', 'issue_text=', 'created_by=', 'assigned_to=', 'status_text=', 'created_on=', 'updated_on='];
    let filters = ['id', 'open', 'title', 'text', 'creator', 'assignee', 'status', 'createDate', 'updateDate'];
    let urlStr = this.props.location.pathname + '?';
    let filter = filters.map((el, i) => {
      return this.state[el] ? model[i] + this.state[el] + '&' : ''
    }).reduce((acc, curr) => acc += curr).slice(0, -1);
    let route = urlStr + filter;
    this.handleFetch(route);
  }
  
  submitNewIssue(e) {
    e.preventDefault();
    let issue = {
      issue_title: this.state.new_title,
      issue_text:  this.state.new_text,
      created_by:  this.state.new_creator,
      assigned_to: this.state.new_assignee,
      status_text: this.state.new_status,
      created_on:  new Date().toISOString(),
      updated_on:  new Date().toISOString(),
      open:        true,
    };
    let options = {
      method: 'POST', 
      body: JSON.stringify(issue), 
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    };
    
    fetch(this.props.location.pathname, options)
      .then(res => {
        if (res.ok) {
          this.resetNewIssue();
          this.props.history.push(this.props.location.pathname)
        } else {
          this.handleError(res.json());
        }
      });
  }
  
  cancelNewIssue() {
    this.resetNewIssue();
  }
  
  resetNewIssue() {
    this.setState(prev => ({
      newIssueToggle: !prev.newIssueToggle,
      new_title: '',
      new_text: '',
      new_creator: '',
      new_assignee: '',
      new_status: ''
    }));
  }
  
  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  }
  
  render() {
    return(
      <div className="container-fluid">
        
        <div className="row">
          <div className="col">
            <Projects 
              projects={this.state.projects.length && this.state.projects}
              clickedProject={this.handleFetch}
            />
          </div>
          
          <div className="col">
            {this.props.location.pathname === '/' ? (
              <h6>Select a project</h6>
            ) : (
              <div>
                <button type="button" onClick={this.toggleFilter}>Filter</button>
                <button type="button" onClick={this.toggleNewIssue}>New Issue</button>
              </div>
            )}
            <div className={this.state.filterToggle ? 'show-filter' : 'hide-filter'}>
              <Filter
                clearFilters={this.clearFilters}
                submitFilter={this.submitFilter}
                cancelFilter={this.toggleFilter}
                change={this.handleChange}
                open={this.state.open}
                id={this.state.id}
                text={this.state.text}
                status={this.state.status}
                updateDate={this.state.updateDate}
                createDate={this.state.createDate}
                creator={this.state.creator}
                assignee={this.state.assignee}
                title={this.state.title}
              />
            </div>
            <div className={this.state.newIssueToggle ? 'show-newIssue' : 'hide-newIssue'}>
              <NewIssue 
                newTitle={this.state.new_title}
                newText={this.state.new_text}
                newCreator={this.state.new_creator}
                newAssignee={this.state.new_assignee}
                newStatus={this.state.new_status}
                change={this.handleChange}
                submitNewIssue={this.submitNewIssue}
                cancelNewIssue={this.cancelNewIssue}
              />
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col">
            <div className="d-flex flex-column align-items-center w-100">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/api/issues/:project" render={(props) => 
                  {return this.state.issues.length && this.state.issues.map(el => 
                    <ProjectIssue
                      {...props}
                      key={el._id}
                      issue={el} 
                      update={this.handleUpdateIssue} 
                    />
                  )}}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render((
  <Router>
    <Route children={({...rest}) => <App {...rest} /> }/>
  </Router>
), document.getElementById('application'));


/*
  <Route path="/api/issues/:project" component={(props) => <Issues {...props} issues={this.state.issues.length && this.state.issues} />} />
  <Route path="/api/issues/:project" component={(props) => <Issues {...props} />} />
*/

/*
  handleFilter(e) {
    let query = e.target.value ? '?open=' : '';
    let val = query ? e.target.value === 'open' ? 'true' : 'false' : '';
    this.props.history.push(this.props.location.pathname + query + val);
  }
*/