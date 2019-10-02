/* eslint-disable import/no-named-default, react/destructuring-assignment */

// import packages
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

// import navbar
import Navbar from '../components/Navbar';

// import routes
import NewsFeed from '../pages/NewsFeed/NewsFeed.js';
import Chat from '../pages/Chat';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import NotFound from '../pages/Not-Found';
import RecoverPassword from '../pages/RecoverPassword';
import ResetPassword from '../pages/ResetPassword';

// import Spinner
import Spinner from '../components/Spinner';

// import hoc to pass additional props to routes
import PropsRoute from '../pages/PropsRoute';

import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;

const App = props => (
  <Layout className="layout">
    <Router>
      <Header>
        <PropsRoute component={Navbar} {...props} />
      </Header>
      {props.loggingIn && <Spinner />}
      <Content>
        <Switch>
          <PropsRoute exact path="/" component={NewsFeed} {...props} />
          <PropsRoute exact path="/chat" component={Chat} {...props} />
          <PropsRoute path="/login" component={Login} {...props} />
          <PropsRoute path="/register" component={Register} {...props} />
          <PropsRoute exact path="/profile" component={Profile} {...props} />
          <PropsRoute exact path="/profile/:_id" component={Profile} {...props} />
          <PropsRoute
            path="/recover-password"
            component={RecoverPassword}
            {...props}
          />
          <PropsRoute
            path="/reset-password/:token"
            component={ResetPassword}
            {...props}
          />
          <PropsRoute component={NotFound} {...props} />
        </Switch>
      </Content>
    </Router>
    <Footer style={{ textAlign: 'center' }}>Team Leftovers &copy; {new Date().getFullYear()}</Footer>
  </Layout>
);

App.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  userReady: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const userSub = Meteor.subscribe('user');
  const user = Meteor.user();
  const userReady = userSub.ready() && !!user;
  const loggingIn = Meteor.loggingIn();
  const loggedIn = !loggingIn && userReady;
  return {
    loggingIn,
    userReady,
    loggedIn,
  };
})(App);
