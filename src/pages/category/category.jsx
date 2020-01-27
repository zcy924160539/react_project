import React, { Component } from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

/*
商品分类路由
*/
export default class Category extends Component {
  state = {
    categorys: [], // 一级分类列表
    subCategorys: [],// 二级分类列表
    loading: false, // 是否正在获取数据中
    parentId: '0', // 当前需要显示的分类列表的父分类Id
    parentName: '', // 当前需要显示的分类列列表的父分类名称
    showStatus: 0 // 标识添加/更新的确认框是否显示, 0 都不显示,1 显示添加分类,2 显示更新分类
  }

  // 初始化Table所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300, // 指定宽度
        // render返回需要显示的界面
        render: category => ( // category是分类列表的当前点击项
          <span>
            {/* 利用showUpdate方法,把当前分类对象category存储到组件对象(this)中 */}
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {category.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
          </span>
        )
      },
    ];
  }

  // 获取一级/二级分类列表
  getCategorys = async (parentId = this.state.parentId) => {
    // 请求数据前显示loading
    this.setState({ loading: true })
    // 获取数据
    const result = await reqCategorys(parentId)
    // 得到响应数据时隐藏loading
    this.setState({ loading: false })
    if (result.status === 0) { // 请求成功
      const categorys = result.data
      if (parentId === '0') { // 响应数据为一级分类列表
        // 更新一级分类状态
        this.setState({ categorys })
      } else {
        // 更新二级分类状态
        this.setState( // 响应数据为二级分类列表
          { subCategorys: categorys }
        )
      }

    } else {
      message.error('获取分类列表失败!', 1)
    }
  }

  // 显示一级指定对象的二级分类列表
  showSubCategorys = (category) => {
    // 更新状态
    this.setState({// this.setState()更新状态是异步的,不能立即获取最新的状态
      parentId: category._id, // 父分类对象的id，就是子分类的parentId
      parentName: category.name
    }, () => { // 在状态更新且重新render后执行
      // const { parentId } = this.state
      // console.log(parentId)
      // 发请求获取二级分类列表
      this.getCategorys()
    })
  }

  // 显示一级分类列表
  showCategorys = () => {
    // 更新为显示一级列表状态
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  //显示添加的确认框
  showAdd = () => {
    this.setState({ showStatus: 1 })
  }

  // 添加分类
  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) { // 先进行表单验证
        this.setState({ showStatus: 0 })
        // 收集数据
        const { parentId, categoryName } = values
        // 清除输入数据
        this.form.resetFields()
        // 2. 发送请求获取数据
        const result = await reqAddCategory(parentId, categoryName)
        if (result.status === 0) {
          // 添加的分类就是当前列表下的分类
          if (parentId === this.state.parentId) {
            // 3. 重新显示列表
            this.getCategorys()
          } else if (parentId === '0') { // 在二级分类列表下给一级分类添加商品,重新获取一级分类列表,但不需要显示一级分类列表
            this.getCategorys(parentId)
          }
        }
      }
    })
  }

  // 显示更新确认框
  showUpdate = (category) => {
    this.setState({ showStatus: 2 })
    this.category = category
  }

  // 更新分类
  updateCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) { // 先进行表单验证
        // 1.隐藏对话框
        this.setState({ showStatus: 0 })
        // 准备数据
        const categoryId = this.category._id
        const { categoryName } = values
        // 清除输入数据
        this.form.resetFields()
        // 2.发请求更新分类
        const result = await reqUpdateCategory({ categoryId, categoryName })
        if (result.status === 0) { // 请求成功
          // 3.重新显示列表
          this.getCategorys()
        }
      }
    })
  }

  // 响应点击取消:隐藏对话框
  handleCancel = () => {
    // 清除输入数据
    this.form.resetFields()
    // 隐藏对话框
    this.setState({ showStatus: 0 })
  }

  // 为第一次render()准备数据
  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  // 发请求获取数据
  componentDidMount() {
    // 获取一级分类列表显示
    this.getCategorys()
  }

  render() {
    // 读取状态数据
    const {
      categorys,
      subCategorys,
      parentId,
      parentName,
      loading,
      showStatus
    } = this.state
    const category = this.category || {}
    // card左侧标题
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon
          type="arrow-right"
          style={{ fontSize: 16, margin: '0 10px', color: '#4E1FCF' }}
        />
        <span>{parentName}</span>
      </span>
    )
    // card的右侧按钮
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus' />
        <span>添加</span>
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          // parentId为0,显示一级分类列表,否则显示二级分类列表
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}
          bordered rowKey='_id'
          loading={loading}
          pagination={{
            defaultPageSize: 5,
            showQuickJumper: true
          }}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1} // visible接收一个布尔值，显示隐藏对话框
          onOk={this.addCategory}
          onCancel={this.handleCancel}
          okText='确认'
          cancelText='取消'
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={form => this.form = form}
          />
        </Modal>
        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
          okText='确认'
          cancelText='取消'
        >
          <UpdateForm
            categoryName={category.name}
            setForm={form => this.form = form}
          />
        </Modal>
      </Card>
    )
  }
}