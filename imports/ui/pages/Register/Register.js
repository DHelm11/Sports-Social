import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {Card, Row, Form, Icon, Input, Button, Checkbox, notification} from 'antd';
const FormItem = Form.Item;

class Register extends React.Component {
    constructor(){
        super();
        this.state = {
            submitLoading:false
        };
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

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            submitLoading:true
        });
        this.props.form.validateFields((err, values) => {
            if (err){
                this.setState({
                    submitLoading:false
                });
                return notification.error(err);
            }
            values.email = values.email || "";
            Meteor.call("accounts/create", values, error => {
                if (error){
                    this.setState({
                        submitLoading:false
                    });
                    return notification.error(error);
                }
                Meteor.loginWithPassword(values.username || values.email, values.password, loginError => {
                   if (loginError)
                       notification.error(loginError);
                });
            });
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Card className="form-login-register">
                <Row className="main_content">
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: 'Please enter a username'}],
                    })(
                        <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="Username"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('email')(
                        <Input prefix={<Icon type="copy" style={{fontSize: 13}}/>} placeholder="Email"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: 'Please enter your password'}],
                    })(
                        <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                               placeholder="Password"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>Remember me</Checkbox>
                    )}
                    <Button loading={this.state.submitLoading} type="primary" htmlType="submit" style={{width: "100%"}}>
                        Register
                    </Button>
                    Or <a href="/login">login now!</a>
                </FormItem>
            </Form>
                </Row>
            </Card>
        );
    }
}

Register.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Form.create()(Register);
