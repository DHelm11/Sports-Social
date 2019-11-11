import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {Layout, Menu, Row, Col } from 'antd';
const { SubMenu } = Menu;

const Navbar = ({ loggedIn }) => (
  <Menu
        theme="dark"
        mode="horizontal"
        style={{ lineHeight: '64px' }}
    >
    <Menu.Item key="newsfeed">
      <NavLink to="/">News Feed</NavLink>
    </Menu.Item>
    <Menu.Item key="chat">
      <NavLink to="/chat">Chat</NavLink>
    </Menu.Item>
	<Menu.Item key="teampage">
      <NavLink to="/teampage">Team Pages</NavLink>
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
};

export default Navbar;
