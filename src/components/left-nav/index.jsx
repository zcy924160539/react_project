import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './index.less'
import logo from '../../assets/img/logo.png'
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig'
import { connect } from 'react-redux'
import { setHeadTitle } from '../../redux/actions'

const { SubMenu } = Menu

class LeftNav extends Component {
  // 判断当前登录用户对item是否有权限
  hasAuth = item => {
    const { key, isPublic } = item
    const {user} = this.props
    const menus = user.role.menus
    const username = user.username
    // 1. 当前用户是admin,全权限
    // 2. 当前用户有此item的权限:key有没有menus
    // 3. 如果当前item是公开的
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) {
      // 4.如果当前用户有此item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false
  }

  // 使用递归和数组的reduce方法,根据menuList的数据数组生成对应的标签数组
  getMenuNodes = menuList => {
    const path = this.props.location.pathname
    return menuList.reduce((per, item) => {
      // 如果当前用户有item对应的权限才去添加对应的item
      if (this.hasAuth(item)) {
        if (!item.children) { // 没有子菜单
          // 判断item是否是当前对应的item
          if (item.key === path || path.indexOf(item.key) === 0) {
            // 更新redux中的headTitle状态
            this.props.setHeadTitle(item.title)
          }
          per.push((
            <Menu.Item key={item.key}>
              <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else { // 有子菜单
          // 查找一个与当前路径匹配的子item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0) // str.indexOf(str2) === 0 str1以str2开头
          if (cItem) {// cItem如果存在,说明当前item的子列表需要打开
            this.openKey = item.key
          }
          per.push((
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      }
      return per
    }, [])
  }

  // 为第一次组件render()准备数据
  UNSAFE_componentWillMount() { // 只执行一次
    this.menuNodes = this.getMenuNodes(menuList)
  }
  render() {
    // 得到当前请求路径
    let path = this.props.location.pathname
    if (path.indexOf('/product') === 0) { // 当前请求的是商品或商品的子路由  str.indexOf(str2) === 0 str1以str2开头
      path = '/product'
    }
    
    return (
      <div>
        <div className='left-nav' >
          <Link to='/' className='left-nav-header'>
            <img src={logo} alt='logo' />
            <h1>后台管理</h1>
          </Link>
        </div>
        <Menu
          selectedKeys={[path]} // selectedKeys:当前选中的菜单项 key 数组
          defaultOpenKeys={[this.openKey]}
          mode="inline"
          theme="dark"
        >
          {this.menuNodes}
        </Menu>
      </div>
    )
  }
}

// withRouter(非路由组件), 使得非路由组件也可以拥有路由组件的history,location,match三个属性 
export default withRouter(connect(
  state => ({ user: state.user }),
  { setHeadTitle }
)(LeftNav))