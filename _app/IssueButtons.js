import React from 'react';

const IssueButtons = (props) => {
  return(
    <div className="col px-0">
      {props.updating ? (
        <div className="d-flex">
          <button className="btn btn-sm btn-block mt-0 btn-success" onClick={props.save}>Save</button>
          <button type="button" className="btn btn-sm btn-block mt-0 btn-danger" onClick={props.cancel}>Cancel</button>
        </div>
      ) : (
        <div className="d-flex">
          <button type="button" className="btn btn-sm btn-block mt-0 btn-info" onClick={props.updater}>Update</button>
          {props.canClose ? (
            <button type="button" className="btn btn-sm btn-block mt-0 btn-success" onClick={props.close}>Close</button>
          ) : (
            <span></span>
          )}
          <button type="button" className="btn btn-sm btn-block mt-0 btn-danger" onClick={props.delete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export { IssueButtons };