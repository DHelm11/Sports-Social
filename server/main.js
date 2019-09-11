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

import '/imports/startup/server';
import '/imports/startup/both';

