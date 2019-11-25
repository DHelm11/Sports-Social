import React from 'react';


import './EditProfile.scss';

class EditProfile extends React.Component {
    render() {

        return (
            <div className="edit-profile-page">
                <h1>Edit Profile</h1>
                <form>
                    <label>Favorite Team</label>
                    <input type="text"></input>
                    <label>Favorite Player</label>
                    <input type="text"></input>
                    <button>Submit</button>
                </form>
            </div>
        );
    }
}
export default EditProfile;
