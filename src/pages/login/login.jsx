import React, { Component } from 'react'
import './login.less'
import logo from '../../assets/img/logo.png'
import { Form, Icon, Input, Button, message } from 'antd';
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'
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
        // 提交登录的ajax请求
        const result = await reqLogin(username, password)
        if (result.status === 0) { // 账号和密码都输入正确,登陆成功
          // 提示登陆成功
          message.success('登陆成功', .5)
          // 跳转页面前保存当前登录的user
          const user = result.data
          // 把user保存在内存中
          memoryUtils.user = user
          // 把user保存到localstorage中
          storageUtils.saveUser(user)
          // 跳转到管理界面(不需要回退回登录界面)
          this.props.history.replace('/')
        } else { // 账号或密码输入错误,登录失败
          // 提示错误信息
          message.error(result.msg, 1)
        }
      } else {
        message.error('校验失败', 1)
      }
    })
  }

  // 对密码进行自定义验证的函数
  validatePwd = (rule, value, callback) => {
    // value读取的是用户的密码输入
    // console.log(rule,value)    
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
    const user = memoryUtils.user
    if (user && user._id) {
      // 判断用户是否登录,如果已经登录,自动跳转到管理页面
      return <Redirect to='/' />
    }
    // 得到form对象，用于搜集表单数据，前台校验表单等功能
    const { getFieldDecorator } = this.props.form
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="logo" />
          <h1>后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                // 声明式验证： 直接使用别人定义好的验证规则进行验证
                rules: [
                  { required: true, whitespace: true, message: '请输入您的账号' },
                  { min: 4, message: '账号不能小于4位' },
                  { max: 12, message: '账号不能超过12位' },
                  { pattern: /^[a-z][A-z0-9_]*$/, message: '账号必须以小写字母开头' }
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


export default Form.create()(Login)