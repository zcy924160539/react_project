import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const { Item } = Form

// 更新分类
class UpdateForm extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired
  }

  UNSAFE_componentWillMount() {
    // 把form通过setForm方法对象传递给父组件
    this.props.setForm(this.props.form)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { categoryName } = this.props
    return (
      <Form>
        <Item label='分类名称'>
          {getFieldDecorator('categoryName', {
            initialValue: categoryName, // 初始值没有,initialValue也可以不指定
            rules: [
              { required: true, whitespace: true, message: '分类名称必须输入' }
            ]
          })(
            <Input placeholder='请输入分类名称' />
          )}
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UpdateForm)
