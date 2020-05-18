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

  setSessionItem(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  addToSessionArrayItem(key, value) {
    let users = {};

    if(this.getSessionItem(key)) {
      users = this.getSessionItem(key);
      users[value.space] = value;
      sessionStorage.setItem(key, JSON.stringify(users));
    }
    else {
      users[value.space] = value;
      sessionStorage.setItem(key, JSON.stringify(users));
    }
  }

  getSessionItem(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  clearSession() {
    sessionStorage.clear();
  }

  removeSessionArrayItem(key, spaceID) {
    const users = this.getSessionItem(key);

    if(users && users[spaceID]) {
      delete users[spaceID];
      sessionStorage.setItem(key, JSON.stringify(users));
    }
  }
}

export default GeneralComponent;
