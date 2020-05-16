import React from 'react';

import GeneralComponent from './GeneralComponent';
import Header from './Header';
import { server, api } from '../server';
// import '../styles/spaces.css';

class Spaces extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = {
      spaces: []
    };

    // TEMP
    this.clearSession();
  }

  componentDidMount() {
    this.getSpaces();
    this.interval = setInterval(this.getSpaces, 1000);
  }

  // componentDidUpdate() {
  //   this.getSpaces();
  // }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getSpaces = () => {
    server.get(api.spaces)
      .then(res => this.setState({
        spaces: res.data
      }));
  }

  renderSpaces = () => {
    const spaces = this.state.spaces;

    return spaces.map(space => (
      <div key={space.id}>
        {space.name}
      </div>
    ));
  }

  render() {
    return (
      <div>
        <Header />

        <br />

        <div>
          {this.renderSpaces()}
        </div>
      </div>
    )
  }
}

export default Spaces;
