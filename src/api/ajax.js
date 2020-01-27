/*
能发异步ajax请求的函数模块
封装axios库
函数的返回值是promise对象
1. 优化1: 怎样统一处理请求异常
    答:在外面包一个自己创建的promise对象,在请求出错时不去reject,而是提示异常信息
2. 优化2: 异步想得到的不是response,而是response.data,在请求成功后resolve时:resolve(response.data) 
*/
import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {
  return new Promise((resolve) => {// 外层包的自创promise对象
    let promise // 这个promise变量用来接收axios发请求返回的promise对象,然后统一处理请求异常
    // 1. 执行异步ajax请求
    if (type === 'GET') {
      promise = axios.get(url, {
        params: data
      })
    } else {
      promise = axios.post(url, data)
    }
    // 2. 如果成功了,调用resolve,传入response
    promise.then(response => { 
      resolve(response.data)
      // 3. 如果失败了,不调reject,而是提示异常信息(统一处理请求异常)
    }).catch(error => {
      message.error('请求出错了:' + error.message, 2)
    })
  })
}