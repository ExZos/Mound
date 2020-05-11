import React, { Component } from 'react';
import '../styles/App.css';
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      test: []
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios.get("/api/spaces/")
      .then(res => this.setState({
        test: res.data
      }));
  }

  renderItems = () => {
    const test = this.state.test;

    return test.map(item => (
      <div>
        {item.name}
      </div>
    ));
  }

  render() {
    return (
      <div>
        {this.renderItems()}
      </div>
    )
  }
}

export default App;
