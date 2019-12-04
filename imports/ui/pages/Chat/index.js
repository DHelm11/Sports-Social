import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Modal, Menu, Comment, Input, Select, Icon, Tooltip } from 'antd';
const { SubMenu } = Menu;
import moment from 'moment';
import './Chat.scss';

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
                <Tooltip title={moment(data.date).format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{moment(data.date).fromNow()}</span>
                </Tooltip>
              }
            />
    );
  }
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    props.setChatLayout(true);
    const urlParams = new URLSearchParams(window.location.search);
    let room = urlParams.get("room");
    this.initialPassword = urlParams.get("password");
    this.passwords = {};
    if (!room) {
      room = "Public";
    } else if (this.initialPassword) {
      this.passwords = JSON.parse(window.localStorage.getItem("chatRoomPasswords"));
      this.passwords = this.passwords ? this.passwords : {};
      this.passwords[room] = this.initialPassword;
      window.localStorage.setItem("chatRoomPasswords", JSON.stringify(this.passwords));
    }
    this.state = {messages: [], messageBoxText: "", room};
    this.changeChatRoom(room);
  }
  changeChatRoom(room) {
    this.streamer = new Meteor.Streamer('chatRoom_' + this.state.room);
    this.streamer.on('message', message => {
      this.state.messages.push(message);
      this.setState(this.state);
    });
    Meteor.call("chat/messages", room, this.passwords[room], (error, result) => {
      if (!error) {
        this.setState({messages: result});
      } else switch (error.error) {
        case "chatRoom.notFound":
        case "chatRoom.incorrectPassword":
          alert("Unknown chat room");
          this.setState({room: "Public"});
          this.changeChatRoom("Public");
          break;
      }
    });
  }
  handleKeyPress = (event) => {
    if (event.key === 'Enter'){
      const message = {
        sender: Meteor.user() ? Meteor.user().username : 'anonymous',
        message: event.target.value,
        date: Date()
      };
      this.streamer.emit('message', message);
      this.setState({messages: this.state.messages.concat(message), messageBoxText: ""});
    }
  }
  componentWillUnmount() {
    this.props.setChatLayout(false);
  }
  render() {
    const messages = this.state.messages;
    const user = Meteor.user();
    return <>
      <Modal
        title="Invite Link"
        visible={this.state.invite}
        footer={null}
        onOk={() => this.setState({invite: null})}
        onCancel={() => this.setState({invite: null})}
      >
        {this.state.invite}
      </Modal>
      <Menu
        style={{ width: "25%" }}
        selectedKeys={[this.state.room]}
        mode="inline"
        onSelect={ ({ key }) => {
              this.setState({messages: [], room: key});
              this.changeChatRoom(key);
            }
        }>
        <Menu.ItemGroup key="chatRooms" title={
            <span>Chat Rooms <Icon type="plus" className="add-button" onClick={() => {
              const name = prompt("New chat room name:");
              if (!/[\w-]+/.test(name)) {
                alert("Invalid chat room name");
              }
              const password = [...Array(30)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
              Meteor.call("chat/createRoom", name, password, (error, result) => {
                if (!error) {
                  if (password) {
                    this.passwords[name] = password;
                    window.localStorage.setItem("chatRoomPasswords", JSON.stringify(this.passwords));
                  }
                  this.setState({messages: [], room: name, invite: window.location.origin + window.location.pathname + "?room=" + name + "&password=" + password});
                  this.changeChatRoom(name);
                }
              });
            }}/></span>
          }
          >
          {this.props.chatRooms.map(room =>
            <Menu.Item
                key={room._id}
                disabled={!room.unlocked && !this.passwords[room._id]}
              >
              {room._id} {room.password ? <Icon type="lock"/> : ""}
            </Menu.Item>
          )}
        </Menu.ItemGroup>
      </Menu>
      <div className="chat-content">
        <div className="chat-messages">
            {messages.map(message =>
              <Message key={message._id} {...message} />
            )}
          </div>
          <Input
                  addonBefore={user ? user.username : "anonymous"}
                  placeholder="message"
                  value={this.state.messageBoxText}
                  onChange={e => this.setState({ messageBoxText: e.target.value })}
                  onKeyPress={this.handleKeyPress} />
      </div>
    </>;
  }
}

Chat.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const chatRooms = new Mongo.Collection('chatRooms');

export default withTracker(() => {
  Meteor.subscribe('chatRooms');
  return {
    chatRooms: chatRooms.find().fetch()
  };
})(Chat);

