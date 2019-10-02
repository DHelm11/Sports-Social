// Server entry point, imports all server code
const streamer = new Meteor.Streamer('chat');
streamer.allowRead('all');
streamer.allowWrite('all');

const chatMessages = new Mongo.Collection('chatMessages');
streamer.on('message', message => {
  chatMessages.insert(message);
});

import accounts from './accounts';
Meteor.methods({
    'accounts/create':accounts.create,
    'accounts/sendResetEmail':accounts.sendResetEmail,
    'accounts/toggleVerification':accounts.toggleVerification,
    'accounts/deleteUser': accounts.deleteUser,
    "chat/messages": () => chatMessages.find().fetch()
});

const newsFeedStreamer = new Meteor.Streamer('publicNewsFeed');
newsFeedStreamer.allowRead('all');
newsFeedStreamer.allowWrite('all');
const publicNewsFeed = new Mongo.Collection('publicNewsFeed');
newsFeedStreamer.on('message', message => {
  publicNewsFeed.insert(message);
});
newsFeedStreamer.on('likePost', (id, undo) => {
  publicNewsFeed.update({ _id: id }, { $inc: { likes: 1 } });
});
newsFeedStreamer.on('dislikePost', (id, undo) => {
  publicNewsFeed.update({ _id: id }, { $inc: { dislikes: 1 } });
});
newsFeedStreamer.on('deletePost', id => publicNewsFeed.remove({ _id: id }));
Meteor.methods({
    'news-feed/posts': () => publicNewsFeed.find().fetch(),
    'news-feed/create-post': message => {
      publicNewsFeed.insert(message, (error, id) => {
        if (!error) {
          newsFeedStreamer.emit('message', Object.assign(message, { _id: id }));
        }
      });
    },
    'news-feed/delete-post': id => publicNewsFeed.remove({ _id: id }, true),
});

import '/imports/startup/server';
import '/imports/startup/both';

