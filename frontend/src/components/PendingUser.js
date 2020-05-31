import React from 'react';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/pendingUser.css';

class PendingUser extends GeneralComponent {
  // TODO: create user from join poll either during vote creation or here
  // TODO: update component when Space.status is set to True
  constructor(props) {
    super(props);

    this.user = this.getSessionItem('users')[this.props.spaceID];

    this.state = {
      positiveVoteCount: '',
      negativeVoteCount: '',
      userCount: '',
      remainingVoteCount: '',
      requiredVoteCount: '',
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
    server.get(api.getUsersInSpaceExceptName + this.user.space + '/' + this.user.name)
      .then((res) => {
        this.setState({
          userCount: res.data.length,
          requiredVoteCount: res.data.length
        });

        // Get votes of space
        server.get(api.getVotesForPoll + this.user.poll)
          .then((res) => {
            let positives = 0;
            let negatives = 0;

            // Get positive and negative vote counts
            res.data.forEach((vote) => {
              if(vote.result === true) {
                positives++;
              }
              else {
                negatives++;
              }
            });

            this.setState({
              positiveVoteCount: positives,
              negativeVoteCount: negatives,
              remainingVoteCount: this.state.userCount - (positives + negatives)
            });

            // Update user session item
            if(positives >= this.state.requiredVoteCount) {
              server.get(api.getUserInSpaceByName + this.user.space + '/' + this.user.name)
                .then((res) => {
                  this.addToSessionArrayItem('users', res.data);

                  this.props.updateState();
                });
            }
          });
      });

  }

  displayResultingStatement = () => {
    if(this.state.remainingVoteCount === 0) {
      if(this.state.positiveVoteCount < this.state.requiredVoteCount) {
        return (
          <div>
            All users have voted.<br />
            The required votes has not been met.<br />
            Your request has been rejected.
          </div>
        );
      }

      return (
        <div>
          All users have voted.<br />
          The required votes has been met.<br />
          Your request will be approved shortly.
        </div>
      );
    }

    return (
      <div>
        {this.state.remainingVoteCount} user has yet to vote.
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
          Progress: {this.state.positiveVoteCount}/{this.state.userCount}
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
