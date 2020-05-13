import React from 'react';

import GeneralComponent from './GeneralComponent';
import Header from './Header';
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
    server.get(api.spaces + this.props.match.params.id)
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

  getUser = () => {
    server.get(api.getUser + this.state.user.name)
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

  // TODO: Put into separate component/endpoint
  renderMessages = () => {
    if(this.state.toggle) {
      return (
        <div>
          <div>
            {this.state.user.name}
          </div>

          <br />

          <div>
            MESSAGES GO HERE
          </div>
        </div>
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
          <button onClick={() => this.getUser()}>ENTER</button>
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

        {this.renderMessages()}
      </div>
    )
  }
}

export default Space;
