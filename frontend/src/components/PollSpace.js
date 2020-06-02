import React from 'react';
import { Button } from 'reactstrap';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/pollSpace.css';

class PollSpace extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = {
      polls: []
    };
  }

  componentDidMount() {
    this.getPolls();
    this.interval = setInterval(this.getPolls, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPolls = () => {
    server.get(api.getPendingPollsInSpace + this.props.spaceID)
      .then((res) => this.setState({
        polls: res.data
      }));
  }

  addVote = () => {
    
  }

  determinePollType = (poll) => {
    if(!poll.user) {
      return (
        <div>
          <div className="pollStatement">
            <span className="userName">{poll.name}</span> wants to join this space.
          </div>

          <div className="pollAnswers">
            <Button color="success" className="accept" id={poll.id}>Accept</Button>
            <Button color="danger" className="decline" id={poll.id}>Decline</Button>
          </div>
        </div>
      );
    }
    else if(poll.name) {
      return "Name Poll";
    }

    return "Ban Poll";
  }

  // TODO: add inputs and event handlers
  renderPolls = () => {
    return this.state.polls.map(poll => (
      <div key={poll.id} className="poll">
        {this.determinePollType(poll)}
      </div>
    ));
  }

  render() {
    return (
      <div id="pollSpace">
        <div>
          Requests
        </div>

        <div className="polls">
          {this.renderPolls()}
        </div>
      </div>
    );
  }
}

export default PollSpace;
