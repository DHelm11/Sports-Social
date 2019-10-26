import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Promise } from 'meteor/promise';

import { Users } from '../../../api/remote/users.js';
import React from 'react';


import './RecoverPassword.scss';


class RecoverPassword extends React.Component {

    render() {
        return (
            <div className="recover-password-page">
                <h1>Forgot Your Password?</h1>
                <form id="submit-info" onSubmit={() => event.preventDefault()}>
                    <label>Email</label>
                    <input type="text" name="email" />
                    <button className="search-info" onClick={() => this.handler()}>Send</button>
                </form>
            </div>
        );
    }

    handler() {
        const email = document.forms['submit-info'].querySelector('input[type="text"]').value;
            Accounts.forgotPassword({ email: email }, function (err) {
                if (err) {
                    alert("No such email exists");
                } else {
                    alert("Email sent");
                }
            });
            document.forms['submit-info'].querySelector('input[type="text"]').value = "";
        
    }

}

export default RecoverPassword;
