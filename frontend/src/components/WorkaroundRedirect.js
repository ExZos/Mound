import React from 'react';
import { Redirect } from 'react-router-dom';

import GeneralComponent from './GeneralComponent';

class WorkaroundRedirect extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = {
      pathname: this.props.location.state.pathname,
      state: this.props.location.state.state
    };
  }

  render() {
    return(
      <Redirect push to={{
        pathname: this.state.pathname,
        state: this.state.state
      }} />
    )
  }
}

export default WorkaroundRedirect;
