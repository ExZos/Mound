import React from 'react';
import { Link } from 'react-router-dom';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
// import '../styles/Spaces.css';

class Space extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = {
      spaces: []
    };
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
        <div>
          {this.renderSpaces()}
        </div>

        <br />

        <div>
          <div>
            TESTING LINKS
          </div>

          <div>
            <Link to='/'>Home</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Space;
