import React from 'react';
import { ToggleButtons } from '../_app/ToggleButtons.js';
import { Filter } from '../_app/Filter.js';
import { NewIssue } from '../_app/NewIssue.js';

const ToolBar = (props) => {
  return(
    <div id="toolbar" className={props.location ? 'toolbar-close' : 'toolbar-open'}>
      <ToggleButtons 
        click={props.toggle} 
        hide={props.location}
        message={props.message}
      />
      {props.form ? (
        <div id="toolbar-form" className="form-out btm-brd">
          <Filter 
            filtering={props.filtering}
            toggle={props.toggle}
            filter={props.fetch}
          />
          <NewIssue 
            creating={props.creating}
            toggle={props.toggle}
            submit={props.submitNew}
          />
        </div>
      ) : (
        <div id="toolbar-form" className="form-in">
          <Filter 
            filtering={props.filtering}
            toggle={props.toggle}
            filter={props.fetch}
          />
          <NewIssue 
            creating={props.creating}
            toggle={props.toggle}
            submit={props.submitNew}
          />
        </div>
      )}
    </div>
  );
};

export { ToolBar };



