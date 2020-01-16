/*
包含n个接口请求函数的模块
每个函数返回值是promise对象(ajax('/login', { username, possword }, 'POST'))
*/
import ajax from './ajax'
const BASE = '' // 空串代表从当前地址(http://localhost:3000)去向服务器发请求

// 登录的请求函数
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

// 添加用户的请求函数
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')