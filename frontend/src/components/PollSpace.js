import React from 'react';
import { Button, ButtonGroup, CircularProgress } from '@material-ui/core';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/pollSpace.scss';

class PollSpace extends GeneralComponent {
  constructor(props) {
    super(props);

    this.loaded = false;

    this.state = {
      polls: [],
      vote: {}
    };
  }

  componentDidMount() {
    this.getPolls();
    this.interval = setInterval(this.getPolls, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPolls = async () => {
    try {
      const res = await server.get(api.getPendingUnvotedPollsForUser + this.props.userID);

      this.loaded = true;

      this.setState({
        polls: res.data
      });
    } catch (e) {
      // TODO: render error component
    }
  }

  addVote = async (e, result) => {
    const vote = {
      poll: e.target.id,
      user: this.props.userID,
      result: result
    };

    try {
      /*const res = */await server.post(api.createVoteNUpdatePoll, vote);

      this.getPolls();
    } catch (e) {
      // TODO: render error component
    }
  }

  determinePollStatement = (poll) => {
    if(!poll.user) {
      return (
        <div>
          <span className="userName">{poll.name}</span> wants to join this space.
        </div>
      );
    }
    else if(poll.name) {
      return "Name Poll";
    }

    return "Ban Poll";
  }

  renderPolls = () => {
    return this.state.polls.map(poll => (
      <div key={poll.id} className="poll">
        <div className="pollStatement">
          {this.determinePollStatement(poll)}
        </div>

        <ButtonGroup variant="contained" className="pollAnswers">
          <Button className="accept" tabIndex="-1" id={poll.id} onClick={(e) => this.addVote(e, true)}>Accept</Button>
          <Button className="decline" tabIndex="-1" id={poll.id} onClick={(e) => this.addVote(e, false)}>Decline</Button>
        </ButtonGroup>
      </div>
    ));
  }

  render() {
    if(!this.loaded) {
      return (
        <div id="pollSpace">
          <CircularProgress color="inherit" />
        </div>
      );
    }
    else if(this.state.polls.length > 0) {
      return (
        <div id="pollSpace">
          {this.renderPolls()}
        </div>
      );
    }

    return (
      <div id="pollSpace">
        No polls
      </div>
    );
  }
}

export default PollSpace;
