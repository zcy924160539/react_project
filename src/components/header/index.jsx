import React, { Component } from 'react'
import './index.less'
import formateDate from '../../utils/dateUtils'
import { reqWeather } from '../../api/'
import { withRouter } from 'react-router-dom'
import { Modal, message } from 'antd'
import LinkButton from '../link-button/index'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'

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

  logout = () => {
    // 显示确认框
    Modal.confirm({
      content: '确定退出吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 退出登录
        this.props.logout()
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
    const { username } = this.props.user

    // 从store中取出title
    const title = this.props.headTitle
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

export default withRouter(connect(
  state => ({ headTitle: state.headTitle, user: state.user }),
  { logout }
)(Header))