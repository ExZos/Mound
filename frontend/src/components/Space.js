import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, TextField, Button, Menu, MenuItem } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';

import GeneralComponent from './GeneralComponent';
import Sidebar from './Sidebar';
import ConfirmDialog from './ConfirmDialog';
import MessageSpace from './MessageSpace';
import PendingUser from './PendingUser';
import PendingSpace from './PendingSpace';
import { server, api } from '../server';
import '../styles/space.scss';

class Space extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = {
      space: {
        id: this.props.location.state.space.id,
        name: this.props.location.state.space.name,
        status: this.props.location.state.space.status
      },
      user: {
        name: '',
        space: this.props.location.state.space.id,
        space_name: this.props.location.state.space.name,
        space_status: this.props.location.state.space.status
      },
      showModal: false
    };
  }

  getUserInSpaceByName = async () => {
    try {
      const res = await server.get(api.getUserInSpaceByName + this.state.space.id + '/' + this.state.user.name);

      // Existing user
      this.addToSessionArrayItem('users', res.data);

      this.setState({
        user: res.data
      });
    } catch (e) {
      this.getPendingJoinPollInSpaceByName();
    }
  }

  getPendingJoinPollInSpaceByName = async () => {
    try {
      const res = await server.get(api.getPendingJoinPollInSpaceByName + this.state.space.id + '/' + this.state.user.name);

      // Existing join poll
      let user = this.state.user;
      user.poll = res.data.id;

      this.addToSessionArrayItem('users', this.state.user);

      this.setState({
        poll: res.data
      });
    } catch (e) {
      if(this.state.user.name) {
        this.toggleModal();
      }
    }
  }

  addUser = () => {
    // Approved space: create join request
    if(this.state.space.status) {
      const poll = {
        space: this.state.space.id,
        name: this.state.user.name
      };

      server.post(api.createNameRelatedPoll, poll)
        .then((res) => {
          let user = this.state.user;
          user.poll = res.data.id;

          this.addToSessionArrayItem('users', user);

          this.setState({
            poll: res.data
          });
        });
    }
    // Pending space: create user
    else {
      server.post(api.createUserNApproveSpace, this.state.user)
        .then((res) => {
          this.addToSessionArrayItem('users', res.data['user']);

          this.setState({
            user: res.data['user'],
            space: res.data['space']
          });
        });
    }
  }

  closeSpace = (key, spaceID) => {
    this.removeSessionArrayItem(key, spaceID);

    this.props.history.push('/');
  }

  updateState = () => {
    this.setState({
      space: {
        id: this.props.location.state.space.id,
        name: this.props.location.state.space.name,
        status: this.props.location.state.space.status
      },
      user: {
        name: this.state.user.name,
        space: this.props.location.state.space.id,
        space_name: this.props.location.state.space.name,
        space_status: this.props.location.state.space.status
      }
    });
  }

  displayMenu = (users) => {
    if(users && users[this.state.space.id]) {
      return(
        <React.Fragment>
          <IconButton className="openMenu" tabIndex="-1" onClick={this.setMenuAnchor}>
            <MenuIcon />
          </IconButton>

          <Menu id="spaceNavMenu" open={Boolean(this.state.menuAnchor)} anchorEl={this.state.menuAnchor} onClose={this.removeMenuAnchor}
            getContentAnchorEl={null} anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <MenuItem disabled>
              {users[this.state.space.id].name}
            </MenuItem>

            <MenuItem onClick={() => this.removeMenuAnchorNSetTab(undefined)}>
              Messages
            </MenuItem>

            <MenuItem onClick={() => this.removeMenuAnchorNSetTab(1)}>
              Polls
            </MenuItem>

            <MenuItem onClick={() => this.removeMenuAnchorNSetTab(2)}>
              Change Name
            </MenuItem>
          </Menu>
        </React.Fragment>
      );
    }
  }

  toggleMessages = (users) => {
    if(users && users[this.state.space.id]) {
      const user = users[this.state.space.id];

      if(user.space_status) {
        // Approved space and user
        if(user.id) {
          return (
            <MessageSpace history={this.props.history} updateState={this.updateState}
              user={user} tab={this.state.tab}
            />
          );
        }

        // Approved space but pending user
        return (
          <PendingUser updateState={this.updateState} user={user} />
        );
      }

      // Pending space
      return (
        <PendingSpace updateState={this.updateState} user={user} />
      );
    }

    return (
      <div>
        <form id="getUserInSpaceByName" onSubmit={this.handleFormSubmit}>
          <div className="textFieldWButton">
            <TextField name="name" label="Type a user name..." autoFocus
              size="small" variant="outlined"
              value={this.state.user.name}
              onChange={(e) => this.handleInputChange(e, 'user')}
            />

            <Button type="submit" color="primary"
              size="small" variant="outlined"
              tabIndex="-1" onClick={this.getUserInSpaceByName}>
                ENTER
            </Button>
          </div>
        </form>

        <ConfirmDialog showModal={this.state.showModal}
          toggleModal={this.toggleModal} confirm={this.addUser}
          mHeader={"User '" + this.state.user.name + "' does not exist"}
          mBody={"Do you want to request to join this space as '" + this.state.user.name + "'"}
        />
      </div>
    );
  }

  render() {
    const users = this.getSessionItem('users');

    return (
      <div id="space">
        <Sidebar />

        <AppBar position="sticky">
          <Toolbar>
            {this.displayMenu(users)}

            <Typography className="spaceName">
              {this.state.space.name}
            </Typography>

            <IconButton className="closeSpace" aria-label="close" tabIndex="-1" onClick={() => this.closeSpace('users', this.state.space.id)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <br />

        {this.toggleMessages(users)}
      </div>
    );
  }
}

export default Space;
