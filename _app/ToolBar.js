import React from 'react';
import { ToggleButtons } from '../_app/ToggleButtons.js';
import { Filter } from '../_app/Filter.js';
import { NewIssue } from '../_app/NewIssue.js';
import { Alert } from '../_app/Alert.js';

const ToolBar = (props) => {
  return(
    <div className={props.location ? 'toolbar-close' : 'toolbar-open'}>
      <ToggleButtons 
        click={props.toggle} 
        hide={props.location}
        message={props.message}
      />
      <div id="toolbar-form">
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
    </div>
  );
};

export { ToolBar };

/*
  <Alert 
          message={props.message}
          toggle={props.toggle}
        />
*/


