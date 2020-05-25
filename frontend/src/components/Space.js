import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, Button } from 'reactstrap';

import GeneralComponent from './GeneralComponent';
import Header from './Header';
import ErrorBlock from './ErrorBlock';
import MessageSpace from './MessageSpace';
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
        name: this.props.location.state.space.name
      }
    });
  }

  getUserInSpaceByName = () => {
    server.get(api.getUserInSpaceByName + this.state.space.id + '/' + this.state.user.name)
      .then(
        (res) => {
          this.addToSessionArrayItem('users', res.data);
          this.setSessionItem('toggleMessages', true);

          this.setState({
            user: res.data
          });
        }
      )
      .catch(
        (err) => this.showError()
      );
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
      )
    }
  }

  toggleMessages = (users) => {
    if(users && users[this.state.space.id]) {
      return (
        <MessageSpace spaceID={this.state.space.id} history={this.props.history} />
      )
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

        <ErrorBlock message="NO SUCH USER" show={this.state.showError} />
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
    )
  }
}

export default Space;
