import React from 'react';
import { ProjectIssue } from '../_app/ProjectIssue.js';

const Issues = (props) => {
  return(
    <div>
      <h3 id="selected-title" >{props.selected} — Issues</h3>
      <div id="issue-list" className="d-flex flex-column align-items-center w-100">
        {props.issues && props.issues.map(el => 
          <ProjectIssue 
            key={el.key}
            {...props}
            issue={el} 
            update={props.updateIssues}
            notification={props.notify}
          />
        )}
      </div>
    </div>
  );
};

export { Issues };