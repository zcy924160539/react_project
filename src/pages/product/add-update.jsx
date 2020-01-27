import React, { PureComponent } from 'react'
import { Card, Form, Input, Cascader, Button, Icon, message } from 'antd'
import { reqCategorys } from '../../api'
import LinkButton from '../../components/link-button'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import { reqAddUpdateProduct } from '../../api'

const { Item } = Form
const { TextArea } = Input

class ProductAddUpdate extends PureComponent {

  state = {
    options: []
  }

  constructor(props) {
    super(props)
    // 创建用来保存ref标识的标签对象的容器,并保存到组件实例(this)中
    this.pwRef = React.createRef()
    this.editorRef = React.createRef()
  }

  // 获取一级或二级分类列表，并显示
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') { // 一级分类列表
        this.initOptions(categorys)
      } else { // async函数的返回值拿到的是二级分类列表的promise对象
        return categorys
      }
    }
  }

  initOptions = async (categorys) => {
    // 根据categorys生成optios的数组
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: c.parentId === '0' ? false : true
    }))

    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this
    const { pCategoryId } = product
    if (isUpdate && pCategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成一个二级列表的options数组
      const childOption = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 找到当前商品对应的一级option
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联到对应的一级option中
      targetOption.children = childOption
    }
    // 更新options状态
    this.setState({ options })
  }

  submit = () => {
    // 进行表单验证,验证通过才发请求
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // 1.收集数据,并封装成product对象
        const { name, desc, price, categoryIds } = values
        let categoryId, pCategoryId
        if (categoryIds.length === 1) { // 没有二级商品列表
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else { // 有二级列表
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.pwRef.current.getImgs()
        const detail = this.editorRef.current.getDetail()
        const product = {
          name,
          desc,
          price,
          imgs,
          detail,
          categoryId,
          pCategoryId
        }

        // 如果是更新,需要添加_id
        if (this.isUpdate) {
          product._id = this.product._id
        }
        // 2.调用接口函数去添加/更新
        const result = await reqAddUpdateProduct(product)
        // 3.根据结果提示
        if (result.status === 0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功！`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败！`)
        }
      }
    })
  }

  validatePrice = (rule, value, callback) => { // 价格的自定义校验函数
    if (!value) {
      callback('请输入价格')
    } else if (value * 1 > 0) {
      callback() // 验证通过
    } else {
      callback('价格必须大于0') // 验证没通过
    }
  }


  // 用于加载下一级列表的回调函数
  loadData = async selectedOptions => {
    // 得到的option对象,targetOption是当前选中项
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // 显示loading
    targetOption.loading = true
    // 根据选择的分类请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    // 得到响应数据,隐藏loading
    targetOption.loading = false
    if (subCategorys && subCategorys.length > 0) {
      // 利用当前分类列表生成一个二级列表的options数组
      const childOption = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前targetOption上
      targetOption.children = childOption
    } else { // 当前选中的分类没有二级分类
      targetOption.isLeaf = true // 当前分类是二级分类,所以当前分类是叶子,代表当前分类没有分支
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options]
    })
  }

  UNSAFE_componentWillMount() {
    // 取出点击时携带过来的state
    const product = this.props.location.state
    // 保存是否是更新的标识
    this.isUpdate = !!product // 强制转换布尔类型
    // 保存商品(如果没有,保存的是{})
    this.product = product || {}
  }

  componentDidMount() {
    this.getCategorys('0')
  }

  render() {
    const { isUpdate, product } = this
    const { pCategoryId, categoryId, imgs } = this.product
    // 用来接收级联分类id的数组
    const categoryIds = []
    if (isUpdate) {
      if (pCategoryId === '0') { // 商品是个一级分类的商品
        categoryIds.push(pCategoryId)
      } else { // 商品是个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    const formItemLayout = { // 表单的布局配置对象
      labelCol: { span: 2 }, // 左侧label的宽度
      wrapperCol: { span: 8 } // 右侧包裹input的宽度
    }
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{ fontSize: 20 }} />
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )

    const { getFieldDecorator } = this.props.form
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='商品名称'>
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [{ required: true, message: '请输入商品名称' }]
              })(
                <Input placeholder='请输入商品名称' />
              )
            }
          </Item>
          <Item label='商品描述'>
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [{ required: true, message: '请输入商品描述' }]
              })(
                <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRow: 6 }} />
              )
            }
          </Item>
          <Item label='商品价格'>
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  { required: true, validator: this.validatePrice },
                ]
              })(
                <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
              )
            }
          </Item>
          <Item label='商品分类'>
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [
                  { required: true, message: '请指定商品分类' },
                ],
              })(
                <Cascader
                  options={this.state.options} // 需要显示的列表数据
                  loadData={this.loadData} // 当选择某个列表项,加载下一级列表的监听回调
                  placeholder='请选择商品的分类'
                />
              )
            }
          </Item>
          <Item label='商品图片'>
            <PicturesWall ref={this.pwRef} imgs={imgs} />
          </Item>
          <Item label='商品详情' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }} >
            <RichTextEditor ref={this.editorRef} detail={product.detail} />
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)