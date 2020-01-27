import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'

const { Item } = Form
const { Option } = Select

// 添加用户,修改用户
class UserForm extends PureComponent {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { roles, user } = this.props
    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
        <Item label='用户名'>
          {getFieldDecorator('username', {
            initialValue: user.username,
            rules: [
              { required: true, whitespace: true, message: '用户名必须输入' },
              { min: 4, message: '用户名不能小于4位' },
              { max: 12, message: '用户名不能超过12位' },
              { pattern: /^[A-z][A-z0-9_]*$/, message: '用户名必须以字母开头' }
            ]
          })(
            <Input placeholder='请输入用户名' />
          )}
        </Item>
        {
          user._id ? null : (
            <Item label='密 码'>
              {getFieldDecorator('password', {
                initialValue: '',
                rules: [
                  { required: true, whitespace: true, message: '密码必须输入' },
                  { min: 4, message: '密码不能小于4位' },
                  { max: 12, message: '密码不能超过12位' },
                ]
              })(
                <Input type='password' placeholder='请输入密码' />
              )}
            </Item>
          )
        }

        <Item label='手机号'>
          {getFieldDecorator('phone', {
            initialValue: user.phone,
            rules: [
              { required: true, whitespace: true, message: '手机号必须输入' },
              { pattern: /^1[3456789]\d{9}$/, message: '请输入合法的手机号' }
            ]
          })(
            <Input type='tel' placeholder='请输入手机号' />
          )}
        </Item>
        <Item label='邮 箱'>
          {getFieldDecorator('email', {
            initialValue: user.email,
            rules: [
              { required: true, whitespace: true, message: '邮箱必须输入' },
              { pattern: /^([A-z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '请输入合法的邮箱' }
            ]
          })(
            <Input type='email' placeholder='请输入邮箱' />
          )}
        </Item>
        <Item label='角色'>
          {getFieldDecorator('role_id', {
            initialValue: user.role_id,
            rules: [
              { required: true, message: '必须选择角色' },
            ]
          })(
            <Select>
              {
                roles.map(role => (
                  <Option value={role._id} key={role._id}>
                    {role.name}
                  </Option>
                ))
              }
            </Select>
          )}
        </Item>
      </Form >
    )
  }
}

export default Form.create()(UserForm)