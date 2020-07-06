import React from 'react';
import { TextField, CircularProgress } from '@material-ui/core';

import GeneralComponent from './GeneralComponent';
import PollSpace from './PollSpace';
import NamePoll from './NamePoll';
import { server, api } from '../server';
import '../styles/messageSpace.css';

class MessageSpace extends GeneralComponent {
  constructor(props) {
    super(props);

    this.loaded = false;

    this.state = {
      messages: [],
      message: {
        user: this.props.user.id,
        content: ''
      }
    };
  }

  componentDidMount() {
    // TEMP
    console.log(this.props.user.id + " : " + this.props.user.name + " : " + this.props.user.space);

    this.getMessages();
    this.interval = setInterval(this.getMessages, 1000);
  }

  componentDidUpdate() {
    window.onpopstate = (e) => {
      this.loaded = false;

      this.props.updateState();
      this.getMessages();
    }
  }

  componentWillUnmount() {
    this.loaded = false;

    clearInterval(this.interval);
  }

  getMessages = async () => {
    try {
      const res = await server.get(api.getMessagesInSpace + this.props.user.space);

      this.loaded = true;

      this.setState({
        messages: res.data
      });

      this.updateUserLastActive();
    } catch (e) {
      // TODO: render error component
    }
  }

  updateUserLastActive = async () => {
    try {
      const res = await server.put(api.users + this.props.user.id + '/', this.props.user);

      if(this.loaded) {
        this.addToSessionArrayItem('users', res.data);

        this.props.updateState();
      }
    } catch (e) {
      // User deleted: force logout
      // TODO: implement bans (User.banned)
      this.removeSessionArrayItem('users', this.props.user.space);

      this.props.history.push({
        pathname: '/'
      });
    }
  }

  addMessage = async () => {
    try {
      /*const res = */await server.post(api.messages, this.state.message);
      this.getMessages();

      this.setState({
        message: {
          user: this.props.user.id,
          content: ''
        }
      });
    } catch (e) {
      // TODO: render error component
    }
  }

  handleKeyFormSubmit = (e) => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.addMessage();
    }
  }

  toggleMessageTimestamp = (e) => {
    // console.log(e.target.className);
    if(e.target.nextSibling.style.display) {
      e.target.nextSibling.style.display = "";
    }
    else {
      e.target.nextSibling.style.display = "inherit";
    }
  }

  renderMessages = () => {
    const messages = this.state.messages;

    // No messages
    if(messages.length === 0) {
      return (
        <div className="noMessages">
          Not much of a convo here huh?
        </div>
      );
    }

    return messages.map(message => (
      <div key={message.id}
        className={(message.user === this.props.user.id) ? "message own" : "message"}
      >
        <div className="sender">
          {(message.user === this.props.user.id) ? "You" : message.user_name}
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
    if(!this.loaded) {
      return (
        <div id="messageSpace">
          <CircularProgress color="inherit" />
        </div>
      );
    }

    return(
      <div id="messageSpace">
        <div className="messages">
          {this.renderMessages()}
        </div>

        <div>
          <form id="createMessage" onSubmit={this.handleFormSubmit}>
            <TextField name="content" placeholder="Type a message... " autoFocus
              variant="outlined" multiline fullWidth
              value={this.state.message.content}
              onChange={(e) => this.handleInputChange(e, 'message')}
              onKeyDown={this.handleKeyFormSubmit}
            />
          </form>
        </div>

        <br />

        <PollSpace spaceID={this.props.user.space} userID={this.props.user.id} />

        <br />

        <NamePoll spaceID={this.props.user.space} userID={this.props.user.id} />
      </div>
    );
  }
}

export default MessageSpace;
