import React from 'react';
import { CircularProgress } from '@material-ui/core';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/pendingUser.css';

class PendingUser extends GeneralComponent {
  constructor(props) {
    super(props);

    this.loaded = false;

    this.state = {
      userCount: '',
      requiredVoteCount: '',
      positiveVoteCount: '',
      negativeVoteCount: '',
      remainingVoteCount: ''
    };
  }

  componentDidMount() {
    this.getPollResults();
    this.interval = setInterval(this.getPollResults, 1000);
  }

  componentDidUpdate() {
    window.onpopstate = (e) => {
      this.loaded = false;

      this.props.updateState();
      this.getPollResults();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPollResults = async () => {
    try {
      // Get poll results
      const res = await server.get(api.getJoinPollResults + this.props.user.poll + '/' + this.props.user.name);

      this.loaded = true;

      const userCount = res.data['userCount'];
      const positiveVoteCount = res.data['positiveVoteCount'];
      const negativeVoteCount = res.data['negativeVoteCount'];
      const user = res.data['user'];

      this.setState({
        userCount: userCount,
        requiredVoteCount: userCount,
        positiveVoteCount: positiveVoteCount,
        negativeVoteCount: negativeVoteCount,
        remainingVoteCount: userCount - (positiveVoteCount + negativeVoteCount)
      });

      // User approved: update user session item
      if(user && this.loaded) {
        this.addToSessionArrayItem('users', user);
        this.props.updateState();
      }
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

  render() {
    if(!this.loaded) {
      return (
        <div id="pendingSpace">
          <CircularProgress color="inherit" />
        </div>
      );
    }

    return (
      <div id="pendingUser">
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

export default PendingUser;
