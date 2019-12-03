import React from 'react';
import { Accounts } from 'meteor/accounts-base';

import './ResetPassword.scss';

class ResetPassword extends React.Component {

    render() {
        return (
            <div className="reset-password-page">
                <h1>Reset Password</h1>
                <h5>The code is the token in the URL above after "/reset-password/"</h5>
                <form id="submit-info" onSubmit={() => event.preventDefault()}>
                    <label>Code</label>
                    <input title="Use the code found in the URL after /reset-password/" type="text" name="token"/>
                    <label>New Password</label>
                    <input type="password" name="pass" />
                    <button className="search-info" onClick={() => this.handler()}>Send</button>
                </form>
            </div>
        );
    }

    handler() {
        Accounts.resetPassword(document.forms['submit-info'].querySelector('input[type="text"]').value, document.forms['submit-info'].querySelector('input[type="password"]').value, function (err) {
                if (err) {
                    alert(err);
                } else {
                    alert("Password Reset Successfully");
                }
            });
            document.forms['submit-info'].querySelector('input[type="text"]').value = "";
            document.forms['submit-info'].querySelector('input[type="password"]').value = "";
    }
}

export default ResetPassword;
