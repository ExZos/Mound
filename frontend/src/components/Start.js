import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/App.css';

class Start extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = {
      space: {
        name: ''
      }
    }
  }

  handleSpaceChange = (e) => {
    let { name, value } = e.target;
    const space = { ...this.state.space, [name]: value };

    this.setState({
      space: space
    });
  }

  addSpace = (space) => {
    server.post(api.spaces, space);
  }

  goToSpace = () => {
    this.setState({
      redirect: true
    });
  }

  render() {
    if(this.state.redirect) {
        return <Redirect push to='/s' />;
    }

    return (


      <div>
        <form>
          <input type="text" name="name" placeholder="Space Name"
            value={this.state.space.name}
            onChange={this.handleSpaceChange}
          />
        </form>

        <div>
          <button onClick={() => this.goToSpace()}>ENTER</button>
        </div>

        <br />

        <div>
          <div>
            LINK TESTING
          </div>

          <div>
            <Link to="/s/">Space</Link>
          </div>

          <div>
            <Link to="/u/">User</Link>
          </div>

          <div>
            <Link to="/m/">Message</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Start;
