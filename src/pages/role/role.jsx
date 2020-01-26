import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import formateDate from '../../utils/dateUtils'

/*
用户路由
*/
export default class User extends Component {

  constructor(props) {
    super(props)
    this.auth = React.createRef();
  }

  state = {
    roles: [], // 所有角色的列表
    role: {}, // 选中的角色
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false // 是否显示设置角色权限界面
  }

  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateDate // 格式时间的函数
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate // 格式时间的函数
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
  }

  onRow = role => { // 选中某一个角色时触发
    return {
      onClick: () => {
        this.setState({ role })
      }
    }
  }

  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({ roles })
    }
  }

  // 添加角色
  addRole = () => {
    // 取消对话框的显示 
    this.setState({ isShowAdd: false })
    // 验证表单
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 获取表单输入数据
        const { roleName } = values
        // 重置对话框
        this.form.resetFields()
        // 发请求，添加角色
        const result = await reqAddRole(roleName)
        if (result.status === 0) {
          message.success('添加角色成功')
          const role = result.data
          // 更新角色列表，显示
          this.setState(state => ({
            roles: [...state.roles, role]
          }))
        } else {
          message.error('添加角色失败')
        }
      }
    })
  }

  // 更新角色
  updateRole = async () => {
    // 隐藏对话框
    this.setState({ isShowAuth: false })
    const role = this.state.role
    // 得到最新的menus
    const menus = this.auth.current.getMenus()
    role.menus = menus
    role.auth_name = memoryUtils.user.username
    // 发请求更新角色(给角色设置权限)
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      message.success('设置角色权限成功')
      // 更新roles数组
      this.getRoles()
    } else {
      message.error('设置角色权限失败')
    }
  }

  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getRoles()
  }

  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state
    const title = (
      <span>
        <Button
          type='primary'
          style={{ marginRight: 10 }}
          onClick={() => this.setState({ isShowAdd: true })}
        >
          创建角色
        </Button>
        <Button
          type='primary'
          disabled={!role._id} // 选中角色才能点击按钮
          onClick={() => this.setState({ isShowAuth: true })}
        >
          设置角色权限
        </Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          rowSelection={{ type: 'radio', selectedRowKeys: [role._id] }} // 表格行是否可选择，selectedRowKeys设置选中与否
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
          onRow={this.onRow}
        />
        <Modal
          title="添加分类"
          visible={isShowAdd} // visible接收一个布尔值，显示隐藏对话框
          onOk={this.addRole}
          okText='确认'
          cancelText='取消'
          onCancel={() => {
            this.setState({ isShowAdd: false })
            this.form.resetFields()
          }} // 关闭对话框
        >
          <AddForm
            setForm={form => this.form = form}
          />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth} // visible接收一个布尔值，显示隐藏对话框
          onOk={this.updateRole}
          onCancel={() => this.setState({ isShowAuth: false })} // 关闭对话框
          okText='确认'
          cancelText='取消'
        >
          <AuthForm role={role} ref={this.auth} />
        </Modal>
      </Card>
    )
  }
}