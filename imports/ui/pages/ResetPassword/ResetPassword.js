import React from 'react';
import { Accounts } from 'meteor/accounts-base';

import './ResetPassword.scss';

class ResetPassword extends React.Component {
    render() {
        return (
            <div className="reset-password-page">
                <h1>Reset Password</h1>
                <form id="submit-info" onSubmit={() => event.preventDefault()}>
                    <label>New Password</label>
                    <input type="password" name="pass" />
                    <button className="search-info" onClick={() => this.handler()}>Send</button>
                </form>
            </div>
        );
    }

    

    handler() {
        const newPass = document.forms['submit-info'].querySelector('input[type="password"]').value;
        console.log(newPass);
        Accounts.setPassword(token, newPass);
    }
}

export default ResetPassword;
