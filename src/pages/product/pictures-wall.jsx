import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd'
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL, UPLOAD_IMG_TOTAL } from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// 用于上传图片的组件
export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  constructor(props) {
    super(props)
    let fileList = []
    // 如果传入了imgs属性
    const { imgs } = this.props
    if (imgs && imgs.length > 0) { // 为了在修改页面默认显示图片的操作
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img
      }))
    }
    this.state = {
      previewVisible: false, // 表识是否显示大图预览Modal
      previewImage: '', // 大图的url
      fileList // 所有已上传图片的数组
    }
  }

  // 隐藏Modal
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    // 显示指定file对应的大图
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    })
  }

  // 获取所有已经上传的图片的文件名的数组
  getImgs = () => {
    const { fileList } = this.state
    return fileList.reduce((pre, file) => {
      pre.push(file.name)
      return pre
    }, [])
  }

  // fileList:所有已上传图片的数组
  handleChange = async ({ file, fileList }) => { // 上传文件改变时的状态
    // console.log(file.status, file)
    if (file.status === 'done') { // 图片上传成功,修正当前上传的file的信息(name,url)
      const result = file.response
      if (result.status === 0) {
        message.success('图片上传成功')
        const { name, url } = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('图片上传失败')
      }
    } else if (file.status === 'removed') { // 删除图片
      // 发送删除图片的ajax请求
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功！')
      } else {
        message.error('删除图片失败！')
      }
    }
    // 在操作图片过程中(上传/删除),更新filelist的状态
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    )
    return (
      <div>
        <Upload
          action="/manage/img/upload" // 上传图片接口的地址
          accept='image/*' //指定只接受图片类型的格式
          listType="picture-card" // 图片为卡片样式
          fileList={fileList}
          name='image' // 请求参数名
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {/* 图片上传到达一定数量,上传图片的按钮消失 */}
          {fileList.length >= UPLOAD_IMG_TOTAL ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}