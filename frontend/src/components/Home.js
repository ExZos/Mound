import React from 'react';
import { TextField, Button } from '@material-ui/core';

import GeneralComponent from './GeneralComponent';
import Sidebar from './Sidebar';
import ConfirmDialog from './ConfirmDialog';
import { server, api } from '../server';
import '../styles/home.scss';

class Home extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = {
      space: {
        name: ''
      },
      showModal: false
    };
  }

  componentDidMount() {
    // TEMP
    console.log(this.getSessionItem('users'));
  }

  getSpaceByName = async () => {
    try {
      const res = await server.get(api.getSpaceByName + this.state.space.name + '/');

      this.setState({
        space: res.data
      });

      this.props.history.push({
        pathname: '/s/',
        state: {
          space: this.state.space
        }
      });
    } catch (e) {
      if(this.state.space.name) {
        this.toggleModal();
      }
    }
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
        <Sidebar />

        <br />

        <form id="getSpaceByName" onSubmit={this.handleFormSubmit}>
          <div className="textFieldWButton">
            <TextField name="name" label="Type a space name..." autoFocus
              size="small" variant="outlined"
              value={this.state.space.name}
              onChange={(e) => this.handleInputChange(e, 'space')}
            />

            <Button type="submit" color="primary"
              size="small" variant="outlined"
              tabIndex="-1" onClick={this.getSpaceByName}>
                ENTER
            </Button>
          </div>
        </form>

        <ConfirmDialog showModal={this.state.showModal}
          toggleModal={this.toggleModal} confirm={this.addSpace}
          mHeader={"Space '" + this.state.space.name + "' does not exist"}
          mBody="Do you want to request approval for this space?"
        />
      </div>
    );
  }
}

export default Home;
