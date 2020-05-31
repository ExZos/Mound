import React from 'react';
import { Spinner } from 'reactstrap';

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
      },
      loaded: false
    };
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

  getMessages = () => {
    server.get(api.getMessagesInSpace + this.user.space)
      .then((res) => this.setState({
        messages: res.data,
        loaded: true
      }));

    this.updateUserLastActive();
  }

  updateUserLastActive= () => {
    server.put(api.users + this.user.id + '/', this.user)
      .then((res) => this.addToSessionArrayItem('users', res.data))
      .catch((err) => {
        this.removeSessionArrayItem('users', this.user.space);

        this.props.history.push({
          pathname: '/'
        });
      });
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
    if(e.target.nextSibling.style.display) {
      e.target.nextSibling.style.display = "";
    }
    else {
      e.target.nextSibling.style.display = "inherit";
    }
  }

  renderMessages = () => {
    const messages = this.state.messages;

    // Getting messages
    if(!this.state.loaded) {
      return (
        <Spinner type="border" color="dark" />
      );
    }
    // No messages
    else if(messages.length === 0) {
      return (
        <div className="noMessages">
          Not much of a convo here huh?
        </div>
      );
    }

    return messages.map(message => (
      <div key={message.id}
        className={(message.user === this.user.id) ? "message own" : "message"}
      >
        <div className="sender">
          {(message.user === this.user.id) ? "You" : message.user_name}
        </div>

        <div className="content" onClick={this.toggleMessageTimestamp}>
          {message.content}
        </div>

        <div className="timestamp">
          {this.convertTimestamp(message.timestamp)}
        </div>
      </div>
    ));
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
    );
  }
}

export default MessageSpace;
