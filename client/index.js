import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { TopNav } from '../_app/TopNav.js';
import { SideNav } from '../_app/SideNav.js';
import { ToolBar } from '../_app/ToolBar.js';
import { Issues } from '../_app/Issues.js';
import { ProjectIssue } from '../_app/ProjectIssue.js';

const Home = () => {
  return(
    <div className="content">
      <h3>Select A Project</h3>
    </div>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      issues:   [],
      creating:  false,
      filtering: false,
      updateMessage: '',
      selected: '',
      message: '',
      sort: {
        projects: { sorted: false, style: '' },
        issues:   { sorted: false, style: '' }
      },
    };
    this.genKeyId  = this.genKeyId.bind(this);
    this.submitNew = this.submitNew.bind(this);
    this.getProjects  = this.getProjects.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFetch  = this.handleFetch.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleNotify = this.handleNotify.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.autoDismiss  = this.autoDismiss.bind(this);
  }
  
  componentDidMount() {
    this.getProjects();
  }
  
  getProjects() {
    fetch('/projects')
      .then(res => res.json())
      .then(result => {
        result.docs.forEach(el => {
          el.route = '/api/issues/' + el.title.replace(/\s/g, '_');
        });
        this.setState({ projects: result.docs });
      });
  }
  
  genKeyId() {
    const rngChar = () => {
      const rand = Math.floor(Math.random() * 26) + 97;
      return String.fromCharCode(rand);
    };
    let arr = Array(3).fill().map(el => rngChar());
    return arr.join('');
  }
  
  handleToggle(e) {
    const toggle = {
      filter:  () => this.setState(prev => ({ filtering: !prev.filtering, creating: false })),
      newIssue:() => this.setState(prev => ({ creating: !prev.creating, filtering: false })),
      message: () => this.setState(prev => ({ message: !prev.message }))
    };
    
    let item = '';
    if (e.target.id) {
      item = e.target.id.split('_')[0];
    } else {
      item = e.currentTarget.id.split('_')[0];
    }
    toggle[item]();
  }
  
  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  }
  
  handleFetch(url, options) {
    let selected = url.slice(url.lastIndexOf('/') + 1).replace(/_/g, ' ');
    let Fetch = options ? fetch(url, options) : fetch(url);
    
    Fetch.then(res => res.json())
      .then(result => {
        result.docs.forEach(el => {
          el.key = el._id + '_' + this.genKeyId();
        });
        this.setState({issues: result.docs, selected: selected});
        this.props.history.push(url);
      });
  }
  
  handleDelete(url, options) {
    let issues = this.state.issues;
    let id = JSON.parse(options.body)._id;
    
    issues = issues.filter(el => el._id !== id);
    
    fetch(url, options).then(res => res.json())
      .then(result => {
        if (result.docs) {
          this.setState({ issues: issues, message: result.message });
        } else {
          this.setState({ message: result.message });
        }
        this.autoDismiss(3000);
      });
  }
  
  submitNew(url, options) {
    let issues = this.state.issues;
    
    fetch(url, options).then(res => res.json())
      .then(result => {
        if (result.docs) {
          result.value.key = result.value._id + '_' + this.genKeyId();
          issues = [...issues, result.value];
          this.setState({ issues: issues, updateMessage: result.message });
        } else {
          this.setState({ message: 'Insert failed - ' + result.message });
        }
    });
  }
  
  handleSort(e) {
    let { sort, projects } = this.state;
    
    const a_z = () => projects.sort((a,b) => a.title.localeCompare(b.title));
    const z_a = () => projects.sort((a,b) => b.title.localeCompare(a.title));
    
    let sorter = {
      projects:() => {
        if (sort.projects.sorted) {
          projects = sort.projects.style === 'a-z' ? z_a() : a_z();
          sort.projects.style = sort.projects.style === 'a-z' ? 'z-a' : 'a-z';
        } else {
          projects = a_z();
          sort.projects.sorted = true;
          sort.projects.style = 'a-z';
        }
        return {projects: projects, sort: sort}
      },
      
      issues:() => {}
    };
    
    let sorted = sorter[e.target.id.split('_')[1]]();
    this.setState({ projects: sorted.projects, sort: sorted.sort });
  }
  
  handleNotify(message) {
    this.setState({ message });
    this.autoDismiss(3000);
  }
  
  dismissMessage() {
    this.setState(prev => ({ message: !prev.message }));
  }
  
  autoDismiss(val) {
    setTimeout(this.dismissMessage, val);
  }
  
  render() {
    return(
      <div>
        <TopNav />
        <SideNav 
          projects={this.state.projects.length && this.state.projects}
          getIssues={(e) => this.handleFetch(e.target.id)}
          sort={this.handleSort}
        />
        <ToolBar 
          toggle={this.handleToggle}
          location={this.props.location.pathname === '/'}
          filtering={this.state.filtering}
          creating={this.state.creating}
          fetch={this.handleFetch}
          submitNew={this.submitNew}
          message={this.state.message}
          form={this.state.filtering || this.state.creating}
        />
        <Route exact path="/" component={Home} />
        <Route path="/api/issues/:project" render={(props) => 
          <Issues
            {...props}
            selected={this.state.selected}
            issues={this.state.issues.length && this.state.issues}
            updateIssues={this.handleDelete}
            notify={this.handleNotify}
          />
        }/>
      </div>
    );
  }
}

ReactDOM.render((
  <BrowserRouter>
    <Route children={({...rest}) => <App {...rest} /> }/>
  </BrowserRouter>
), document.getElementById('application'));