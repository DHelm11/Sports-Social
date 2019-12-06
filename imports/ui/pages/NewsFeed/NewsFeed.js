import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Card, Avatar, Comment, Input, Select, Icon, Tooltip } from 'antd';
const { TextArea } = Input;
import moment from 'moment';
import './NewsFeed.scss'

class Message extends React.Component {
  render() {
    const {message, sender, date, likes, dislikes, action, reply, showReply} = this.props;
    const actions = [
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={action === 'liked' ? 'filled' : 'outlined'}
            onClick={this.props.like}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{likes}</span>
      </span>,
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={action === 'disliked' ? 'filled' : 'outlined'}
            onClick={this.props.dislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>{dislikes}</span>
      </span>,
      this.props.delete ?
        <span key="delete-button">
          <Tooltip title="Delete">
            <Icon
              type="delete"
              onClick={this.props.delete}
            />
          </Tooltip>
        </span>
        : null,
      <span key="comment-basic-reply-to" onClick={this.props.reply}><Icon type="plus" /> Reply</span>,
    ];
    return (
      <Comment
              author={<a>{sender}</a>}
              actions={actions}
              avatar={<Avatar size="large" icon="user" />}
              content={
                <p>{message}</p>
              }
              datetime={
                <Tooltip title={moment(date).format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{moment(date).fromNow()}</span>
                </Tooltip>
              }
      >
        {showReply && (
          <div style={{marginTop: -20}}>
          <TextArea
                  rows={2}
                  placeholder="comment"
                  value=""
                  onChange={null}
                  onKeyPress={null} />
          <Button type="primary" icon="plus" size="small" onClick={null}>Reply</Button>
          </div>
        )}
      </Comment>
    );
  }
}
const chatStyle = {
  display: "flex",
  height: "100vh"
};

const streamer = new Meteor.Streamer('publicNewsFeed');

class NewsFeed extends React.Component {
  constructor() {
    super();
    this.state = {messages: [], messageBoxText: "", replying: null};
    streamer.on('message', message => {
      this.setState({messages: [message, ...this.state.messages]});
    });
    streamer.on('likePost', this.likePost);
    streamer.on('dislikePost', this.dislikePost);
    streamer.on('deletePost', this.deletePost);
    Meteor.call("news-feed/posts", (error, result) => {
      if (!error) {
        this.setState({messages: result.sort((a,b) => new Date(b.date) - new Date(a.date)) });
      }
    });
  }
  onStatusBoxKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onPostButtonClick();
    }
  }
  onPostButtonClick = () => {
    const message = {
      sender: Meteor.user() ? Meteor.user().username : 'anonymous',
      message: this.state.messageBoxText,
      likes: 0,
      dislikes: 0,
      action: "",
      date: Date()
    };
    Meteor.call("news-feed/create-post", message);
    this.setState({messageBoxText: ""});
  }
  deletePost = id => {
    this.setState(state => ({
      messages: state.messages.filter(m => m._id !== id)
    }));
  }
  likePost = (id, undo, self) => {
    this.setState(state => ({
      messages: state.messages.map(m => 
        m._id === id ?
          Object.assign(m, {
            likes: undo ? m.likes - 1 : m.likes + 1,
            action: self ? 'liked' : m.action,
          })
        : m)
      }));
  }
  dislikePost = (id, undo, self) => {
    this.setState(state => ({
      messages: state.messages.map(m => 
        m._id === id ?
          Object.assign(m, {
            dislikes: undo ? m.dislikes - 1 : m.dislikes + 1,
            action: self ? 'disliked' : m.action,
          })
        : m)
      }));
  }
  render() {
    const messages = this.state.messages;
    const user = Meteor.user();
    return (
      <Card style={{maxWidth: "75%", margin: "auto"}}>
      <Row>
        <TextArea
                rows={4}
                placeholder="status update"
                value={this.state.messageBoxText}
                onChange={e => this.setState({ messageBoxText: e.target.value })}
                onKeyPress={this.onStatusBoxKeyPress} />
      <Button type="primary" icon="plus" onClick={this.onPostButtonClick}>Post</Button>
          </Row>
          <Row>
      <div>
        {messages.map(message =>
          <Message key={message._id} {...message}
            showReply={message._id == this.state.replying}
            reply={() => {
              this.setState({ replying: this.state.replying ? null : message._id });
            }}
            like={() => {
              streamer.emit('likePost', message._id);
              this.likePost(message._id, false, true);
            }}
            dislike={() => {
              streamer.emit('dislikePost', message._id);
              this.dislikePost(message._id, false, true);
            }}
            delete={!user && message.sender === "anonymous"
                    || user && message.sender == user.username ?
              () => {
                streamer.emit('deletePost', message._id);
                this.deletePost(message._id);
              }
              : null
            }
          />
        )}
      </div>
      </Row>
      </Card>
    );
  }
}

NewsFeed.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default NewsFeed;

