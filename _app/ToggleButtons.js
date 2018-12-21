import React from 'react';

const ToggleButtons = (props) => {
  return(
    <div className={props.hide ? 'hide-toggles' : 'show-toggles d-flex'}>
      <h6 id="notification">{props.message}</h6>
      <div className="ml-auto">
        {props.message ? (
          <button id="message_dismiss" type="button" className="btn btn-sm btn-outline-danger" onClick={props.click}>
            <span className="fas fa-times" />
          </button>
        ) : (
          <span></span>
        )}
        <button id="filter_toggle" className="btn btn-sm btn-outline-secondary" type="button" onClick={props.click}>
          <span>Filter</span>
          <span className="ml-1 fas fa-filter" />
        </button>
        <button id="newIssue_toggle" className="btn btn-sm btn-outline-primary" type="button" onClick={props.click}>
          <span>New</span>
          <span className="ml-1 fas fa-plus" />
        </button>
      </div>
    </div>
  );
};

export { ToggleButtons };

//<div className={props.hide ? 'hide-toggles' : 'show-toggles d-flex justify-content-end'}>

/*
  <div className={props.hide ? 'hide-toggles' : 'show-toggles clearfix'}>
      <div className="float-left mr-auto">
        <h6>{props.message}</h6>
      </div>
      <div className="float-right ml-auto">
        {props.message ? (
          <button id="message_dismiss" type="button" className="btn btn-sm btn-danger fas fa-times" onClick={props.click} />
        ) : (
          <span></span>
        )}
        <button id="filter_toggle" className="btn btn-sm btn-outline-secondary" type="button" onClick={props.click}>
          <span>Filter</span>
          <span className="ml-1 fas fa-filter" />
        </button>
        <button id="newIssue_toggle" className="btn btn-sm btn-outline-primary" type="button" onClick={props.click}>
          <span>New</span>
          <span className="ml-1 fas fa-plus" />
        </button>
      </div>
    </div>
*/