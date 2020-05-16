import React from 'react';

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
    server.get(api.spaces + this.props.location.state.spaceID)
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

  toggleMessages = () => {
    const users = this.getSessionItem('users')

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

          <button onClick={this.getUserInSpaceByName}>ENTER</button>
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

        <div id="spaceName">
          {this.state.space.name}
        </div>

        <br />

        {this.toggleMessages()}
      </div>
    )
  }
}

export default Space;
