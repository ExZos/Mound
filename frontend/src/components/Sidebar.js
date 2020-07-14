import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from '@material-ui/core';

import LandscapeIcon from '@material-ui/icons/Landscape';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ClearAllIcon from '@material-ui/icons/ClearAll';

import GeneralComponent from './GeneralComponent';
import '../styles/sidebar.scss';

// TODO: new message indicators
class Sidebar extends GeneralComponent {
  componentDidMount(props) {
    this.sidebarContainer = document.getElementsByClassName('MuiDrawer-paper')[0];

    this.pushMainContent();
  }

  componentDidUpdate() {
    this.pushMainContent();
  }

  pushMainContent = () => {
    if(this.sidebarContainer) {
      document.body.style.marginLeft = this.sidebarContainer.offsetWidth + 'px';
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

  // TEMP clear link
  render() {
    return (
      <Drawer id="sidebarContainer" variant="permanent">
        <div id="sidebar">
          <div className="logo">
            <LandscapeIcon fontSize="large" />
          </div>

          <div className="spaceNav">
            {this.renderSpaces()}
          </div>

          <div className="menuItem">
            <Link to="/" tabIndex="-1">
              <AddCircleOutlineIcon fontSize="large" />
            </Link>
          </div>

          <div className="menuItem clear">
            <Link to="/" tabIndex="-1" onClick={this.clearSession}>
              <ClearAllIcon fontSize="large" />
            </Link>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default Sidebar;
