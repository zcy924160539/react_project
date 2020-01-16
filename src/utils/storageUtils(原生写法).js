
/*
进行local数据存储管理的工具模块
*/
// 设置localStorage的key值常量
const USER_KEY = 'user_key'
export default {

  // 1.保存user
  saveUser(user) {
    localStorage.setItem(USER_KEY,JSON.stringify(user))
  },

  // 2.读取user
  readUser() {
    return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  },

  // 3.删除user
  removeUser() {
    localStorage.removeItem(USER_KEY)
  }
}