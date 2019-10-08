import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import {Mongo} from 'meteor/mongo';
import React from 'react';


import './RecoverPassword.scss';


class RecoverPassword extends React.Component{
    render() {
        return (
            <div className="recover-password-page">
                <h1>Forgot Your Password?</h1>
                <form id="submit-info" onSubmit={() => event.preventDefault()}>
                    <label>Email</label>
                    <input type="text" name="user"/>
                    <button className="search-info" onClick={() => this.handler()}>Send</button>
                </form>
            </div>
        );
    }


    handler(){
        const value = document.forms['submit-info'].querySelector('input[type="text"]').value;
        /*
            const user = Mongo.Collections("users");
            const info = users.find({email = value});
            if(info != null){
                const pass = users.find({password: email = value});
                Email.sendEmail(value, 'ssocial@gmail.com', "Your password retrieval", "Here's the password associated with your account: " + pass);
            }else{
                alert('No such email');
            }
        */
    }
}

export default RecoverPassword;
