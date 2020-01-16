import React, { Component } from 'react'
import memoryUtils from '../../utils/memoryUtils'
import { Redirect } from 'react-router-dom'

/*
后台管理的路由界面
*/
export default class Admin extends Component {
  render() {
    const { user } = memoryUtils
    // 如果内存中没有存储user ==> 当前没有登录
    if (!user || !user._id) {
      // 自动跳转到登录界面
      return <Redirect to='/login' />
    }
    return (
      <div>
        Hello {user.username}
      </div>
    )
  }
}
