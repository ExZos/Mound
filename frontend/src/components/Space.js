import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, Button } from 'reactstrap';

import GeneralComponent from './GeneralComponent';
import Header from './Header';
import ConfirmModal from './ConfirmModal';
import MessageSpace from './MessageSpace';
import PendingSpace from './PendingSpace';
import { server, api } from '../server';
import '../styles/space.css';

class Space extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = {
      space: {
        id: '',
        name: ''
      },
      user: {
        name: ''
      }
    };
  }

  componentDidMount() {
    this.setState({
      space: {
        id: this.props.location.state.space.id,
        name: this.props.location.state.space.name,
        status: this.props.location.state.space.status
      }
    });
  }

  getUserInSpaceByName = () => {
    server.get(api.getUserInSpaceByName + this.state.space.id + '/' + this.state.user.name)
      .then((res) => {
          this.addToSessionArrayItem('users', res.data);
          this.setSessionItem('toggleMessages', true);

          this.setState({
            user: res.data
          });
        }
      )
      .catch((err) => this.toggleModal());
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

  // TODO: add space join request to modal
  toggleMessages = (users) => {
    if(users && users[this.state.space.id]) {
      if(this.state.space.status) {
        return (
          <MessageSpace spaceID={this.state.space.id} history={this.props.history} />
        );
      }

      return (
        <PendingSpace spaceID={this.state.space.id} />
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
          toggleModal={this.toggleModal} confirm={this.toggleModal}
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
        <Header spaceID={this.props.location.state.space.id} />

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
