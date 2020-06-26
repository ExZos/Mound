import React from 'react';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/namePoll.css';

class NamePoll extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = ({
      user: {
        id: this.props.userID,
        space: this.props.spaceID,
        name: ''
      }
    });
  }

  addNamePoll = async () => {
    const poll = {
      space: this.state.user.space,
      user: this.state.user.id,
      name: this.state.user.name
    };

    try {
      const res = await server.post(api.createNameRelatedPoll, poll)

      let user = this.state.user;
      user.poll = res.data.id;

      this.addToSessionArrayItem('users', user);

      this.setState({
        user: {
          id: this.props.userID,
          space: this.props.spaceID,
          name: ''
        },
        poll: res.data
      });
    } catch (e) {
      // TODO: render error component
    }
  }

  render() {
    return (
      <div id="namePoll">
        <form id="addNamePoll" onSubmit={this.handleFormSubmit}>
          <input type="text" name="name" placeholder="Type a user name..."
            value={this.state.user.name}
            onChange={(e) => this.handleInputChange(e, 'user')}
          />

          <button tabIndex="-1" onClick={this.addNamePoll}>REQUEST</button>
        </form>
      </div>
    );
  }
}

export default NamePoll;
