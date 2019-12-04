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
                    <div className="formDiv">
                        <div className="formItemDiv">
                            <label>Bio</label>
                            <textarea id="bioField" cols="30" rows="4"></textarea>
                        </div>
                        <div className="formItemDiv">
                            <label>Favorite Team</label>
                            <select id="favTeam">
                            <option value="Arizona Cardinals">Arizona Cardinals</option>
                            <option value="Atlanta Falcons">Atlanta Falcons</option>
                            <option value="Baltimore Ravens">Baltimore Ravens</option>
                            <option value="Buffalo Bills">Buffalo Bills</option>
                            <option value="Carolina Panthers">Carolina Panthers</option>
                            <option value="Chicago Bears">Chicago Bears</option>
                            <option value="Cincinnati Bengals">Cincinnati Bengals</option>
                            <option value="Cleveland Browns">Cleveland Browns</option>
                            <option value="Dallas Cowboys">Dallas Cowboys</option>
                            <option value="Denver Broncos">Denver Broncos</option>
                            <option value="Detroit Lions">Detroit Lions</option>
                            <option value="Green Bay Packers">Green Bay Packers</option>
                            <option value="Houston Texans">Houston Texans</option>
                            <option value="Indianapolis Colts">Indianapolis Colts</option>
                            <option value="Jacksonville Jaguars">Jacksonville Jaguars</option>
                            <option value="Kansas City Chiefs">Kansas City Chiefs</option>
                            <option value="Miami Dolphins">Miami Dolphins</option>
                            <option value="Minnesota Vikings">Minnesota Vikings</option>
                            <option value="New England Patriots">New England Patriots</option>
                            <option value="New Orleans Saints">New Orleans Saints</option>
                            <option value="New York Giants">New York Giants</option>
                            <option value="New York Jets">New York Jets</option>
                            <option value="Oakland Raiders">Oakland Raiders</option>
                            <option value="Philadelphia Eagles">Philadelphia Eagles</option>
                            <option value="Pittsburgh Steelers">Pittsburgh Steelers</option>
                            <option value="Saint Louis Rams">Saint Louis Rams</option>
                            <option value="San Diego Chargers">San Diego Chargers</option>
                            <option value="San Francisco 49ers">San Francisco 49ers</option>
                            <option value="Seattle Seahawks">Seattle Seahawks</option>
                            <option value="Tampa Bay Buccaneers">Tampa Bay Buccaneers</option>
                            <option value="Tennessee Titans">Tennessee Titans</option>
                            <option value="Washington Redskins">Washington Redskins</option>
                            </select>
                        </div>
                        <div className="formItemDiv">
                            <label>Favorite Player #1</label>
                            <input id="fpo" type="text"></input>
                            <label>Favorite Player #2</label>
                            <input id="fpt" type="text"></input>
                            <label>Favorite Player #3</label>
                            <input id="fptr" type="text"></input>
                        </div>
                    </div>
                    <button onClick={() => this.handler()}>Submit</button>
                </form>
            </div>
        );
    }

    handler() {
        var id = Meteor.userId();
        var bio = document.forms["submit-info"].querySelector("#bioField").value;
        var team = document.forms["submit-info"].querySelector("#favTeam").value;
        var fpo = document.forms["submit-info"].querySelector("#fpo").value;
        var fpt = document.forms["submit-info"].querySelector("#fpt").value;
        var fptr = document.forms["submit-info"].querySelector("#fptr").value;
        Meteor.call('updateUserProfile', id, bio, team, fpo, fpt, fptr);
        alert("Update Sent");
    }
}
export default EditProfile;
