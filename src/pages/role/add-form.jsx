import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

const { Item } = Form

// 添加分类
class AddForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
  }


  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form labelCol={{ span:4 }} wrapperCol={{ span:16 }}>
        <Item label='角色名称'>
          {getFieldDecorator('roleName', {
            rules: [
              { required: true, whitespace: true, message: '角色名称必须输入' }
            ]
          })(
            <Input placeholder='请输入角色名称' />
          )}
        </Item>
      </Form >
    )
  }
}

export default Form.create()(AddForm)