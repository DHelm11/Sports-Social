import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import './EditProfile.scss';

class EditProfile extends React.Component {
    render() {

        return (
            <div className="edit-profile-page">
                <h1>Edit Profile</h1>
                <form id="submit-info" onSubmit={() => event.preventDefault()}>
                    <label>Favorite Team</label>
                    <select id="favTeam">
                        <option>Arizona Cardinals</option>
                        <option>Atlanta Falcons</option>
                        <option>Baltimore Ravens</option>
                        <option>Buffalo Bills</option>
                        <option>Carolina Panthers</option>
                        <option>Chicago Bears</option>
                        <option>Cincinnati Bengals</option>
                        <option>Cleveland Browns</option>
                        <option>Dallas Cowboys</option>
                        <option>Denver Broncos</option>
                        <option>Detroit Lions</option>
                        <option>Green Bay Packers</option>
                        <option>Houston Texans</option>
                        <option>Indianapolis Colts</option>
                        <option>Jacksonville Jaguars</option>
                        <option>Kansas City Chiefs</option>
                        <option>Miami Dolphins</option>
                        <option>Minnesota Vikings</option>
                        <option>New England Patriots</option>
                        <option>New Orleans Saints</option>
                        <option>New York Giants</option>
                        <option>New York Jets</option>
                        <option>Oakland Raiders</option>
                        <option>Philadelphia Eagles</option>
                        <option>Pittsburgh Steelers</option>
                        <option>Saint Louis Rams</option>
                        <option>San Diego Chargers</option>
                        <option>San Francisco 49ers</option>
                        <option>Seattle Seahawks</option>
                        <option>Tampa Bay Buccaneers</option>
                        <option>Tennessee Titans</option>
                        <option>Washington Redskins</option>
                    </select>
                    <label>Favorite Player #1</label>
                    <input id="fpo" type="text"></input>
                    <label>Favorite Player #2</label>
                    <input id="fpt" type="text"></input>
                    <label>Favorite Player #3</label>
                    <input id="fptr" type="text"></input>
                    <button onClick={() => this.handler()}>Submit</button>
                </form>
            </div>
        );
    }
    handler() {
        const userProfileSettings = new Mongo.Collection('userProfileSettings');
        var isInDatabase = userProfileSettings.find({ userid: Meteor.userId() });
        if (isInDatabase.count() != 0) {
            console.log("is in database");
            console.log(isInDatabase.fetch());
        } else {
            console.log("is not in database");
            userProfileSettings.insert({
                userid: Meteor.userId(),
                bio: "",
                favoriteTeam: document.forms['submit-info'].querySelector("#favTeam").value,
                fpo: document.forms['submit-info'].querySelector("#fpo").value,
                fpt: document.forms['submit-info'].querySelector("#fpt").value,
                fptr: document.forms['submit-info'].querySelector("#fptr").value
            });
        }
    }
}
export default EditProfile;
