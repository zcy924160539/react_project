// 创建action对象的函数的模块

import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER } from './action-types'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'

// 设置头部标题的同步action
export const setHeadTitle = headTitle => ({ type: SET_HEAD_TITLE, data: headTitle })

// 接收user的同步action
export const receiveUser = user => ({ type: RECEIVE_USER, user })

// 登录失败的信息action
export const showErrorMsg = errorMsg => ({ type: SHOW_ERROR_MSG, errorMsg })

// 退出登录的action
export const logout = () => {
  // 清除localstore中的action
  storageUtils.removeUser()
  return { type: RESET_USER }
}

// 登录的异步action
export const login = (username, password) => async dispatch => {
  // 1. 执行异步ajax请求
  const result = await reqLogin(username, password)
  if (result.status === 0) {// 2.1. 如果请求成功,分发成功的同步action
    const user = result.data
    // 顺便把user保存在localstorage中
    storageUtils.saveUser(user)
    // 把user存到状态中
    dispatch(receiveUser(user))
  } else {// 2.2. 如果请求失败,分发失败的同步action
    const msg = result.msg
    dispatch(showErrorMsg(msg))
  }
}