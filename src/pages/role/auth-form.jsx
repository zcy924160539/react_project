import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Input, Form, Tree } from 'antd'
import menuList from '../../config/menuConfig'

const { Item } = Form
const { TreeNode } = Tree

export default class AuthForm extends PureComponent {

  static propTypes = {
    role: PropTypes.object
  }

  constructor(props) {
    super(props)
    const { menus } = props.role
    this.state = {
      checkedKeys: menus
    }
  }

  getTreeNode = menuList => menuList.reduce((pre, item) => {
    pre.push(
      <TreeNode title={item.title} key={item.key} >
        {
          // 递归产生子标签
          item.children ? this.getTreeNode(item.children) : null
        }
      </TreeNode>
    )
    return pre
  }, [])

  // 选中某个node时的回调
  onCheck = checkedKeys => {
    this.setState({ checkedKeys })
  }

  UNSAFE_componentWillMount() {
    this.treeNode = this.getTreeNode(menuList)
  }

  // 组件接收到新属性时才会调用
  UNSAFE_componentWillReceiveProps(nextProps) {
    const checkedKeys = nextProps.role.menus
    this.setState({ checkedKeys })
    /*
      解决两个bug:
      bug1:所有权限都一样
      bug2:勾选然后取消,再次打开还是勾选
    */
  }

  // 为父组件提供获取最新menus的方法
  getMenus = () => this.state.checkedKeys

  render() {
    const { role } = this.props
    const { checkedKeys } = this.state
    return (
      <div>
        <Item label='角色名称' labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
          <Input value={role.name} disabled />
        </Item>
        <Tree
          checkable
          defaultExpandAll={true} // 默认展开所有树节点
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">{this.treeNode}</TreeNode>
        </Tree>
      </div>
    )
  }
}
