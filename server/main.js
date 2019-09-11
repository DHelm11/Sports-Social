// Server entry point, imports all server code
const streamer = new Meteor.Streamer('chat');
streamer.allowRead('all');
streamer.allowWrite('all');

import accounts from './accounts';
Meteor.methods({
    'accounts/create':accounts.create,
    'accounts/sendResetEmail':accounts.sendResetEmail,
    'accounts/toggleVerification':accounts.toggleVerification,
    'accounts/deleteUser': accounts.deleteUser
});

import '/imports/startup/server';
import '/imports/startup/both';

