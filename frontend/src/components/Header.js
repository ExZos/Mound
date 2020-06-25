import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from '@material-ui/core';

import GeneralComponent from './GeneralComponent';
import '../styles/header.css';

// TODO: new message indicators
class Header extends GeneralComponent {
  componentDidMount(props) {
    this.pushMainContent();
  }

  componentDidUpdate() {
    this.pushMainContent();
  }

  pushMainContent = () => {
    const sidebarContainer = document.getElementsByClassName('MuiPaper-root')[0];

    if(sidebarContainer) {
      document.body.style.marginLeft = sidebarContainer.offsetWidth + 'px';
    }
  }

  renderSpaces = () => {
    const users = this.getSessionItem('users');

    if(users) {
      return Object.values(users).map(user => (
        <div key={user.space} className="spaceNavItem ">
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
        </div>
      ));
    }
  }

  render() {
    return (
      <Drawer invert variant="permanent">
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
      </Drawer>
    );
  }
}

export default Header;
