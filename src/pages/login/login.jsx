import React, { Component } from 'react'
import './login.less'
import logo from '../../assets/img/logo.png'
import { Form, Icon, Input, Button } from 'antd';

/*
登录的路由组件
*/
export default class Login extends Component {
  render() {
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="logo" />
          <h1>后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="账 号"
              />
            </Form.Item>
            <Form.Item>
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密 码"
              />,
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block={true}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
