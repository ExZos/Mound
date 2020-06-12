import React from 'react';

import GeneralComponent from './GeneralComponent';
import Header from './Header';
import ConfirmModal from './ConfirmModal';
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

  getSpaceByName = () => {
    server.get(api.getSpaceByName + this.state.space.name + '/')
      .then((res) => {
          this.setState({
            space: res.data
          });

          this.props.history.push({
            pathname: '/s/',
            state: {
              space: this.state.space
            }
          });
        })
      .catch((err) => {
        if(this.state.space.name) {
          this.toggleModal();
        }
      });
  }

  addSpace = () => {
    server.post(api.spaces, this.state.space)
      .then((res) => {
        this.setState({
          space: res.data
        });

        this.props.history.push({
          pathname: '/s/',
          state: {
            space: this.state.space
          }
        });
      });
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

          <ConfirmModal showModal={this.state.showModal}
            toggleModal={this.toggleModal} confirm={this.addSpace}
            mHeader={"Space '" + this.state.space.name + "' does not exist"}
            mBody="Do you want to request approval for this space?"
          />
        </div>
      </div>
    );
  }
}

export default Home;
