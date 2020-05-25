import React from 'react';
import { Redirect } from 'react-router-dom';

import GeneralComponent from './GeneralComponent';

class WorkaroundRedirect extends GeneralComponent {
  render() {
    const state = this.props.location.state;

    if(state) {
      return(
        <Redirect to={{
          pathname: state.pathname,
          state: state.state
        }} />
      );
    }

    return(
      <Redirect to="/" />
    );
  }
}

export default WorkaroundRedirect;
