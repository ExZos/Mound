import React from 'react';
import { connect } from 'react-redux';
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

import { setShowDialog } from '../reducers/root';
import { setSpace } from '../reducers/space';
import { setUser, setUserName,
         getUserInSpaceByName } from '../reducers/user';
import { getPendingJoinPollInSpaceByName } from '../reducers/poll';

const mapStateToProps = (state) => {
  return {
    userLoaded: state.user.loaded,
    userError: state.user.error,
    pollLoaded: state.poll.loaded,
    pollError: state.poll.error,
    showDialog: state.root.showDialog,
    space: state.space.space,
    user: state.user.user,
    poll: state.poll.poll,
    state: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setShowDialog: (show) => dispatch(setShowDialog(show)),
    setSpace: (space) => dispatch(setSpace(space)),
    setUser: (user) => dispatch(setUser(user)),
    setUserName: (name) => dispatch(setUserName(name)),
    getUserInSpaceByName: (payload) => dispatch(getUserInSpaceByName(payload)),
    getPendingJoinPollInSpaceByName: (payload) => dispatch(getPendingJoinPollInSpaceByName(payload)),
  };
};

class Space extends GeneralComponent {
  constructor(props) {
    super(props);

    this.props.setSpace(this.props.location.state.space);
    this.props.setUser({
      space: this.props.location.state.space.id,
      space_name: this.props.location.state.space.name,
      space_status: this.props.location.state.space.status
    });

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
      showDialog: false
    };
  }

  getUserInSpaceByName = async () => {
    await this.props.getUserInSpaceByName({
      spaceID: this.props.space.id,
      userName: this.props.user.name
    });

    if(!this.props.userError) {
      // Existing user
      // TODO: move session logic to redux
      this.addToSessionArrayItem('users', this.props.user);
    }
    else if(this.props.user.name) {
      this.getPendingJoinPollInSpaceByName();
    }
  }

  getPendingJoinPollInSpaceByName = async () => {
    await this.props.getPendingJoinPollInSpaceByName({
      spaceID: this.props.space.id,
      userName: this.props.user.name
    });

    if(!this.props.pollError) {
      // Exisiting join poll
      this.addToSessionArrayItem('users', {
        ...this.props.user,
        poll: this.props.poll.id
      });
    }
    else {
      this.props.setShowDialog(true);
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
    // this.props.setSpace(this.props.location.state.space);

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
              value={this.props.user.name}
              onChange={(e) => this.props.setUserName(e.target.value)}
            />

            <Button type="submit" color="primary"
              size="small" variant="outlined"
              tabIndex="-1" onClick={this.getUserInSpaceByName}>
                ENTER
            </Button>
          </div>
        </form>

        <ConfirmDialog showDialog={this.props.showDialog}
          setShowDialog={() => this.props.setShowDialog(!this.props.showDialog)} confirm={this.addUser}
          mHeader={"User '" + this.props.user.name + "' does not exist"}
          mBody={"Do you want to request to join this space as '" + this.props.user.name + "'"}
        />
      </div>
    );
  }

  render() {
    const users = this.getSessionItem('users');

    return (
      <div id="space">
        <Sidebar spaceID={this.state.space.id} />

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

export default connect(mapStateToProps, mapDispatchToProps)(Space);
