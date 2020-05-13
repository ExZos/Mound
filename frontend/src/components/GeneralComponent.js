import React, { Component } from 'react';

class GeneralComponent extends Component {
  // constructor(props) {
  //   super(props);
  // }

  redirect() {
    this.setState({
      redirect: true
    });
  }
}

export default GeneralComponent;
