import React from 'react';

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

  componentDidMount() {
    // TEMP
    console.log(this.getSessionItem('users'));
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

          this.props.history.push({
            pathname: '/s/',
            state: {
              space: this.state.space
            }
          });
        }
      )
      .catch(
        (err) => this.showError()
      );
  }

  render() {
    return (
      <div id="home">
        <Header />

        <br />

        <div>
          <form id="getSpaceByName" onSubmit={this.handleFormSubmit}>
            <input type="text" name="name" placeholder="Type a space name..." autoFocus
              value={this.state.space.name}
              onChange={(e) => this.handleInputChange(e, 'space')}
            />

            <button tabIndex="-1" onClick={this.getSpaceByName}>ENTER</button>
          </form>

          <ErrorBlock message="NO SUCH SPACE" show={this.state.showError} />
        </div>
      </div>
    )
  }
}

export default Home;
