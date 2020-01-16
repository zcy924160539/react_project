/*
进行local数据存储管理的工具模块
*/
// 引入store.js(封装好localStorage,并且做了浏览器兼容性处理的库)
import store from 'store'

// 设置localStorage的key值常量
const USER_KEY = 'user_key'
export default {
  // 1.保存user
  saveUser(user) {
    store.set(USER_KEY,user)
  },

  // 2.读取user
  getUser() {
    return store.get(USER_KEY) || {}
  },

  // 3.删除user
  removeUser() {
    store.remove(USER_KEY)
  }
}