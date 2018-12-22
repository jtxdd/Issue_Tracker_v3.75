import React from 'react';

const ToggleButtons = (props) => {
  return(
    <div id="toolbar-buttons" className={props.hide ? 'hide-toggles' : 'show-toggles d-flex'}>
      <h6 id="notification" className={props.message ? 'text-fade' : ''}>{props.message}</h6>
      <div className="ml-auto">
        {props.message ? (
          <button id="message_dismiss" type="button" className="btn btn-sm btn-danger" onClick={props.click}>
            <span className="fas fa-times" />
          </button>
        ) : (
          <span></span>
        )}
        <button id="filter_toggle" className="btn btn-sm btn-secondary" type="button" onClick={props.click}>
          <span>Filter</span>
          <span className="ml-1 fas fa-filter" />
        </button>
        <button id="newIssue_toggle" className="btn btn-sm btn-primary" type="button" onClick={props.click}>
          <span>New</span>
          <span className="ml-1 fas fa-plus" />
        </button>
      </div>
    </div>
  );
};

export { ToggleButtons };