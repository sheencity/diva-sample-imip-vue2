export class EchartService {
  echartsMap = new Map([
    ['echarts-basic-bar', this.getBasicBarOption],
    ['echarts-hor-bar', this.getHorizonBarOption],
    ['echarts-bar', this.getUniBarOption],
    ['echarts-pie', this.getPieOption],
    ['echarts-line', this.getLineOption],
    ['echarts-bar-line', this.getBarLineOption],
    ['echarts-multi-line', this.getMutiLineOption],
  ]);

  /**
   * 获取基本柱状图配置
   */
  getBasicBarOption() {
    return {
      grid: { bottom: 0, left: 0, right: 10, top: 10, containLabel: true },
      tooltip: {
        show: true,
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          color: '#fff',
          interval: 0,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: 'rgba(255, 255, 255, 0.1)',
            width: 1,
            dashOffset: 2,
          },
        },
        axisLabel: {
          color: '#fff',
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          type: 'bar',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#4DD0E1',
                },
                {
                  offset: 1,
                  color: 'rgba(38, 203, 250, 0.2)',
                },
              ],
              global: false,
            },
          },
          barMaxWidth: 16,
        },
      ],
    };
  }

  /**
   * 获取通用柱状图配置
   */
  getUniBarOption() {
    return {
      grid: { height: 140, bottom: 20, top: 20, right: 10 },
      tooltip: {
        trigger: 'axis',
      },
      textStyle: {
        color: '#fff',
        fontSize: 10,
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: 'rgba(255, 255, 255, 0.1)',
            width: 1,
            dashOffset: 2,
          },
        },
      },
      series: [
        {
          barMaxWidth: 14,
          type: 'bar',
          name: '平均值',
          label: {
            show: true,
            position: 'top',
            color: '#fff',
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#09D099',
                },
                {
                  offset: 1,
                  color: 'rgba(38, 203, 250, 0.2)',
                },
              ],
            },
          },
        },
      ],
    };
  }

  /**
   * 获取横向柱状图配置
   */
  getHorizonBarOption() {
    return {
      grid: { height: 140, bottom: 20, top: 10, right: 20 },
      tooltip: {
        trigger: 'axis',
      },
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
      xAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: 'rgba(255, 255, 255, 0.1)',
            width: 1,
            dashOffset: 2,
          },
        },
      },
      yAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          type: 'bar',
          barMaxWidth: 14,
          label: {
            show: true,
            position: 'right',
            color: '#fff',
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(38, 203, 250, 0.2)',
                },
                {
                  offset: 1,
                  color: '#09D099',
                },
              ],
            },
          },
        }
      ]
    }
  }

  /**
   * 获取多曲线面积图配置
   */
  getMutiLineOption() {
    return {
      grid: { height: 130, top: 15, right: 10 },
      textStyle: {
        color: '#fff',
        fontSize: 10,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      legend: {
        align: 'auto',
        padding: 0,
        bottom: 0,
        itemWidth: 10,
        textStyle: {
          color: '#fff',
        },
      },
      xAxis: {
        type: 'category',
        data: [],
        boundaryGap: false,
        axisLabel: {
          color: '#fff',
          fontSize: 10,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        splitNumber: 2,
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: 12,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#888',
          },
        },
      },
      series: [
        {
          type: 'line',
          data: [],
          showSymbol: false,
          smooth: true,
          lineStyle: {
            color: '#66CCFF'
          },
          itemStyle: {
            color: '#66CCFF'
          }
        },
        {
          type: 'line',
          data: [],
          showSymbol: false,
          smooth: true,
          lineStyle: {
            color: '#6699FF'
          },
          itemStyle: {
            color: '#6699FF'
          }
        },
        {
          type: 'line',
          data: [],
          showSymbol: false,
          smooth: true,
          lineStyle: {
            color: '#6666FF'
          },
          itemStyle: {
            color: '#6666FF'
          }
        },
        {
          type: 'line',
          data: [],
          showSymbol: false,
          smooth: true,
          lineStyle: {
            color: '#CCFFFF'
          },
          itemStyle: {
            color: '#CCFFFF'
          }
        }
      ],
    };
  }

  /**
   * 获取折柱混合图配置
   */
  getBarLineOption() {
    return {
      grid: { height: 120, top: 25 },
      textStyle: {
        color: '#fff',
        fontSize: 10,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      legend: {
        align: 'auto',
        padding: 0,
        bottom: 0,
        itemWidth: 10,
        textStyle: {
          color: '#fff',
        },
      },
      xAxis: [
        {
          type: 'category',
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '%',
          min: 0,
          max: 75,
          interval: 25,
          axisLabel: {
            formatter: '{value}',
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
        {
          type: 'value',
          name: '℃',
          min: 15,
          interval: 5,
          max: 30,
          axisLabel: {
            formatter: '{value}',
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          barMaxWidth: 14,
          name: '平均值',
          type: 'bar',
          label: {
            show: false,
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#09D099',
                },
                {
                  offset: 1,
                  color: 'rgba(38, 203, 250, 0.2)',
                },
              ],
            },
          },
        },
        {
          name: '最低值',
          type: 'line',
          yAxisIndex: 1,
          lineStyle: {
            color: '#FF8422',
          },
          itemStyle: {
            color: '#FF8422',
          },
        },
        {
          name: '平均值',
          type: 'line',
          yAxisIndex: 1,
          lineStyle: {
            color: '#FFF822',
          },
          itemStyle: {
            color: '#FFF822',
          },
        },
        {
          name: '最高值',
          type: 'line',
          yAxisIndex: 1,
          lineStyle: {
            color: '#FF4522',
          },
          itemStyle: {
            color: '#FF4522',
          },
        },
      ],
    };
  }

  /**
   * 获取饼图配置
   */
   getPieOption() {
    return {
      legend: {
        show: false,
        bottom: 0,
        padding: 0,
        itemGap: 10,
        itemWidth: 14,
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {d}%',
      },
      series: [
        {
          type: 'pie',
          center: ['50%', '50%'],
          color: ['#B2EBF2', '#4DD0E1', '#6699FF', '#115DF3', '#7ea8f9', '#ffd078', '#9a80fa'],
          itemStyle: {
            opacity: 0.9,
          },
          label: {
            color: '#fff',
          },
        },
      ],
    };
  }

  /**
   * 获取曲线/折线图配置
   */
  getLineOption() {
    return {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: 10,
        left: 0,
        right: 15,
        bottom: 0,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          color: '#fff',
          fontSize: 10,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        splitNumber: 2,
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: 12,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#888',
          },
        },
      },
      series: [
        {
          type: 'line',
          name: '数值',
          smooth: true,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#00F7FF',
            borderWidth: 0,
            opacity: 0.8,
          },
          lineStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#09D099',
                },
                {
                  offset: 1,
                  color: 'rgb(38, 203, 250)',
                },
              ],
            },
            opacity: 0.6,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#09D099',
                },
                {
                  offset: 1,
                  color: 'rgba(38, 203, 250, 0.2)',
                },
              ],
              global: false,
            },
            opacity: 0.3,
          }
        }
      ],
    };
  }

  /**
   * 剩余车位分析图表配置
   * @param dataSource 
   */
  getParkingPanelPieChart(dataSource) {
    return {
      legend: {
        show: false,
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '75%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          legendHoverLink: false,
          color: ['#E3F2FD', '#90CAF9', '#42A5F5', '#1E88E5', '#1565C0', '#0D47A1'],
          itemStyle: {
            opacity: 0.9,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              formatter: [`{a|{c}}`, `{b|{b}}`].join("\n"),
              rich: {
                a: {
                  fontSize: 12,
                  color: '#fff',
                  verticalAlign: 'top',
                  padding: 4,
                },
                b: {
                  fontSize: 12,
                  color: '#fff',
                  verticalAlign: 'bottom',
                },
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: dataSource,
        },
      ],
    };
  }
}
