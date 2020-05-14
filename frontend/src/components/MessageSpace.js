import React from 'react';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/messageSpace.css';

class MessageSpace extends GeneralComponent {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      user: {}
    };
  }

  componentDidMount() {
    this.getMessages();
    this.interval = setInterval(this.getMessages, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getMessages = () => {
    server.get(api.getMessagesInSpace + this.props.space.id)
      .then(res => this.setState({
        messages: res.data
      }));
  }

  // TODO: make this into a component?
  renderMessages = () => {
    const messages = this.state.messages;

    return messages.map(message => (
      this.markOwnMessage(message)
    ));
  }

  markOwnMessage = (message) => {
    if(message.user.id === this.props.user.id) {
      return(
        <div key={message.id} className="message own">
          <span>
            You:
          </span>

          <span>
            {message.content}
          </span>
        </div>
      );
    }

    return(
      <div key={message.id} className="message">
        <span className="sender">
          {message.user.name}:
        </span>

        <span className="body">
          {message.content}
        </span>
      </div>
    )
  }

  // TODO: add message input fields + eventhandlers
  render() {
    return(
      <div className="messageSpace">
        <div>
          {this.props.user.name}
        </div>

        <br />

        <div>
          {this.renderMessages()}
        </div>
      </div>
    )
  }
}

export default MessageSpace;
