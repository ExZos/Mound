import React from 'react';
import { Button, ButtonGroup } from '@material-ui/core';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/pollSpace.css';

class PollSpace extends GeneralComponent {
  constructor(props) {
    super(props);

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
          <Button variant="contained" className="accept" tabIndex="-1" id={poll.id} onClick={(e) => this.addVote(e, true)}>Accept</Button>
          <Button variant="contained" className="decline" tabIndex="-1" id={poll.id} onClick={(e) => this.addVote(e, false)}>Decline</Button>
        </ButtonGroup>
      </div>
    ));
  }

  render() {
    return (
      <div id="pollSpace">
        {this.renderPolls()}
      </div>
    );
  }
}

export default PollSpace;
