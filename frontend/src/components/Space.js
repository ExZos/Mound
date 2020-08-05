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
import '../styles/space.scss';

import { setShowDialog, setMenuAnchor, removeMenuAnchorNSetTab } from '../reducers/root';
import { setSpace } from '../reducers/space';
import { setUser, setUserName,
         getUserInSpaceByName, createUserNApproveSpace } from '../reducers/user';
import { getPendingJoinPollInSpaceByName, createNameRelatedPoll } from '../reducers/poll';

const mapStateToProps = (state) => {
  return {
    userLoaded: state.user.loaded,
    userError: state.user.error,
    pollLoaded: state.poll.loaded,
    pollError: state.poll.error,
    showDialog: state.root.showDialog,
    menuAnchor: state.root.menuAnchor,
    tab: state.root.tab,
    space: state.space.space,
    user: state.user.user,
    poll: state.poll.poll,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setShowDialog: (show) => dispatch(setShowDialog(show)),
    setMenuAnchor: (menuAnchor) => dispatch(setMenuAnchor(menuAnchor)),
    removeMenuAnchorNSetTab: (tab) => dispatch(removeMenuAnchorNSetTab(tab)),
    setSpace: (space) => dispatch(setSpace(space)),
    setUser: (user) => dispatch(setUser(user)),
    setUserName: (name) => dispatch(setUserName(name)),
    getUserInSpaceByName: (payload) => dispatch(getUserInSpaceByName(payload)),
    createUserNApproveSpace: (user) => dispatch(createUserNApproveSpace(user)),
    getPendingJoinPollInSpaceByName: (payload) => dispatch(getPendingJoinPollInSpaceByName(payload)),
    createNameRelatedPoll: (poll) => dispatch(createNameRelatedPoll(poll)),
  };
};

class Space extends GeneralComponent {
  constructor(props) {
    super(props);

    props.setShowDialog(false);
    this.updateState();
  }

  getUserInSpaceByName = async () => {
    await this.props.getUserInSpaceByName({
      spaceID: this.props.space.id,
      userName: this.props.user.name
    });

    if(this.props.userError && this.props.user.name) {
      this.getPendingJoinPollInSpaceByName();
    }
  }

  getPendingJoinPollInSpaceByName = async () => {
    await this.props.getPendingJoinPollInSpaceByName(this.props.user);

    if(this.props.pollError) {
      this.props.setShowDialog(true);
    }
  }

  addUser = async () => {
    // Approved space: create join request
    if(this.props.space.status) {
      await this.props.createNameRelatedPoll(this.props.user);

      if(this.props.pollError) {
        // TODO: render error component
      }
    }
    // Pending space: create user
    else {
      await this.props.createUserNApproveSpace(this.props.user);

      if(this.props.userError) {
        // TODO: render error component
      }
    }
  }

  closeSpace = (key, spaceID) => {
    this.removeSessionArrayItem(key, spaceID);

    this.props.history.push('/');
  }

  updateState = () => {
    this.props.setSpace(this.props.location.state.space);

    this.props.setUser(this.user ? this.user : {
      space: this.props.location.state.space.id,
      space_name: this.props.location.state.space.name,
      space_status: this.props.location.state.space.status
    });
  }

  displayMenu = () => {
    if(this.user && this.user.id) {
      return(
        <React.Fragment>
          <IconButton className="openMenu" tabIndex="-1" onClick={(e) => this.setMenuAnchor(e.currentTarget)}>
            <MenuIcon />
          </IconButton>

          <Menu id="spaceNavMenu" open={Boolean(this.state.menuAnchor)} anchorEl={this.state.menuAnchor} onClose={() => this.setMenuAnchor(null)}
            getContentAnchorEl={null} anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <MenuItem disabled>
              {this.user.name}
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

  toggleMessages = () => {
    if(this.user) {
      if(this.user.space_status) {
        if(this.user.id) {
          // Approved space and user
          return (
            <MessageSpace history={this.props.history} updateState={this.updateState}
              user={this.user} tab={this.state.tab}
            />
          );
        }

        // Approved space but pending user
        return (
          <PendingUser updateState={this.updateState} user={this.user} />
        );
      }

      // Pending space
      return (
        <PendingSpace updateState={this.updateState} user={this.user} />
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
    if(users) {
      this.user = users[this.props.space.id];
    }

    return (
      <div id="space">
        <Sidebar spaceID={this.props.space.id} />

        <AppBar position="sticky">
          <Toolbar>
            {this.displayMenu()}

            <Typography className="spaceName">
              {this.props.space.name}
            </Typography>

            <IconButton className="closeSpace" aria-label="close" tabIndex="-1" onClick={() => this.closeSpace('users', this.props.space.id)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <br />

        {this.toggleMessages()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Space);
