import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import {Layout, Menu, Row, Col } from 'antd';
const { SubMenu } = Menu;

const Navbar = ({ loggedIn, location }) => (
  <Menu
        theme="dark"
        mode="horizontal"
        style={{ lineHeight: '64px' }}
        selectedKeys={[(() => {
          const menuKey = location.pathname.substring(1);
          return menuKey ? menuKey : 'newsfeed';
        })()]}
    >
    <Menu.Item key="newsfeed">
      <NavLink to="/">News Feed</NavLink>
    </Menu.Item>
    <Menu.Item key="chat">
      <NavLink to="/chat">Chat</NavLink>
    </Menu.Item>
	<Menu.Item key="TeamPages">
      <NavLink to="/TeamPages">Team Pages</NavLink>
    </Menu.Item>

    {!loggedIn && (
      <Menu.Item key="login">
        <NavLink to="/login">Login</NavLink>
      </Menu.Item>
    )}
    {!loggedIn && (
      <Menu.Item key="register">
        <NavLink to="/register">Register</NavLink>
      </Menu.Item>
    )}

    {loggedIn && (
      <SubMenu key="sub1" title="Account">
          <Menu.Item key="preferences">
            <NavLink to="/profile">
              Profile
            </NavLink>
          </Menu.Item>
          <Menu.Item key="editProfile">
            <NavLink to="/EditProfile">Edit Profile</NavLink>
          </Menu.Item>
          <Menu.Item key="changePassword">
            <NavLink to="/ChangePassword">Change Password</NavLink>
          </Menu.Item>
          <Menu.Item key="logout">
            <NavLink to="/login" onClick={() => Meteor.logout()}>
                Logout
            </NavLink>
          </Menu.Item>
      </SubMenu>
    )}
  </Menu>
);

Navbar.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired
};

export default withRouter(Navbar);
