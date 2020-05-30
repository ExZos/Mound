import React from 'react';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/pendingSpace.css';

class PendingSpace extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = {
      requiredUsers: 3,
      userCount: '',
      remainingUsers: ''
    };
  }

  componentDidMount() {
    this.getUserCountofSpace();
    this.interval = setInterval(this.getUserCountofSpace, 1000);
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

  getUserCountofSpace = (spaceID) => {
    server.get(api.getUserInSpace + this.props.spaceID + '/')
      .then((res) => this.setState({
        userCount: res.data.length,
        remainingUsers: this.state.requiredUsers - res.data.length
      }));
  }

  displayResultingStatement = () => {
    if(this.state.remainingUsers > 1) {
      return (
        <div className="resultingStatement">
          {this.state.remainingUsers} more users are required to approve this space.
        </div>
      );
    }
    else if(this.state.remainingUsers === 1) {
      return (
        <div className="resultingStatement">
          {this.state.remainingUsers} more user is required to approve this space.
        </div>
      );
    }

    return (
      <div className="resultingStatement">
        Congrats!<br />
        The required user count has been met.<br />
        This space will be approved shortly.
      </div>
    );
  }

  render() {
    return(
      <div id="pendingSpace">
        <div className="statusStatement">
          Status: pending
        </div>

        <div className="progressStatement">
          Progress: {this.state.userCount}/{this.state.requiredUsers}
        </div>

        <br />

        {this.displayResultingStatement()}
      </div>
    );
  }
}

export default PendingSpace;
