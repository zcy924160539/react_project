import React, { Component } from 'react'
import './index.less'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import formateDate from '../../utils/dateUtils'
import { reqWeather } from '../../api/'
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { Modal, message } from 'antd'
import LinkButton from '../link-button/index'

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),// 当前时间(字符串格式)
    dayPictureUrl: '', // 天气图片url
    weather: '' // 天气文本 
  }

  getTime = () => {
    this.timeId = setInterval(() => {
      // 每隔一秒获取一次当前时间,并更新状态
      const currentTime = formateDate(Date.now())
      this.setState({ currentTime })
    }, 1000)
  }

  getWeather = async () => {
    // 调用接口函数reqWeather发请求获取天气数据
    const { dayPictureUrl, weather } = await reqWeather('茂名')
    // 更新状态
    this.setState({ dayPictureUrl, weather })
  }

  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname
    let title
    // 遍历menuList
    menuList.forEach(item => {// 数组外层遍历
      if (item.key === path) { // 当前item对象的key与path一样,item的title就是需要显示的title
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0) // 数组内层遍历
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  logout = () => {
    // 显示确认框
    Modal.confirm({
      content: '确定退出吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 删除保存的user数据
        storageUtils.removeUser()
        // 删除内存中的user数据
        memoryUtils.user = {}
        // 跳转到login
        this.props.history.replace('/login')
      },
      onCancel: () => {
        message.info('已取消', 1)
      }
    });
  }

  // 在第一次render()之后执行
  // 一般在此执行异步操作
  componentDidMount() {
    this.getTime()
    this.getWeather()
  }

  componentWillUnmount() {// 组件将销毁时清除定时器
    clearInterval(this.timeId)
  }

  render() {
    const { currentTime, dayPictureUrl, weather } = this.state
    const { username } = memoryUtils.user
    // 得到当前需要显示的title
    const title = this.getTitle()
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎,{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)