import React from 'react';
import { Spinner } from 'reactstrap';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/pendingSpace.css';

class PendingSpace extends GeneralComponent {
  constructor(props) {
    super(props);

    this.loaded = false;
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

  componentDidUpdate() {
    window.onpopstate = (e) => {
      this.loaded = false;

      this.props.updateState();
      this.user =  this.getSessionItem('users')[this.props.spaceID];
      this.getUserCountOfSpace();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getUserCountOfSpace = async () => {
    try {
      const res = await server.get(api.getUserCountInSpaceForUser + this.props.spaceID + '/' + this.user.id);
      
      this.loaded = true;

      const userCount = res.data['userCount'];
      const user = res.data['user'];

      this.setState({
        userCount: userCount,
        remainingUsers: this.state.requiredUsers - userCount,
        loaded: true
      });

      // Update user session item
      if(user) {
        this.addToSessionArrayItem('users', user);
        this.props.updateState();
      }
    } catch (e) {
      // TODO: render error component
    }
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
    if(!this.loaded) {
      return (
        <div id="pendingSpace">
          <Spinner type="border" color="dark" />
        </div>
      );
    }

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
