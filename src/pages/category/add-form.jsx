import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'

const { Item } = Form
const { Option } = Select

// 添加分类
class AddForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired, // 传递form对象的函数
    categorys: PropTypes.array.isRequired, // 一级分类的数组
    parentId: PropTypes.string.isRequired //父分类的Id
  }

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { categorys, parentId } = this.props
    return (
      <Form>
        <Item label='所属分类'>
          {getFieldDecorator('parentId', {
            initialValue: parentId, // 指定初始value对应的值
          })(
            <Select>
              {/* 一级分类对应的parentId为 '0' */}
              <Option value='0'>一级分类</Option>
              {
                categorys.map(category => (
                  <Option value={category._id} key={category._id}>
                    {category.name}
                  </Option>
                ))
              }
            </Select>
          )}
        </Item>
        <Item label='分类名称'>
          {getFieldDecorator('categoryName', {
            initialValue: '', // 初始值没有,initialValue也可以不指定
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

export default Form.create()(AddForm)