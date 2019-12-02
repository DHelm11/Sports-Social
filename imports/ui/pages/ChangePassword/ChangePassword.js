import React from 'react';
import { Accounts } from 'meteor/accounts-base';

import './ChangePassword.scss';

class ChangePassword extends React.Component {
    render() {

        return (
            <div className="change-password-page">
                <h1>Change Password</h1>
                <form id="submit-info" onSubmit={() => event.preventDefault()}>
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
        const oldPass = document.forms['submit-info'].querySelector("#oldPass").value;
        const newPass = document.forms['submit-info'].querySelector("#newPass").value;
        Accounts.changePassword(oldPass, newPass, function (err) {
            if (err) {
                alert(err);
            } else {
                alert("Password Changed");
            }
        });
        document.forms['submit-info'].querySelector("#oldPass").value = "";
        document.forms['submit-info'].querySelector("#newPass").value = "";
    }

}
export default ChangePassword;
