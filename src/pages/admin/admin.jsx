import React, { Component } from 'react'
// import memoryUtils from '../../utils/memoryUtils'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Layout } from 'antd';
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'

// 一系列路由组件
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import { connect } from 'react-redux'



const { Footer, Sider, Content } = Layout;

/*
后台管理的路由界面
*/
class Admin extends Component {
  render() {
    // const { user } = memoryUtils
    const { user } = this.props
    // 如果内存中没有存储user ==> 当前没有登录
    if (!user || !user._id) {
      // 自动跳转到登录界面
      return <Redirect to='/login' />
    }
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header />
          <Content style={{ margin: 20, backgroundColor: '#fff' }}>
            <Switch>
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/role' component={Role} />
              <Route path='/user' component={User} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/pie' component={Pie} />
              <Redirect to='/home' />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#ccc' }}>后台管理系统</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default connect(
  state => ({ user: state.user })
)(Admin)
