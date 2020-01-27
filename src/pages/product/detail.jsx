import React, { Component } from 'react'
import { Card, Icon, List } from 'antd'
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'

const { Item } = List

export default class ProductDetail extends Component {
  state = {
    cName1: '', // 一级分类名称
    cName2: '' // 二级分类名称
  }

  getCategoryName = async () => {
    const { pCategoryId, categoryId } = this.props.location.state.product
    if (pCategoryId === '0') { // 一级分类下的商品
      const result = await reqCategory(categoryId)
      if (result.status === 0) {
        const cName1 = result.data.name
        this.setState({ cName1 })
      }
    } else { // 二级分类下的商品
      // 一次性发送多个请求,只有都成功才正常处理  Promise.all([p1,p2,...])
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      if (results[0].status === 0 && results[1].status === 0) {
        const cName1 = results[0].data.name
        const cName2 = results[1].data.name
        this.setState({ cName1, cName2 })
      }
    }
  }

  componentDidMount() {
    this.getCategoryName()
  }

  render() {
    const title = (
      <span>
        <LinkButton
          style={{ marginRight: 20, fontSize: 20 }}
          onClick={() => this.props.history.goBack()}
        >
          <Icon type='arrow-left' />
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    const { name, desc, price, detail, imgs } = this.props.location.state.product
    const { cName1, cName2 } = this.state
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='product-detail-left'>商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='product-detail-left'>商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='product-detail-left'>商品价格:</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className='product-detail-left'>所属分类:</span>
            <span>{cName1}{cName2 ? '-->' + cName2 : ''}</span>
          </Item>
          <Item>
            <span className='product-detail-left'>商品图片:</span>
            <span>
              {
                imgs.map(img => (
                  <img
                    className='product-detail-img'
                    src={BASE_IMG_URL + img}
                    key={img}
                    alt='img'
                  />
                ))
              }
            </span>
          </Item>
          <Item>
            <span className='product-detail-left'>商品详情:</span>
            <span dangerouslySetInnerHTML={{ __html: detail }} />
          </Item>
        </List>
      </Card>
    )
  }
}