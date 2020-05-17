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

  // TODO: remove session array item by spaceID
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

  // TODO: clear session on MessageSpace component unmount
  clearSession() {
    sessionStorage.clear();
  }
}

export default GeneralComponent;
