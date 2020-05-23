import React from 'react';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/messageSpace.css';

class MessageSpace extends GeneralComponent {
  constructor(props) {
    super(props);

    const user = this.getSessionItem('users')[this.props.spaceID];

    this.state = {
      messages: [],
      message: {
        user: user.id,
        content: ''
      },
      user: user
    };

    // TEMP
    console.log(user.id + " : " + user.name + " : " + user.space);
  }

  componentDidMount() {
    this.getMessages();
    this.interval = setInterval(this.getMessages, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getMessages = () => {
    server.get(api.getMessagesInSpace + this.state.user.space)
      .then((res) => this.setState({
        messages: res.data
      }));
  }

  addMessage = () => {
    server.post(api.messages, this.state.message);
    this.getMessages();

    this.setState({
      message: {
        user: this.state.user.id,
        content: ''
      }
    });
  }

  handleKeyFormSubmit = (e) => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.addMessage();
    }
  }

  // TODO: make this into a component?
  renderMessages = () => {
    const messages = this.state.messages;

    return messages.map(message => (
      this.markOwnMessage(message)
    ));
  }

  markOwnMessage = (message) => {
    if(message.user === this.state.user.id) {
      return(
        <div key={message.id} className="message own">
          <div className="sender">
            You
          </div>

          <div className="body">
            {message.content}
          </div>
        </div>
      );
    }

    return(
      <div key={message.id} className="message">
        <div className="sender">
          {message.user_name}
        </div>

        <div className="body">
          {message.content}
        </div>
      </div>
    )
  }

  render() {
    return(
      <div id="messageSpace">
        <div className="messages">
          {this.renderMessages()}
        </div>

        <div>
          <form onSubmit={this.handleFormSubmit}>
            <textarea name="content" placeholder="Type a message... " autoFocus
              value={this.state.message.content}
              onChange={(e) => this.handleInputChange(e, 'message')}
              onKeyDown={this.handleKeyFormSubmit}
            />
          </form>
        </div>
      </div>
    )
  }
}

export default MessageSpace;
