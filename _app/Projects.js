import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/*class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = { projects: [], len: 0 };
    this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount() {
    fetch('/projects')
      .then(res => res.json())
      .then(result => this.setState({ projects: result.docs, len: result.docs.length}));
  }
  
  handleClick(e) {
    this.props.fetch(e.target.id);
  }
  
  render() {
    const base = '/api/issues/';
    const title = (title) => { return title.replace(/\s/g, '_') };
    return(
      <div>
        {this.state.projects.length && this.state.projects.map((el, i) => 
          <div key={el.project_id}>
            <Link id={base + title(el.title)} to={base + title(el.title)} onClick={this.handleClick}>{el.title}</Link>
          </div>
        )}
      </div>
    );
  }
}*/

const Projects = (props) => {
  const clicked = (e) => {
    props.clickedProject(e.target.id);
  };
  return(
    <div>
      {props.projects.length ? (
        props.projects.map(el => 
          <div key={el.project_id}>
            <Link id={el.route} to={el.route} onClick={clicked}>
              {el.title}
            </Link>
          </div>
      )) : (
        <span>Loading...</span>
      )}
    </div>
  );
};


export { Projects };