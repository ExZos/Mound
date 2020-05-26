import React from 'react';

import GeneralComponent from './GeneralComponent';
import { server, api } from '../server';
import '../styles/messageSpace.css';

class MessageSpace extends GeneralComponent {
  constructor(props) {
    super(props);

    this.user = this.getSessionItem('users')[this.props.spaceID];

    this.state = {
      messages: [],
      message: {
        user: this.user.id,
        content: ''
      }
    }
  }

  componentDidMount() {
    // TEMP
    console.log(this.user.id + " : " + this.user.name + " : " + this.user.space);

    this.getMessages();
    this.interval = setInterval(this.getMessages, 1000);
  }

  // TODO: find better solution to fix default web navs
  //       should avoid full page reloads
  componentDidUpdate() {
    window.onpopstate = (e) => {
       window.location.reload(false);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // TODO: spinner while getting messages
  getMessages = () => {
    server.get(api.getMessagesInSpace + this.user.space)
      .then((res) => this.setState({
        messages: res.data
      }));

    this.updateUserLastActive();
  }

  updateUserLastActive= () => {
    server.put(api.users + this.user.id + '/', this.user);
      // .then((res) => this.addToSessionArrayItem('users', res.data));
  }

  addMessage = () => {
    server.post(api.messages, this.state.message);
    this.getMessages();

    this.setState({
      message: {
        user: this.user.id,
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

  toggleMessageTimestamp = (e) => {
    const displayStyle = e.target.nextSibling.style.display;

    if(displayStyle) {
      e.target.nextSibling.style.display = "";
    }
    else {
      e.target.nextSibling.style.display = "inherit";
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
    if(message.user === this.user.id) {
      return(this.messageTemplate(message, "own"));
    }

    return(this.messageTemplate(message, ""));
  }

  messageTemplate = (message, className) => {
    return(
      <div key={message.id} className={"message " + className}>
        <div className="sender">
          {message.user_name}
        </div>

        <div className="content" onClick={this.toggleMessageTimestamp}>
          {message.content}
        </div>

        <div className="timestamp">
          {this.convertTimestamp(message.timestamp)}
        </div>
      </div>
    );
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
