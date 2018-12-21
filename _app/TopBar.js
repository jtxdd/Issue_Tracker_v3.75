import React from 'react';
import { NavLink } from 'react-router-dom';

const TopBar = () => {
  return(
    <header id="topBar">
      <nav className="navbar navbar-dark bg-dark">
        <NavLink to="/">
          <h3>Issue Tracker</h3>
        </NavLink>
      </nav>
    </header>
  );
};

export { TopBar };