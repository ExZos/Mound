import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, Button } from 'reactstrap';

import GeneralComponent from './GeneralComponent';
import Header from './Header';
import ConfirmModal from './ConfirmModal';
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
      }
    };
  }

  getUserInSpaceByName = () => {
    server.get(api.getUserInSpaceByName + this.state.space.id + '/' + this.state.user.name)
      .then((res) => {
        // Existing user
        this.addToSessionArrayItem('users', res.data);

        this.setState({
          user: res.data
        });
      })
      .catch((err) => {
        server.get(api.getPendingJoinPollInSpaceByName + this.state.space.id + '/' + this.state.user.name)
          .then((res) => {
            // Existing join poll
            let user = this.state.user;
            user.poll = res.data.id;

            this.addToSessionArrayItem('users', this.state.user);

            this.setState({
              poll: res.data
            });
          })
          // Create user or join poll
          .catch((err) => {
            if(this.state.user.name) {
              this.toggleModal();
            }
          });
      });
  }

  addUser = () => {
    // Approved space: create join request
    if(this.state.space.status) {
      const poll = {
        space: this.state.space.id,
        name: this.state.user.name
      }
      
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
        <NavItem className="user">
          {users[this.state.space.id].name}
        </NavItem>
      );
    }
  }

  displayCloseButton = (users) => {
    if(users && users[this.state.space.id]) {
      return(
        <NavItem className="close">
          <Link tabIndex="-1" to="/" onClick={() => this.removeSessionArrayItem('users', this.state.space.id)}><Button tabIndex="-1" close /></Link>
        </NavItem>
      );
    }
  }

  toggleMessages = (users) => {
    if(users && users[this.state.space.id]) {
      if(users[this.state.space.id].space_status) {
        // Approved space and user
        if(users[this.state.space.id].id) {
          return (
            <MessageSpace spaceID={this.state.space.id} updateState={this.updateState}
              history={this.props.history}
            />
          );
        }

        // Approved space but pending user
        return (
          <PendingUser spaceID={this.state.space.id} updateState={this.updateState} />
        );
      }

      // Pending space
      return (
        <PendingSpace spaceID={this.state.space.id} updateState={this.updateState} />
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

        <ConfirmModal showModal={this.state.showModal}
          toggleModal={this.toggleModal} confirm={this.addUser}
          mHeader={"User '" + this.state.user.name + "' does not exist"}
          mBody={"Do you want to request to join this space as '" + this.state.user.name + "'"}
        />
      </div>
    );
  }

  render() {
    const users = this.getSessionItem('users');

    return(
      <div id="space">
        <Header spaceID={this.state.space.id} />

        <br />

        <Nav className="header">
          {this.displayUser(users)}

          <NavItem className="space">
            {this.state.space.name}
          </NavItem>

          {this.displayCloseButton(users)}
        </Nav>

        <br />

        {this.toggleMessages(users)}
      </div>
    );
  }
}

export default Space;
