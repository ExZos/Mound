import React from 'react';
import { Link } from 'react-router-dom';

import GeneralComponent from './GeneralComponent';
import '../styles/header.css';

class Header extends GeneralComponent {
  spaceNavItemTemplate = (spaceID, spaceName, className) => {
    return(
      <span key={spaceID} className="spaceNavItem ">
        <Link className={className} tabIndex="-1" to={{
          pathname: "/r/",
          state: {
            pathname: "/s/",
            state: {
              space: {
                id: spaceID,
                name: spaceName
              }
            }
          }
        }}>
          {spaceName}
        </Link>
      </span>
    );
  }

  determineActiveSpace = (spaceID, spaceName) => {
    if(spaceID === this.props.spaceID) {
      return(
        this.spaceNavItemTemplate(spaceID, spaceName, "active")
      );
    }

    return(
      this.spaceNavItemTemplate(spaceID, spaceName, "")
    );
  }

  renderSpaces = () => {
    const users = this.getSessionItem('users');

    if(users) {
      return Object.values(users).map(user => (
        this.determineActiveSpace(user.space, user.space_name)
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
    )
  }
}

export default Header;
