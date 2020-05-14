import React from 'react';
import { Redirect } from 'react-router-dom';

import GeneralComponent from './GeneralComponent';
import Header from './Header';
import { server, api } from '../server';
// import '../styles/home.css';

class Home extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = {
      space: {
        name: ''
      }
    };
  }

  handleSpaceChange = (e) => {
    let { name, value } = e.target;
    const space = { ...this.state.space, [name]: value };

    this.setState({
      space: space
    });
  }

  // addSpace = (space) => {
  //   server.post(api.spaces, space);
  // }

  getSpaceByName = () => {
    server.get(api.getSpaceByName + this.state.space.name + '/')
      .then(
        res => {
          this.setState({
            space: res.data
          });
          console.log("OKOKOK");
          this.redirect();
        },
        error => console.log("NOPENOPE")
      );
  }

  render() {
    if(this.state.redirect) {
        return <Redirect push to={{
          pathname: '/s/temp',
          state: {
            id: this.state.space.id}
        }} />
    }

    return (
      <div>
        <Header />

        <br />

        <div>
          <form>
            <input type="text" name="name" placeholder="Space Name"
              value={this.state.space.name}
              onChange={this.handleSpaceChange}
            />
          </form>

          <div>
            <button onClick={() => this.getSpaceByName()}>ENTER</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;
