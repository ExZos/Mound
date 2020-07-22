import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from '@material-ui/core';

import LandscapeIcon from '@material-ui/icons/Landscape';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ClearAllIcon from '@material-ui/icons/ClearAll';

import GeneralComponent from './GeneralComponent';
import '../styles/sidebar.scss';

function Sidebar(props) {
  const generalComponent = new GeneralComponent();

  const sidebarContainer = useRef(null);
  const users = generalComponent.getSessionItem('users');

  useEffect(() => {
    sidebarContainer.current = document.getElementsByClassName('MuiDrawer-paper')[0];

    if(sidebarContainer.current) {
      document.body.style.marginLeft = sidebarContainer.current.offsetWidth + 'px';
    }
  });

  const renderSpaces = () => {
    if(users) {
      return Object.values(users).map(user => (
        <div key={user.space} className="spaceNavItem ">
          <Link className={(user.space === props.spaceID) ? "active" : ""} tabIndex="-1" to={{
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

  return (
    <Drawer id="sidebarContainer" variant="permanent">
      <div id="sidebar">
        <div className="logo">
          <LandscapeIcon fontSize="large" />
        </div>

        <div className="spaceNav">
          {renderSpaces()}
        </div>

        <div className="menuItem">
          <Link to="/" tabIndex="-1">
            <AddCircleOutlineIcon fontSize="large" />
          </Link>
        </div>

        <div className="menuItem clear">
          <Link to="/" tabIndex="-1" onClick={generalComponent.clearSession}>
            <ClearAllIcon fontSize="large" />
          </Link>
        </div>
      </div>
    </Drawer>
  );
}

export default Sidebar;
