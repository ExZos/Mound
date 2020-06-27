import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import GeneralComponent from './GeneralComponent';
import Sidebar from './Sidebar';
import ConfirmDialog from './ConfirmDialog';
import MessageSpace from './MessageSpace';
import PendingUser from './PendingUser';
import PendingSpace from './PendingSpace';
import { server, api } from '../server';
import '../styles/space.css';

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

  displayUser = (users) => {
    if(users && users[this.state.space.id]) {
      return(
          <Typography className="userName">
            {users[this.state.space.id].name}
          </Typography>
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
              user={user}
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
          <input type="text" name="name" placeholder="Type a user name..." autoFocus
            value={this.state.user.name}
            onChange={(e) => this.handleInputChange(e, 'user')}
          />

          <button tabIndex="-1" onClick={this.getUserInSpaceByName}>ENTER</button>
        </form>

        <ConfirmDialog showModal={this.state.showModal}
          toggleModal={this.toggleModal} confirm={this.addUser}
          mHeader={"User '" + this.state.user.name + "' does not exist"}
          mBody={"Do you want to request to join this space as '" + this.state.user.name + "'"}
        />
      </div>
    );
  }

  // TODO: fix user name display
  render() {
    const users = this.getSessionItem('users');

    return (
      <div id="space">
        <Sidebar />

        <AppBar position="sticky">
          <Toolbar>
            {this.displayUser(users)}

            <Typography className="spaceName">
              {this.state.space.name}
            </Typography>

            <IconButton className="closeSpace" aria-label="close" onClick={() => this.closeSpace('users', this.state.space.id)}>
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
