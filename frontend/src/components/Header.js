import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';

import GeneralComponent from './GeneralComponent';
import '../styles/header.css';

class Header extends GeneralComponent {
  renderSpaces() {
    const users = this.getSessionItem('users');

    if(users) {
      return Object.values(users).map(user => (
        <NavItem key={user.space} onClick={this.reload}>
          <Link tabIndex="-1" to={{
            pathname: "/r/",
            state: {
              pathname: "/s/",
              state: {
                spaceID: user.space
              }
            }
          }}>
            {user.space_name}
          </Link>
        </NavItem>
      ));
    }
  }

  // TODO: collapse nav items when cluttered
  render() {
    return(
      <Nav id="header">
        <NavItem>
          <Link to="/" tabIndex="-1">
            Home
          </Link>
        </NavItem>

        {this.renderSpaces()}

        <NavItem>
          <Link to="/" tabIndex="-1" onClick={this.clearSession}>CLEAR</Link>
        </NavItem>
      </Nav>
    )
  }
}

export default Header;
