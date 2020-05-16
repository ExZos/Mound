import React from 'react';
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap';

import GeneralComponent from './GeneralComponent';
import '../styles/header.css';

class Header extends GeneralComponent {
  render() {
    return(
      <Nav id="header">
        <NavItem>
          <NavLink href="/">Home</NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="/spaces/">Spaces</NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="/u/">Users</NavLink>
        </NavItem>

        <NavItem>
          <NavLink href="/m/">Messages</NavLink>
        </NavItem>
      </Nav>
    )
  }
}

export default Header;
