import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Card, Row, Layout, Form, Icon, Input, Button, Checkbox, notification } from 'antd';
const FormItem = Form.Item;

import './Login.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errMsg: null,
      submitLoading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    if (this.props.loggedIn) {
      return this.props.history.push('/profile');
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.loggedIn) {
      nextProps.history.push('/profile');
      return false;
    }
    return true;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if (err) {
            return notification.error(err);
        }
        this.setState({
            submitLoading:true
        });
        Meteor.loginWithPassword(values.email, values.password, loginError => {
            this.setState({
                submitLoading:false
            });
            if (loginError)
                notification.error(loginError);
        });
    });
  }
  render() {
    if (this.props.loggedIn) {
      return null;
    }

    const { errMsg } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
            <Card className="form-login-register">
                <Row className="main_content">
        <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
                {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please enter your email or username' }],
                })(
                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Email or Username" />
                )}
            </FormItem>
            <FormItem>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please enter your password' }],
                })(
                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                )}
            </FormItem>
            <FormItem>
                {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                })(
                    <Checkbox>Remember me</Checkbox>
                )}
                <a style={{float:"right"}} href="/forgotpassword">Forgot password</a>
                <Button loading={this.state.submitLoading} type="primary" htmlType="submit" style={{width:"100%"}}>
                    Log in
                </Button>
                Or <a href="/register" >register now!</a>
            </FormItem>
        </Form>
                </Row>
            </Card>
    );
  }
}

export default Form.create()(Login);

Login.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
