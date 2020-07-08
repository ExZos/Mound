import React from 'react';
import { TextField, Button, CircularProgress } from '@material-ui/core';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/namePoll.css';

class NamePoll extends GeneralComponent {
  constructor(props) {
    super(props);

    this.loaded = false;

    this.state = ({
      user: {
        id: this.props.userID,
        space: this.props.spaceID,
        name: ''
      }
    });
  }

  componentDidMount() {
    this.getNamePoll();
    this.interval = setInterval(this.getNamePoll, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getNamePoll = async () => {
    try {
      const res = await server.get(api.getNamePollResultsInSpaceByUser + this.props.spaceID + '/' + this.props.userID + '/');

      this.loaded = true;

      const userCount = res.data['userCount'];
      const positiveVoteCount = res.data['positiveVoteCount'];
      const negativeVoteCount = res.data['negativeVoteCount'];
      const user = res.data['user'];

      this.setState({
        existingPoll: true,
        userCount: userCount,
        requiredVoteCount: userCount,
        positiveVoteCount: positiveVoteCount,
        negativeVoteCount: negativeVoteCount,
        remainingVoteCount: userCount - (positiveVoteCount + negativeVoteCount)
      });

      // User approved: update user session item
      if(user && this.loaded) {
        this.addToSessionArrayItem('users', user);
      }
    }
    catch (e) {
      clearInterval(this.interval);
      this.loaded = true;

      this.setState({
        existingPoll: false
      });
    }
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

  displayStatusStatement = () => {
    if(this.state.positiveVoteCount < this.state.requiredVoteCount && this.state.remainingVoteCount === 0) {
      return 'rejected';
    }

    return 'pending';
  }

  displayResultingStatement = () => {
    if(this.state.positiveVoteCount < this.state.requiredVoteCount) {
      // Quota not met but still more users left to vote
      if(this.state.remainingVoteCount > 0) {
        return (
          <div>
            Some users have not yet voted.
          </div>
        );
      }

      // Join request rejected
      return (
        <div>
          All users have voted.<br />
          The required votes has not been met.<br />
          Your request has been rejected.
        </div>
      );
    }

    // Join request to be approved
    return (
      <div>
        The required votes has been met.<br />
        Your request will be approved shortly.
      </div>
    );
  }

  // TODO: display poll progress
  render() {
    if(!this.loaded) {
      return (
        <div id="pollSpace">
          <CircularProgress color="inherit" />
        </div>
      );
    }
    else if(!this.state.existingPoll) {
      return (
        <div id="namePoll">
          <form id="addNamePoll" onSubmit={this.handleFormSubmit}>
            <div className="textFieldWButton">
              <TextField name="name" label="Type a user name..."
                size="small" variant="outlined"
                value={this.state.user.name}
                onChange={(e) => this.handleInputChange(e, 'user')}
              />

              <Button color="primary"
                size="small" variant="outlined"
                tabIndex="-1" onClick={this.addNamePoll}>REQUEST</Button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div id="namePoll">
        <div className="statusStatement">
          Status: {this.displayStatusStatement()}
        </div>

        <div className="progressStatement">
          Progress: {this.state.positiveVoteCount}/{this.state.requiredVoteCount}
        </div>

        <br />

        <div className="resultingStatement">
          {this.displayResultingStatement()}
        </div>
      </div>
    );
  }
}

export default NamePoll;
