import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNav = () => {
  return(
    <header id="topNav">
      <nav className="navbar navbar-dark bg-dark">
        <NavLink to="/">
          <h3>Issue Tracker</h3>
        </NavLink>
      </nav>
    </header>
  );
};

export { TopNav };