import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Projects } from '../_app/Projects.js';
import { ProjectIssue } from '../_app/ProjectIssue.js';
import { Issues } from '../_app/Issues.js';
import { TopBar } from '../_app/TopBar.js';
import { ToolBar } from '../_app/ToolBar.js';

const Home = () => {
  return(
    <div className="">
      <h3>Select A Project</h3>
    </div>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      issues: [],
      creating: false,
      filtering: false,
      updateMessage: '',
      selected: '',
      message: '',
      sort: {
        projects:{sorted: false, style: ''},
        issues:{sorted: false, style: ''}
      }
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
    toggle[e.target.id.split('_')[0]]();
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
  }
  
  render() {
    return(
      <div>
        <TopBar />
        <Projects 
          projects={this.state.projects.length && this.state.projects}
          getIssues={(e) => this.handleFetch(e.target.id)}
          sort={this.handleSort}
        />
        <div id="toolbar">
          <ToolBar 
            toggle={this.handleToggle}
            location={this.props.location.pathname === '/'}
            filtering={this.state.filtering}
            creating={this.state.creating}
            fetch={this.handleFetch}
            submitNew={this.submitNew}
            message={this.state.message}
          />
        </div>
        <div id="content">
          <Switch>
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
          </Switch>
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
  <Alert 
    message={this.state.message}
    toggle={this.handleToggle}
  />
  <ToggleButtons 
    click={this.handleToggle} 
    hide={this.props.location.pathname === '/'} 
  />
  <div id="toolbar-form">
    <Filter 
      filtering={this.state.filtering}
      toggle={this.handleToggle}
      filter={this.handleFetch}
    />
    <NewIssue 
      creating={this.state.creating}
      toggle={this.handleToggle}
      submit={this.submitNew}
    />
  </div>
*/

/*
const { new_title, new_text, new_creator, new_assignee, new_status } = this.state;
const newIssueState = [new_title, new_text, new_creator, new_assignee, new_status];
  <NewIssue
    creating={this.state.creating}
    clear={this.resetForm}
    change={this.handleChange}
    submit={this.submitForm}
    {...newIssueState}
  />
  
  const { open, id, text, status, updateDate, createDate, creator, assignee, title } = this.state;
  const filterState = [open, id, text, status, updateDate, createDate, creator, assignee, title];
  <Filter
    filtering={this.state.filtering}
    clear={this.resetForm}
    change={this.handleChange}
    submit={this.submitForm}
    {...filterState}
  />
  
*/



/*submitForm(e) {
    const submit = {
      filter:() => {
        const model = ['_id=', 'open=', 'issue_title=', 'issue_text=', 'created_by=', 'assigned_to=', 'status_text=', 'created_on=', 'updated_on='];
        const filters = ['id', 'open', 'title', 'text', 'creator', 'assignee', 'status', 'createDate', 'updateDate'];
        const url = this.props.location.pathname + '?';
        const search = filters.map((el, i) => {
          return this.state[el] ? model[i] + this.state[el] + '&' : ''
        }).reduce((acc, curr) => acc += curr).slice(0, -1);
        const route = url + search;
        this.handleFetch(route);
      },
      
      newIssue:() => {
        const { new_title, new_text, new_creator, new_assignee, new_status } = this.state;
        const issue = {
          issue_title: new_title,
          issue_text:  new_text,
          created_by:  new_creator,
          assigned_to: new_assignee,
          status_text: new_status,
          created_on:  new Date().toISOString(),
          updated_on:  new Date().toISOString(),
          open:        true,
        };
        const options = {
          method: 'POST', 
          body: JSON.stringify(issue), 
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
        };
        fetch(this.props.location.pathname, options)
          .then(res => res.json())
          .then(result => {
            if (result.docs) {
              let issues = this.state.issues;
              result.value.key = result.value._id + '_' + this.genKeyId();
              issues = [...issues, result.value];
              this.setState({ issues: issues, updateMessage: result.message });
              //this.resetForm({target:{id: 'submit_newIssue'}});
            } else {
              this.setState({updateMessage: 'Insert Failed - ' + result.message});
            }
          });
        
      }
    };
    
    const form = e.target.id.split('_')[1];
    submit[form]();
  }*/


/*
  this.resetForm = this.resetForm.bind(this);

  resetForm(e) {
    const reset = {
      filter: () => {
        this.setState({
          filtering: false,
          id: '',
          open: '',
          title: '',
          text: '',
          creator: '',
          assignee: '',
          status: '',
          createDate: '',
          updateDate: ''
        });
        this.handleFetch(this.props.location.pathname);
      },
      
      newIssue:() => {
        this.setState({
          creating: false,
          new_title: '',
          new_text: '',
          new_creator: '',
          new_assignee: '',
          new_status: ''
        });
      }
    };
    
    const form = e.target.id.split('_')[1];
    reset[form]();
  }
*/


/*
  this.dismissUpdateMessage = this.dismissUpdateMessage.bind(this);

  dismissUpdateMessage() {
    this.setState(prev => ({updateMessage: !prev.updateMessage}));
  }
*/

/*
this.getIssues = this.getIssues.bind(this);

getIssues(url) {
    fetch(url).then(res => res.json())
      .then(result => {
        result.docs.forEach(el => el.key = el._id + '_' + this.genKeyId());
        this.setState({ issues: result.docs });
        this.props.history.push(url);
      });
  }


  <Projects 
    projects={this.state.projects.length && this.state.projects
    clicked_project={this.getIssues}
  />
*/