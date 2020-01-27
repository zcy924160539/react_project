import { combineReducers } from 'redux'
import { } from './action-types'
import storageUtils from '../utils/storageUtils'
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG,RESET_USER } from './action-types'

// 管理头部标题的reducer函数
const initHeadTitle = '首页'
function headTitle(state = initHeadTitle, action) {
  switch (action.type) {
    case SET_HEAD_TITLE:
      return action.data
    default:
      return state
  }
}

// 管理当前用户的reducer函数
const initUser = storageUtils.getUser()
function user(state = initUser, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.user
    case SHOW_ERROR_MSG:
      const errorMsg = action.errorMsg
      // 不修改原来的状态,在原来的state的基础上复制一份，然后再添加errorMsg进新状态中
      return { ...state, errorMsg }
    case RESET_USER:
      return {}
    default:
      return state
  }
}

export default combineReducers({
  headTitle,
  user
})