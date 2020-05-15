import React from 'react';
import { Link } from 'react-router-dom';

import GeneralComponent from './GeneralComponent';
import '../styles/header.css';

class Header extends GeneralComponent {
  render() {
    return(
      <div className="header">
        <span>
          <Link to="/">Home</Link>
        </span>

        <span>
          <Link to="/spaces/">Spaces</Link>
        </span>

        <span>
          <Link to="/u/">Users</Link>
        </span>

        <span>
          <Link to="/m/">Messages</Link>
        </span>
      </div>
    )
  }
}

export default Header;