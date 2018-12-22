import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav_Head = (props) => {
  return(
    <div className="row border-bottom border-white mr-0">
      <div className="col-8">
        <h5 className="m-2 text-info">PROJECTS</h5>
      </div>
      <div className="col- align-self-center pr-0 ml-auto mr-2">
        <button id="sort_projects" className="btn btn-sm btn-outline-info fas fa-sort" type="button" title="Sort title" onClick={props.sort} />
      </div>
    </div>
  );
};

const Projects = (props) => {
  return(props.projects.length ? (
    props.projects.map(el => 
      <div key={el.project_id}>
        <NavLink id={el.route} to={el.route} className="project nav-link" activeClassName="selected" onClick={props.getIssues}>
          {el.title}
        </NavLink>
      </div>
    )) : (
      <span>Loading...</span>
    )
  );
};

const SideNav = (props) => {
  return(
    <aside>
      <nav className="nav flex-column">
        <Nav_Head sort={props.sort} />
        <Projects 
          projects={props.projects}
          getIssues={props.getIssues}
        />
      </nav>
    </aside>
  );
};

export { SideNav };