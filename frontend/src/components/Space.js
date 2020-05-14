import React from 'react';

import GeneralComponent from './GeneralComponent';
import Header from './Header';
import MessageSpace from './MessageSpace';
import { server, api } from '../server';
// import '../styles/spaces.css';

class Space extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = {
      space: {
        name: ''
      },
      user: {
        name: ''
      }
    };
  }

  componentDidMount() {
    this.getSpace();
  }

  getSpace = () => {
    server.get(api.spaces + this.props.location.state.id)
      .then(res => this.setState({
        space: res.data
      }));
  }

  handleUserChange = (e) => {
    let { name, value } = e.target;
    const user = { ...this.state.user, [name]: value };

    this.setState({
      user: user
    });
  }

  getUserInSpaceByName = () => {
    server.get(api.getUserInSpaceByName + this.state.space.id + '/' + this.state.user.name)
      .then(
        res => {
          this.setState({
            user: res.data,
            toggle: true
          });
          console.log("OKOKOK");
        },
        error => console.log("NOPENOPE")
      );
  }

  //TODO: maintain user (state/props) on refresh
  toggleMessages = () => {
    if(this.state.toggle) {
      return (
        <MessageSpace space={this.state.space} user={this.state.user} />
      )
    }

    return (
      <div>
        <form>
          <input type="text" name="name" placeholder="User name"
            value={this.state.user.name}
            onChange={this.handleUserChange}
          />
        </form>

        <div>
          <button onClick={() => this.getUserInSpaceByName()}>ENTER</button>
        </div>
      </div>
    );
  }

  render() {
    return(
      <div>
        <Header />

        <br />

        <div>
          {this.state.space.name}
        </div>

        <br />

        {this.toggleMessages()}
      </div>
    )
  }
}

export default Space;
