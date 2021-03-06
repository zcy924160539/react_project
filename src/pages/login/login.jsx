import React, { Component } from 'react'
import './login.less'
import logo from '../../assets/img/logo.png'
import { Form, Icon, Input, Button, message } from 'antd';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../../redux/actions'

const { Item } = Form
/*
登录的路由组件
*/
class Login extends Component {
  handleSubmit = event => {// 登录监听
    // 阻止表单默认提交
    event.preventDefault()
    // 得到form对象
    const form = this.props.form
    // 点击登录时对所有表单字段进行验证(统一验证)
    form.validateFields(async (error, values) => {
      if (!error) { // 验证通过
        // console.log('validateFields', values)
        const { username, password } = values
        // 登录
        this.props.login(username, password)
      } else {
        message.error('校验失败', 1)
      }
    })
  }

  // 对密码进行自定义验证的函数
  validatePwd = (rule, value, callback) => {
    // value读取的是用户的密码输入
    if (!value) {
      callback('请输入您的密码')
    } else if (value.length < 4) {
      callback('密码长度不能小于4位')
    } else if (value.length > 12) {
      callback('密码长度不能超过12位')
    } else if (!/^[A-z0-9_]+$/.test(value)) {
      callback('密码输入不合法')
    } else {
      callback()
    }
  }
  render() {
    // const user = memoryUtils.user
    const user = this.props.user
    if (user && user._id) {
      // 判断用户是否登录,如果已经登录,自动跳转到管理页面
      return <Redirect to='/home' />
    }

    const { errorMsg } = this.props.user

    // 得到form对象，用于搜集表单数据，前台校验表单等功能
    const { getFieldDecorator } = this.props.form
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="logo" />
          <h1>后台管理系统</h1>
        </header>
        <section className='login-content'>
          <div className={errorMsg ? 'error-msg show' : 'error-msg'}>
            {errorMsg}
          </div>
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                // 声明式验证： 直接使用别人定义好的验证规则进行验证
                rules: [
                  { required: true, whitespace: true, message: '请输入您的账号' },
                  { min: 4, message: '账号不能小于4位' },
                  { max: 12, message: '账号不能超过12位' },
                  { pattern: /^[A-z][A-z0-9_]*$/, message: '账号必须以字母开头' }
                ],
                initialValue: 'admin'
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="账 号"
                />
              )}
            </Item>
            <Item>
              {getFieldDecorator('password', {
                // 自定义式验证: 通过validatePwd函数来自定义验证
                rules: [
                  { validator: this.validatePwd }
                ]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密 码"
                />
              )}

            </Item>
            <Item>
              <Button type="primary" htmlType="submit" block={true} onSubmit={this.handleSubmit}>
                登 录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}


export default Form.create()(connect(
  state => ({ user: state.user }),
  { login }
)(Login))