import React from 'react';
import { Redirect } from 'react-router-dom';

function WorkaroundRedirect(props) {
  const state = props.location.state;

  if(state) {
    return (
      <Redirect to={{
        pathname: state.pathname,
        state: state.state
      }} />
    );
  }

  return (
    <Redirect to="/" />
  );
}

export default WorkaroundRedirect;
