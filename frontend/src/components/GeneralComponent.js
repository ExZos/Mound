import { Component } from 'react';

class GeneralComponent extends Component {
  toggleRedirect() {
    this.setState({
      redirect: true
    });
  }

  showError() {
    this.setState({
      showError: true
    });
  }

  hideError() {
    this.setState({
      showError: false
    });
  }
}

export default GeneralComponent;
