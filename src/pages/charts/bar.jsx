import React, { Component } from 'react'
import { Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'

/*
柱状图路由
*/
export default class Bar extends Component {

  state = {
    sales: [50, 10, 15, 30, 70, 25], // 销量数组
    stores: [100, 20, 30, 60, 90, 40] // 库存数组
  }

  update = () => {
    this.setState(state => ({
      sales: state.sales.map(sale => ++sale),
      stores: state.stores.reduce((pre, store) => {
        pre.push(--store)
        return pre
      }, [])
    }))
  }

  // 返回柱状图的配置对象
  getOption = () => {
    const { sales, stores } = this.state
    return {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量', '库存']
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: sales
        },
        {
          name: '库存',
          type: 'bar',
          data: stores
        }
      ]
    }
  }
  render() {
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>更新</Button>
        </Card>
        <Card title='柱状图一'>
          <ReactEcharts
            option={this.getOption()}
          />
        </Card>
      </div>

    )
  }
}
