/*
入口文件
*/
import React from 'react'
import { render } from 'react-dom'
import App from './App'
// 当前localstorage中存储的user
// import storageUtils from './utils/storageUtils'
// import memoryUtils from './utils/memoryUtils'
import { Provider } from 'react-redux'
import store from './redux/store'

// 一开始就把localstorage中的user读取到内存中(维持登录功能)
// memoryUtils.user = storageUtils.getUser()

render(
  <Provider store={store}>
    <App />
  </Provider>
  ,document.getElementById('root'))