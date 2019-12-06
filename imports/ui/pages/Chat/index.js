import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Button, Modal, Menu, Comment, Form, Input, Radio, Select, Icon, Tooltip } from 'antd';
const FormItem = Form.Item;
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
              className={data.animate ? "chat-message-animate" : ""}
            />
    );
  }
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    props.setChatLayout(true);
    this.messagesRef = React.createRef();
    const room = "Public";
    this.state = {messages: [], messageBoxText: "", room, creatingChatRoom: null, inviting: null, joining: true, sentMessageCount: 0};
    this.changeChatRoom(room);
  }
  changeChatRoom(room) {
    this.setState({messages: [], room, joining: true});
    if (this.streamer) {
      this.streamer.stopAll();
    }
    this.streamer = new Meteor.Streamer('chatRoom_' + room);
    this.streamer.on('message', message => {
      if (room !== this.state.room) {
        return;
      }
      this.state.messages.push(message);
      this.setState(this.state);
    });
    Meteor.call("chat/messages", room, (error, result) => {
      if (!error) {
        this.setState({messages: result, initialMessageCount: result.length});
      } else switch (error.error) {
        case "chatRoom.notFound":
        case "chatRoom.incorrectPassword":
          alert("Unknown chat room");
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
      message._id = "sentMessage-" + this.state.sentMessageCount + 1;
      this.setState({messages: this.state.messages.concat(message), messageBoxText: "", sentMessageCount: this.state.sentMessageCount + 1});
    }
  }
  componentDidUpdate() {
    if (this.state.messages.length !== this.state.previousMessageCount && this.messagesRef.current) {
      this.messagesRef.current.scrollIntoView({ behavior: "smooth" });
      this.setState({previousMessageCount: this.state.messages.length});
    }
  }
  componentWillUnmount() {
    this.props.setChatLayout(false);
  }
  render() {
    const accessiblePrivateChatRooms = new Set(this.props.accessiblePrivateChatRooms.length ? this.props.accessiblePrivateChatRooms[0].privateChatRooms : []);
    const currentRoom = this.props.chatRooms.find(chatRoom => chatRoom._id === this.state.room);
    if (this.state.joining) {
      if (currentRoom) {
        this.setState({joining: false});
      }
    } else {
      if (!currentRoom || currentRoom.password && !accessiblePrivateChatRooms.has(currentRoom._id) && this.props.chatRooms.find(chatRoom => chatRoom._id === "Public")) {
        // Room was deleted
        this.changeChatRoom("Public");
      }
    }

    const messages = this.state.messages;
    const user = Meteor.user();
    return <>
      <Modal
        title="Create Chat Room"
        visible={this.state.creatingChatRoom !== null}
        onOk={() => {
              const name = this.state.creatingChatRoom.name;
              if (!/[\w-]+/.test(name)) {
                alert("Invalid chat room name");
              }
              Meteor.call("chat/createRoom", name, this.state.creatingChatRoom.private, (error, result) => {
                if (!error) {
                  this.changeChatRoom(name);
                }
              });
              this.setState({creatingChatRoom: null});
        }}
        onCancel={() => this.setState({creatingChatRoom: null})}
      >
        <FormItem>
          <Input placeholder="Name" value={this.state.creatingChatRoom && this.state.creatingChatRoom.name} onChange={e => this.setState({creatingChatRoom: {name: e.target.value, private: this.state.creatingChatRoom.private}})} />
        </FormItem>
        <FormItem>
          <Radio.Group value={this.state.creatingChatRoom && this.state.creatingChatRoom.private ? "private" : "public"} onChange={e => this.setState({creatingChatRoom: {name: this.state.creatingChatRoom.name, private: e.target.value == "private" }})} >
            <Radio.Button value="public">Public</Radio.Button>
            <Radio.Button value="private">Private</Radio.Button>
          </Radio.Group>
        </FormItem>
      </Modal>
      <Modal
        title="Invite User"
        footer={null}
        visible={this.state.inviting !== null}
        onOk={() => this.setState({inviting: null})}
        onCancel={() => this.setState({inviting: null})}
      >
        <FormItem layout="inline">
          <Input placeholder="Name" value={this.state.inviting} onChange={e => this.setState({inviting: e.target.value})} />
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={() => {
            if (!this.state.inviting) {
              return;
            }
            Meteor.call("chat/inviteUser", this.state.room, this.state.inviting, (error, result) => {
              if (error) {
                alert("Error: " + error.error);
              }
            });
            this.setState({inviting: null});
          }}>
            Send
          </Button>
        </FormItem>
      </Modal>
      <Menu
        style={{ width: "25%" }}
        selectedKeys={[this.state.room]}
        mode="inline"
        onSelect={ ({ key }) => {
              this.changeChatRoom(key);
            }
        }>
        <Menu.ItemGroup key="chatRooms" title={
          <span>Chat Rooms
            <Icon type="plus" className="add-button" onClick={() => {
              this.setState({creatingChatRoom: {name: "", private: false}});
            }}/></span>
          }
          >
          {this.props.chatRooms.map(room =>
            <Menu.Item
                key={room._id}
                disabled={room.password && !accessiblePrivateChatRooms.has(room._id)}
              >
              {room._id} {room.password ? <Icon type={(accessiblePrivateChatRooms.has(room._id) ? "un" : "") + "lock"}/> : ""}
              {room.password && room._id === this.state.room &&
                <Icon type="user-add" className="invite-button" onClick={() => {
                  this.setState({inviting: ""});
                }}/>
              }
            </Menu.Item>
          )}
        </Menu.ItemGroup>
      </Menu>
      <div className="chat-content">
        <div className="chat-messages">
            {messages.map((message, index) =>
              <Message key={message._id} {...message} animate={index >= this.state.initialMessageCount} />
            )}
            <div ref={this.messagesRef} />
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
    chatRooms: chatRooms.find().fetch(),
    accessiblePrivateChatRooms: Meteor.users.find(Meteor.userId(), { fields: { privateChatRooms: 1 } }).fetch()
  };
})(Chat);

