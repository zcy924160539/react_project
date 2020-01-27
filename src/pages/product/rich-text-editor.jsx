import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


export default class RichTextEditor extends Component {

  static propTypes = {
    detail: PropTypes.string
  }

  constructor(props) {
    super(props)
    const html = props.detail
    if (html) { // html有值
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        this.state = {
          editorState
        }
      }
    } else { // html没有值 
      this.state = {
        editorState: EditorState.createEmpty() // 创建一个空的编辑对象
      }
    }
  }

  onEditorStateChange = (editorState) => { // 输入框获取到焦点和输入内容改变时触发
    this.setState({
      editorState
    })
  }

  getDetail = () => {
    // 返回输入数据对应的html格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  uploadImageCallBack = file => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/manage/img/upload')
        xhr.setRequestHeader('Authorization', 'Client-ID XXXXX')
        const data = new FormData()
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          const url = response.data.url // 得到图片url
          resolve({data: {link: url}}) // 这里传对象
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    )
  }

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        editorStyle={{ border: '1px solid #000', minHeight: '200px', paddingLeft: 10 }}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: {
            uploadCallback: this.uploadImageCallBack,
            alt: { present: true, mandatory: true },
            previewImage: true, // 图片预览
            inputAccept: 'image/*', // 只接受图片类型的文件
          },
        }}
      />
    );
  }
}