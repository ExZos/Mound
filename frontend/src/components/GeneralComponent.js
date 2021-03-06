import { Component } from 'react';

class GeneralComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDialog: false,
      showDropdown: false,
      showSidebar: false
    };
  }

  handleFormSubmit(e) {
    e.preventDefault();
  }

  handleInputChange(e, key) {
    let { name, value } = e.target;
    const obj = { ...this.state[key], [name]: value };

    this.setState({
      [key]: obj
    });

    this.hideError();
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

  setShowDialog = (show) => {
    this.setState({
      showDialog: show
    });
  }

  toggleDropdown = () => {
    this.setState({
      showDropdown: !this.state.showDropdown
    });
  }

  toggleSidebar = () => {
    this.setState({
      showSidebar: !this.state.showSidebar
    });
  }

  setMenuAnchor = (e) => {
    this.setState({
      menuAnchor: e.currentTarget
    });
  }

  removeMenuAnchor = () => {
    this.setState({
      menuAnchor: null
    });
  }

  removeMenuAnchorNSetTab = (tab) => {
    this.setState({
      menuAnchor: null,
      tab: tab
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

  convertTimestamp(timestamp) {
    const date = new Date(timestamp);

    return date.toLocaleString();
  }
}

export default GeneralComponent;
