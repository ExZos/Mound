import React from 'react';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/pendingSpace.css';

class PendingSpace extends GeneralComponent {
  constructor(props) {
    super(props);

    this.user = this.getSessionItem('users')[this.props.spaceID];

    this.state = {
      requiredUsers: 3,
      userCount: '',
      remainingUsers: ''
    };
  }

  componentDidMount() {
    this.getUserCountOfSpace();
    this.interval = setInterval(this.getUserCountOfSpace, 1000);
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

  getUserCountOfSpace = () => {
    server.get(api.getUsersInSpace + this.props.spaceID + '/')
      .then((res) => {
        const userCount = res.data.length;

        this.setState({
          userCount: userCount,
          remainingUsers: this.state.requiredUsers - res.data.length
        });

        // Update user session item
        if(userCount >= this.state.requiredUsers) {
          server.get(api.users + this.user.id)
            .then((res) => {
              this.addToSessionArrayItem('users', res.data);

              this.props.updateState();
            });
        }
      });
  }

  displayResultingStatement = () => {
    if(this.state.remainingUsers > 1) {
      return (
        <div>
          {this.state.remainingUsers} more users are required to approve this space.
        </div>
      );
    }
    else if(this.state.remainingUsers === 1) {
      return (
        <div>
          {this.state.remainingUsers} more user is required to approve this space.
        </div>
      );
    }

    return (
      <div>
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

        <div className="resultingStatement">
          {this.displayResultingStatement()}
        </div>
      </div>
    );
  }
}

export default PendingSpace;
