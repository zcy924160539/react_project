/*
包含n个接口请求函数的模块
每个函数返回值是promise对象(ajax('/login', { username, possword }, 'POST'))
*/
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
const BASE = '' // 空串代表从当前地址(http://localhost:3000)去向服务器发请求

// 登录的请求函数
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

// 添加用户的请求函数
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

// 获取分类列表的接口
export const reqCategory = (parentId) => ajax(BASE + '/manage/category/list', { parentId })

// 添加分类的接口
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', { parentId, categoryName }, 'POST')

// 更新分类的接口
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

// jsonp请求的接口函数
export const reqWeather = (city) => {
  return new Promise((resolve) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === 'success') { // 成功
        // 取出目标数据
        const { dayPictureUrl, weather } = data.results[0].weather_data[0]
        resolve({ dayPictureUrl, weather })
      } else { // 如果失败了, 不调用reject,而是统一处理错误
        message.error('获取天气信息失败!')
      }
    })
  })
}