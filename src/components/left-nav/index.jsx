import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './index.less'
import logo from '../../assets/img/logo.png'
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig'

const { SubMenu } = Menu;

class LeftNav extends Component {
  // 使用递归和数组的reduce方法,根据menuList的数据数组生成对应的标签数组
  getMenuNodes = menuList => {
    return menuList.reduce((per, item) => {
      if (!item.children) { // 没有子菜单
        per.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      } else { // 有子菜单
        const path = this.props.location.pathname
        // 查找一个与当前路径匹配的子item
        const cItem = item.children.find(cItem => cItem.key === path)
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
      return per
    }, [])
  }

  // 为第一次组件render()准备数据
  UNSAFE_componentWillMount() { // 只执行一次
    this.menuNodes = this.getMenuNodes(menuList)
  }
  render() {
    // 得到当前请求路径
    const path = this.props.location.pathname
    // console.log('render()', path)
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
export default withRouter(LeftNav)