import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Input, Select, Icon, Tooltip } from 'antd';
import moment from 'moment';

class Message extends React.Component {
  render() {
    const data = this.props;
    return (
      <Comment
              author={<a>{data.sender}</a>}
              avatar={<Icon type="user" />}
              content={
                <p>{data.message}</p>
              }
              datetime={
                <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{moment().fromNow()}</span>
                </Tooltip>
              }
            />
    );
  }
}
const chatStyle = {
  display: "flex",
  height: "100vh"
};

const streamer = new Meteor.Streamer('chat');

class Chat extends React.Component {
  constructor() {
    super();
    this.state = {messages: [], messageBoxText: ""};
    streamer.on('message', message => {
      this.state.messages.push(message);
      this.setState(this.state);
    });
  }
  handleKeyPress = (event) => {
    if (event.key === 'Enter'){
      const message = {
        sender: Meteor.user() ? Meteor.user().username : 'anonymous',
        message: event.target.value
      };
      streamer.emit('message', message);
      this.setState({messages: this.state.messages.concat(message), messageBoxText: ""});
    }
  }
  render() {
    const messages = this.state.messages;
    const user = Meteor.user();
    return (
      <div>
        {messages.map(message =>
          <Message {...message} />
        )}
        <Input
                addonBefore={user ? user.username : "anonymous"}
                placeholder="message"
                value={this.state.messageBoxText}
                onChange={e => this.setState({ messageBoxText: e.target.value })}
                onKeyPress={this.handleKeyPress} />
      </div>
    );
  }
}

Chat.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Chat;

