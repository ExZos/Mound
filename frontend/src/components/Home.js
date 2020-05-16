import React from 'react';
import { Redirect } from 'react-router-dom';

import GeneralComponent from './GeneralComponent';
import Header from './Header';
import ErrorBlock from './ErrorBlock';
import { server, api } from '../server';
import '../styles/home.css';

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

    this.hideError();
  }

  // addSpace = () => {
  //   server.post(api.spaces, this.state.space);
  // }

  getSpaceByName = () => {
    server.get(api.getSpaceByName + this.state.space.name + '/')
      .then(
        (res) => {
          this.setState({
            space: res.data
          });

          this.toggleRedirect();
        }
      )
      .catch(
        (err) => this.showError()
      );
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    if(this.state.redirect) {
        return <Redirect push to={{
          pathname: '/s/',
          state: {
            spaceID: this.state.space.id}
        }} />
    }

    return (
      <div id="home">
        <Header />

        <br />

        <div>
          <form id="getSpaceByName" onSubmit={this.handleFormSubmit}>
            <input type="text" name="name" placeholder="Type a space name..." autoFocus
              value={this.state.space.name}
              onChange={this.handleSpaceChange}
            />

            <button onClick={this.getSpaceByName}>ENTER</button>
          </form>

          <ErrorBlock message="NO SUCH SPACE" show={this.state.showError} />
        </div>
      </div>
    )
  }
}

export default Home;
