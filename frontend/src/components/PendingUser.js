import React from 'react';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/pendingUser.css';

class PendingUser extends GeneralComponent {
  // TODO: create user from join poll either during vote creation or here
  constructor(props) {
    super(props);

    this.user = this.getSessionItem('users')[this.props.spaceID];

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

  // TODO: find better solution to fix default web navs
  //       should avoid full page reloads
  componentDidUpdate() {
    window.onpopstate = (e) => {
       window.location.reload(false);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPollResults = () => {
    // Get user count of space
    server.get(api.getJoinPollResults + this.user.poll + '/' + this.user.name)
      .then((res) => {
        this.setState({
          userCount: res.data['userCount'],
          requiredVoteCount: res.data['userCount'],
          positiveVoteCount: res.data['positiveVoteCount'],
          negativeVoteCount: res.data['negativeVoteCount']
        });

        // Update user session item
        if(res.data['positiveVoteCount'] >= this.state.requiredVoteCount) {
          server.get(api.getUserInSpaceByName + this.user.space + '/' + this.user.name)
            .then((res) => {
              this.addToSessionArrayItem('users', res.data);

              this.props.updateState();
            });
        }
      });

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
    return (
      <div id="pendingUser">
        <div className="statusStatement">
          Status: pending
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
