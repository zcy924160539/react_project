import React, { Component } from 'react'
import { Card, Button, Input, Select, Icon, Table, message } from 'antd'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const { Option } = Select

export default class ProductHome extends Component {
  state = {
    total: 0, // 商品总数量
    products: [],// 商品数组
    loading: false, // 是否正在加载中
    searchName: '', // 搜索关键字
    searchType: 'productName' // 根据哪个字段搜索
  }

  // 初始化table的列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        width: 150,
        dataIndex: 'price',
        render: price => '￥' + price // 当前指定了对应属性，传入的是对应属性值
      },
      {
        title: '状态',
        // dataIndex: 'status',
        width: 100,
        render: product => {
          const { status, _id } = product
          const newStatus = status === 1 ? 2 : 1
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(_id, newStatus)}
              >{status === 1 ? '下架' : '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 80,
        render: product => (
          <span>
            <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
          </span>
        )
      }
    ];
  }

  getProducts = async pageNum => {
    // 保存pageNum到组件对象中
    this.pageNum = pageNum
    this.setState({ loading: true })
    const { searchName, searchType } = this.state
    let result // 响应结果统一处理
    if (searchName) { // 搜索分页
      result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
    } else { // 一般分页
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({ loading: false })
    if (result.status === 0) {
      // 取出需要的响应数据
      const { total, list } = result.data
      // 更新状态
      this.setState({
        total,
        products: list
      })
    }
  }

  updateStatus = async (_id, status) => {
    const result = await reqUpdateStatus(_id, status)
    if (result.status === 0) {
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    }
  }


  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getProducts(1) // 组件加载后先获取第一页数据,点击分页的情况在去获取其他页数据
  }
  render() {
    const { products, total, loading, searchName, searchType } = this.state
    const title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 150 }}
          onChange={value => this.setState({ searchType: value })}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{ width: 150, margin: '0 15px' }}
          value={searchName}
          onChange={event => this.setState({ searchName: event.target.value })}
        />
        <Button type='primary' onClick={searchName ? () => this.getProducts(1) : null}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type='plus' />
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={products}
          columns={this.columns}
          rowKey='_id'
          bordered
          loading={loading}
          pagination={{ // 分页器
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total,
            onChange: this.getProducts // 分页时发请求,产生是对应的页码
          }}
        />
      </Card>
    )
  }
}
