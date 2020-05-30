import React from 'react';

import GeneralComponent from './GeneralComponent';
import '../styles/pendingUser.css';

class PendingUser extends GeneralComponent {
  // TODO: test update of page on approval progress
  constructor(props) {
    super(props);

    this.user = this.getSessionItem('users')[this.props.spaceID];

    this.state = {

    };
  }

  // TODO: find better solution to fix default web navs
  //       should avoid full page reloads
  componentDidUpdate() {
    window.onpopstate = (e) => {
       window.location.reload(false);
    }
  }

  // TODO: Approval progress
  render() {
    return (
      <div id="pendingUser">
        <div className="statusStatement">
          Pending User: {this.user.name}
        </div>

        <div className="progressStatement">
          Progress: progress statement
        </div>

        <br />

        <div className="resultingStatement">
          Resulting statement
        </div>
      </div>
    );
  }
}

export default PendingUser;
