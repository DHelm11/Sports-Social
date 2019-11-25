import React from 'react';
import { Accounts } from 'meteor/accounts-base';

import './ChangePassword.scss';

class ChangePassword extends React.Component {
    render() {

        return (
            <div className="change-password-page">
                <h1>Change Password</h1>
                <form onSubmit={() => event.preventDefault()}>
                    <label>Old Password</label>
                    <input id="oldPass" type="password"></input>
                    <label>New Password</label>
                    <input id="newPass" type="password"></input>
                    <button onClick={() => this.handler()}>Submit</button>
                </form>
            </div>
        );
    }

    handler() {
        console.log("This should change the password.");
    }

}
export default ChangePassword;
