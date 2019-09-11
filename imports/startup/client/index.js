import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';

import 'antd/dist/antd.css';

// connect to ddp (uncomment when url is set in ddp.js)
// import '../../api/remote/ddp';

// import client routes
import App from '../../ui/layouts/App';

// mount app
Meteor.startup(() => {
  render(<App />, document.getElementById('react-root'));
});
