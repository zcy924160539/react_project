import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import LinkButton from '../../components/link-button'
import formateDate from '../../utils/dateUtils'
import { PAGE_SIZE } from '../../utils/constants'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'

const { confirm } = Modal
export default class User extends Component {

  state = {
    loading: false,
    users: [], // 所有的用户列表
    roles: [],
    isShow: false // 是否显示确认框
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: role_id => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: user => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }

  // 获取用户列表的函数
  getUsers = async () => {
    this.setState({ loading: true })
    const result = await reqUsers()
    this.setState({ loading: false })
    if (result.status === 0) {
      const { users, roles } = result.data
      this.initRoleName(roles)
      this.setState({ users, roles })
    } else {
      message.error('请求数据失败')
    }
  }

  // 通过role的数组生成所有角色名的对象(属性名用的是id值)
  initRoleName = (roles) => {
    this.roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
  }

  // 添加用户
  addOrUpdateUser = async () => {
    // 收集输入数据
    const user = this.form.getFieldsValue()
    // 重置输入框
    this.form.resetFields()
    if (this.user) { // 如果是更新,需要给user指定_id属性
      user._id = this.user._id
    }
    // 发请求
    const result = await reqAddOrUpdateUser(user)
    if (result.status === 0) {
      message.success(`${this.user ? '修改' : '添加'}用户成功`, 1)
      this.getUsers()
      this.setState({ isShow: false })
    }
  }

  // 显示更新用户的对话框
  showUpdate = (user) => {
    this.user = user // 保存当前user到this中
    this.setState({ isShow: true })
  }

  // 显示添加用户的对话框
  showAdd = ()=>{
    this.user = null // 去除前面保存的user
    this.setState({isShow:true})

  }

  // 删除指定用户
  deleteUser = user => {
    confirm({
      title: `确定删除${user.username}吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('已删除', 1)
          this.getUsers()
        }
      },
      onCancel: () => {
        message.info('已取消')
      }
    });
  }

  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  render() {
    const { users, roles, loading, isShow } = this.state
    const user = this.user || {}
    const title = (
      <Button type='primary' onClick={this.showAdd}>
        创建用户
      </Button>
    )
    return (
      <Card title={title}>
        <Table
          dataSource={users}
          columns={this.columns}
          rowKey='_id'
          bordered
          loading={loading}
          pagination={{ defaultPageSize: PAGE_SIZE }}
        />
        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          okText='确认'
          cancelText='取消'
          onCancel={() => { 
            this.form.resetFields()
            this.setState({ isShow: false }) 
          }}
        >
          <UserForm setForm={form => this.form = form} roles={roles} user={user} />
        </Modal>
      </Card>
    )
  }
}