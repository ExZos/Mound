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
        id: this.props.location.state.spaceID,
        name: ''
      },
      user: {
        name: ''
      }
    };
  }

  componentDidMount() {
    this.getSpace();
  }

  getSpace = () => {
    server.get(api.spaces + this.state.space.id)
      .then(res => this.setState({
        space: res.data
      }));
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

  handleUserChange = (e) => {
    let { name, value } = e.target;
    const user = { ...this.state.user, [name]: value };

    this.setState({
      user: user
    });

    this.hideError();
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
  }

  displayUser = () => {
    const users = this.getSessionItem('users');

    if(users && users[this.state.space.id]) {
      return users[this.state.space.id].name;
    }

    return "Guest";

  }

  toggleMessages = () => {
    const users = this.getSessionItem('users');

    if(users && users[this.state.space.id]) {
      return (
        <MessageSpace spaceID={this.state.space.id} />
      )
    }

    return (
      <div>
        <form id="getUserInSpaceByName" onSubmit={this.handleFormSubmit}>
          <input type="text" name="name" placeholder="Type a user name..." autoFocus
            value={this.state.user.name}
            onChange={this.handleUserChange}
          />

          <button tabIndex="-1" onClick={this.getUserInSpaceByName}>ENTER</button>
        </form>

        <ErrorBlock message="NO SUCH USER" show={this.state.showError} />
      </div>
    );
  }

  render() {
    return(
      <div id="space">
        <Header />

        <br />

        <Nav className="header">
          <NavItem>
            {this.displayUser()}
          </NavItem>

          <NavItem className="space">
            {this.state.space.name}
          </NavItem>

          <NavItem>
            <Link tabIndex="-1" to="/" onClick={() => this.removeSessionArrayItem('users', this.state.space.id)}><Button tabIndex="-1" close /></Link>
          </NavItem>
        </Nav>

        <br />

        {this.toggleMessages()}
      </div>
    )
  }
}

export default Space;
