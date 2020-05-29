import React from 'react';
import { Link } from 'react-router-dom';

import GeneralComponent from './GeneralComponent';
import '../styles/header.css';

class Header extends GeneralComponent {
  spaceNavItemTemplate = (spaceID, spaceName, spaceStatus, className) => {
    return(
      <span key={spaceID} className="spaceNavItem ">
        <Link className={className} tabIndex="-1" to={{
          pathname: "/r/",
          state: {
            pathname: "/s/",
            state: {
              space: {
                id: spaceID,
                name: spaceName,
                status: spaceStatus
              }
            }
          }
        }}>
          {spaceName}
        </Link>
      </span>
    );
  }

  determineActiveSpace = (spaceID, spaceName, spaceStatus) => {
    if(spaceID === this.props.spaceID) {
      return(this.spaceNavItemTemplate(spaceID, spaceName, spaceStatus, "active"));
    }

    return(this.spaceNavItemTemplate(spaceID, spaceName, spaceStatus, ""));
  }

  renderSpaces = () => {
    const users = this.getSessionItem('users');
    console.log(users);
    if(users) {
      return Object.values(users).map(user => (
        this.determineActiveSpace(user.space, user.space_name, user.space_status)
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
            <Link to="/" tabIndex="-1" onClick={this.clearSession}>CLEAR</Link>
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
