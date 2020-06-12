import React from 'react';
import { Link } from 'react-router-dom';

import GeneralComponent from './GeneralComponent';
import '../styles/header.css';

class Header extends GeneralComponent {
  // TODO: new message indicators
  renderSpaces = () => {
    const users = this.getSessionItem('users');

    if(users) {
      return Object.values(users).map(user => (
        <span key={user.space} className="spaceNavItem ">
          <Link className={(user.space === this.props.spaceID) ? "active" : ""} tabIndex="-1" to={{
            pathname: "/r/",
            state: {
              pathname: "/s/",
              state: {
                space: {
                  id: user.space,
                  name: user.space_name,
                  status: user.space_status
                }
              }
            }
          }}>
            {user.space_name}
          </Link>
        </span>
      ));
    }
  }

  render() {
    return(
      <div id="header">
        <div id="menuNav">
          <span className="menuItem">
            <Link to="/" tabIndex="-1">
              Home
            </Link>
          </span>

          <span className="menuItem">
            <Link to="/" className="clearSesh" tabIndex="-1" onClick={this.clearSession}>CLEAR</Link>
          </span>
        </div>

        <div id="spaceNav">
          {this.renderSpaces()}
        </div>
      </div>
    );
  }
}

export default Header;
