import React from 'react';

const Alert = (props) => {
  return(props.message ? (
    <div className="clearfix">
      <h6 className="float-left">{props.message}</h6>
      <button id="message_dismiss" type="button" className="float-right btn btn-sm btn-danger fas fa-times" onClick={props.toggle} />
    </div>
  ) : (
    <span></span>
  ));
};

export { Alert };


/*
  <div className="row justify-content-center mb-3">
    <div className="col text-center clearfix">
      <h6 className="float-left">{props.message}</h6>
      <button id="message_dismiss" type="button" className="float-right btn btn-sm btn-danger fas fa-times" onClick={props.toggle} />
    </div>
  </div>
*/