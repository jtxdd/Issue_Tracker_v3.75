import React from 'react';

const Filter = (props) => {
  return(
    <div>
      <button onClick={props.clearFilters}>Clear Filters</button>
      <select name="open" value={props.open} onChange={props.change}>
        <option value=""></option>
        <option value="true">Open</option>
        <option value="false">Closed</option>
      </select>
      <br/>
      <input type="text" name="id" value={props.id} onChange={props.change} placeholder="Filter Id" />
      <br/>
      <input type="text" name="title" value={props.title} onChange={props.change} placeholder="Filter Title" />
      <br/>
      <input type="text" name="text" value={props.text} onChange={props.change} placeholder="Filter Text" />
      <br/>
      <input type="text" name="status" value={props.status} onChange={props.change} placeholder="Filter Status" />
      <br/>
      <input type="text" name="creator" value={props.creator} onChange={props.change} placeholder="Filter Creator" />
      <br/>
      <input type="text" name="assignee" value={props.assignee} onChange={props.change} placeholder="Filter Assignee" />
      <br/>
      <input type="date" name="createDate" value={props.createDate} onChange={props.change} placeholder="Filter Create Date" />
      <br/>
      <input type="date" name="updateDate" value={props.updateDate} onChange={props.change} placeholder="Filter Update Date" />
      <button onClick={props.submitFilter}>Submit</button>
      <button onClick={props.cancelFilter}>Cancel</button>
    </div>
  );
};

export { Filter };