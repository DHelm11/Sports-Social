// Server entry point, imports all server code
const chatRooms = new Mongo.Collection('chatRooms');
chatRooms.insert({_id: "Public"}, () => {});
const chatRoomMessages = new Map();
chatRooms.find().observe({ added: ({_id}) => {
    const collection = new Mongo.Collection('chatRoom_' + _id)
    const streamer = new Meteor.Streamer('chatRoom_' + _id);
    streamer.allowRead('all');
    streamer.allowWrite('all');
    streamer.on('message', message => {
      collection.insert(message);
    });
    chatRoomMessages.set(_id, {collection, streamer});
  }
});
Meteor.publish('chatRooms', function() {
  const user = Meteor.user();
  const privateChatRooms = new Set(user && user.privateChatRooms ? user.privateChatRooms : []);
  chatRooms.find().forEach(chatRoom => {
    chatRoom.unlocked = chatRoom.password ? privateChatRooms.has(chatRoom._id) : true;
    chatRoom.password = !!chatRoom.password;
    this.added("chatRooms", chatRoom._id, chatRoom);
  });
  Meteor.users.find(this.userId, { fields: { privateChatRooms: 1 } }).observeChanges({
    changed: (userId, {privateChatRooms}) => {
      privateChatRooms.forEach(chatRoom => {
        this.changed("chatRooms", chatRoom, {unlocked: true});
      });
    }
  });
  this.ready();
});

import accounts from './accounts';
Meteor.methods({
    'accounts/create': accounts.create,
    'accounts/sendResetEmail': accounts.sendResetEmail,
    'accounts/toggleVerification':accounts.toggleVerification,
    'accounts/deleteUser': accounts.deleteUser,
    "chat/messages": (name, password) => {
      const room = chatRooms.findOne(name);
      if (!room)
        throw new Meteor.Error("chatRoom.notFound");
      const user = Meteor.user();
      const privateChatRooms = user && user.privateChatRooms ? user.privateChatRooms : [];
      if (room.password && room.password !== password && !privateChatRooms.find(x => x === name))
        throw new Meteor.Error("chatRoom.incorrectPassword");
      return chatRoomMessages.get(name).collection.find().fetch();
    },
    "chat/inviteUser": (roomName, username) => {
      const recipient = Meteor.users.findOne({username});
      if (!recipient)
        throw new Meteor.Error("chatRoom.unknownUser");
      recipient.privateChatRooms = recipient.privateChatRooms ? recipient.privateChatRooms : [];
      if (recipient.privateChatRooms.find(x => x === roomName))
        throw new Meteor.Error("chatRoom.alreadyInvited");
      recipient.privateChatRooms.push(roomName);
      Meteor.users.update({username}, recipient);
    },
    "chat/createRoom": (name, password) => {
      chatRooms.insert({_id: name, password});
      Meteor.users.update(Meteor.userId(), { $push: { privateChatRooms: name } });
    }
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

Meteor.startup(function () {
    smtp = {
        username: 'sportssocialwebsite@gmail.com',   // eg: server@gentlenode.com
        password: 'spring_19',   // eg: 3eeP1gtizk5eziohfervU
        server: 'smtp.gmail.com',  // eg: mail.gandi.net
        port: 465
    }

    process.env.MAIL_URL = 'smtps://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});

Meteor.startup(function () {
    Accounts.urls.resetPassword = function (token) {
        return Meteor.absoluteUrl('reset-password/' + token);
    };
});

import { Mongo } from 'meteor/mongo';
const userProfileSettings = new Mongo.Collection("userProfileSettings");
userProfileSettings.allow({ insert: () => true, update: () => true, remove: () => true1 });
Meteor.methods({
    updateUserProfile(id, bioInfo, favteam, favpo, favpt, favptr) {
        userProfileSettings.upsert({ '_id': id }, { '_id': id, 'bio': bioInfo, 'favoriteTeam': favteam, 'fpo': favpo, 'fpt': favpt, 'fptr': favptr });
    },

    getUserProfile(id) {
        return userProfileSettings.find({ '_id': id }).fetch();
    }
});

import '/imports/startup/server';
import '/imports/startup/both';

