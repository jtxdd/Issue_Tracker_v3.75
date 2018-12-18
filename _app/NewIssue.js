import React from 'react';

const NewIssue = (props) => {
  return(
    <form onSubmit={props.submitNewIssue}>
      <input type="text" name="new_title" value={props.newTitle} onChange={props.change} placeholder="New Issue Title" required />
      <br/>
      <textarea name="new_text" value={props.newText} onChange={props.change} required />
      <br/>
      <input type="text" name="new_creator" value={props.newCreator} onChange={props.change} placeholder="New Creator" required />
      <br/>
      <input type="text" name="new_assignee" value={props.newAssignee} onChange={props.change} placeholder="New Assignee" />
      <br/>
      <textarea name="new_status" value={props.newStatus} onChange={props.change} />
      <br/>
      <div>
        <button>Submit</button>
        <button type="button" onClick={props.cancelNewIssue}>Cancel</button>
      </div>
    </form>
  );
};

export { NewIssue };