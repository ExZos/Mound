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

  // TODO: hide /r/
  // TODO: fix back browser functionality after
  //       navigating from one space to another
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
