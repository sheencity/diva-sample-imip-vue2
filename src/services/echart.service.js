export class EchartService {
  echartsMap = new Map([
    ['echarts-basic-bar', this.getBasicBarOption()],
    ['echarts-bar', this.getUniBarOption()],
  ]);

  /**
   * 获取基本柱状图配置
   * @param dataSource 数据源
   * @param xAixsRotate x 轴的文本标签是否旋转，当文本内容显示不下的时候启用此项
   */
  getBasicBarOption() {
    // const xAxisLabel = xAixsRotate
    //   ? {
    //       color: '#fff',
    //       interval: 0,
    //       rotate: 10,
    //       fontSize: 10,
    //       margin: 14,
    //       align: 'center',
    //     }
    //   : {
    //       color: '#fff',
    //       interval: 0,
    //     };
    return {
      grid: { bottom: 0, left: 0, right: 10, top: 10, containLabel: true },
      tooltip: {
        show: true,
      },
      // dataset: {
      //   source: dataSource,
      // },
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
   * 通用柱状图配置
   * @param dataSource 数据源
   * @param showValue 是否在柱子顶部显示值
   * @param showXaxis 是否显示 x 轴的文本
   */
  getUniBarOption() {
    return {
      grid: { height: 140, bottom: 20, top: 20, right: 10 },
      // dataset: {
      //   source: dataSource,
      // },
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
        axisLabel: {
          // show: showXaxis,
        }
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
            // show: showValue,
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
   * 横向柱状图
   * @param {{value: number, name: string}[]} dataSource 
   */
  getHorizonBarOption(dataSource) {
    const yAxisLabel = dataSource.map((data) => data.name);
    const data = dataSource.map((data) => data.value);
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
        data: yAxisLabel,
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          data: data,
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
   * 曲线面积图配置
   * @param data 数据源
   * @param smooth 是否为平滑曲线
   * @param area 是否显示曲线面积
   */
  getAreaOption(data, smooth = true, area = true) {
    return {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: 10,
        left: 30,
        right: 20,
        bottom: 20,
      },
      dataset: {
        source: data,
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
          name: '平均值',
          smooth: smooth,
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
          areaStyle: area
            ? {
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
            : null,
        },
      ],
    };
  }

  /**
   * 多曲线面积图
   * @param {[]} data 
   */
  getMutiLineAreaOption(data) {
    const series = [];
    const xAxisLabel = data[0].data.map((item) => item.x_axis);
    data.forEach((item) => {
      const _series = {};
      _series.data = item.data.map((i) => i.value);
      _series.name = item.type;
      _series.type = 'line';
      _series.showSymbol = false;
      _series.smooth = true;
      _series.lineStyle = { color: item.color };
      _series.itemStyle = { color: item.color };
      series.push(_series);
    });
    return {
      grid: { height: 130, top: 15, right: 20 },
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
        data: xAxisLabel,
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
      series: series,
    };
  }

  /**
   * 折柱混合图
   * @param dataSource 数据源
   */
  getBarLineOption(dataSource) {
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
          data: dataSource[0],
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
          name: '平均湿度',
          type: 'bar',
          data: dataSource[1],
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
          name: '最低温度',
          type: 'line',
          yAxisIndex: 1,
          data: dataSource[2],
          lineStyle: {
            color: '#FF8422',
          },
          itemStyle: {
            color: '#FF8422',
          },
        },
        {
          name: '平均温度',
          type: 'line',
          yAxisIndex: 1,
          data: dataSource[3],
          lineStyle: {
            color: '#FFF822',
          },
          itemStyle: {
            color: '#FFF822',
          },
        },
        {
          name: '最高温度',
          type: 'line',
          yAxisIndex: 1,
          data: dataSource[4],
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
   * 获取环形饼图配置
   * @param dataSource 数据源
   * @param center 环形图是否居中布局
   * @param showLegend 是否显示分类
   * @param isPercent 显示百分比或数值
   */
  getRangePieOption(dataSource, center = true, showLegend = true, isPercent = true) {
    const legend = center
      ? {
          show: showLegend,
          bottom: 0,
          padding: 0,
          itemGap: 10,
          itemWidth: 14,
          textStyle: {
            color: '#fff',
          },
        }
      : {
          type: 'scroll',
          show: showLegend,
          orient: 'vertical',
          top: 20,
          right: 10,
          itemGap: 10,
          itemWidth: 14,
          textStyle: {
            color: '#fff',
          },
        };
    const labelFormatter = isPercent
      ? [`{a|{d} %}`, `{b|{b}}`].join("\n")
      : [`{a|{c}}`, `{b|{b}}`].join("\n");
    return {
      legend: legend,
      series: [
        {
          type: 'pie',
          radius: ['55%', '75%'],
          center: center ? ['50%', '50%'] : ['30%', '50%'],
          avoidLabelOverlap: false,
          bottom: center ? showLegend ? 20 : null : null,
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
              formatter: labelFormatter,
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

  /**
   * 获取饼图配置
   * @param dataSource 数据源
   * @param center 环形图是否居中布局
   * @param showLegend 是否显示分类
   * @param isPercent 显示百分比或数值
   */
   getPieOption(dataSource, center = true, showLegend = true, isPercent = true) {
    const legend = center
      ? {
          show: showLegend,
          bottom: 0,
          padding: 0,
          itemGap: 10,
          itemWidth: 14,
          textStyle: {
            color: '#fff',
          },
        }
      : {
          show: showLegend,
          orient: 'vertical',
          top: 20,
          right: 10,
          itemGap: 10,
          itemWidth: 14,
          textStyle: {
            color: '#fff',
          },
        };
    return {
      legend: legend,
      tooltip: {
        trigger: 'item',
        formatter: isPercent ? '{b} : {d}%' : null,
      },
      series: [
        {
          type: 'pie',
          center: center ? ['50%', '50%'] : ['30%', '50%'],
          bottom: center ? showLegend ? 20 : null : null,
          color: ['#B2EBF2', '#4DD0E1', '#6699FF', '#115DF3', '#7ea8f9', '#ffd078', '#9a80fa'],
          itemStyle: {
            opacity: 0.9,
          },
          label: {
            color: '#fff',
          },
          data: dataSource,
        },
      ],
    };
  }

  /**
   * 获取基本南丁格尔玫瑰图配置
   * @param dataSource 数据源
   * @param isRose 是否为玫瑰图
   */
  getBasicNightingaleOption(dataSource, isRose = true) {
    if (isRose) dataSource = dataSource.sort((a, b) => a.value - b.value);
    return {
      tooltip: {
        trigger: 'item',
        position: isRose ? 'right' : null,
        formatter: isRose ? '{b} : {c} (㎡)' : '{b} : {c} (个)',
      },
      series: [
        {
          type: 'pie',
          radius: isRose ? [20, 80] : [60, 80],
          center: ['50%', '50%'],
          roseType: isRose ? 'area' : null,
          color: ['#E3F2FD', '#90CAF9', '#42A5F5', '#1E88E5', '#1565C0', '#0D47A1','#5C6BC0'],
          itemStyle: isRose ? {
            borderRadius: 4,
          } : null,
          label: {
            color: '#fff',
          },
          labelLine: {
            length: 10,
            length2: 10,
          },
          data: dataSource,
        },
      ],
    };
  }

  /**
   * 时间 * 比例/数量 平滑曲线图
   * @param dataSource 数据源
   * @param isPercent y 轴是否表示比例
   */
  getTimeLineOption(dataSource, isPercent = true) {
    return {
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          let relVal = params[0].name;
          for (var i = 0, l = params.length; i < l; i++) {
            const percent = isPercent ? '%' : '';
            relVal += '<br/>' + params[i].marker + params[i].seriesName + ': ' + params[i].value[1] + percent;
          }
          return relVal;
        }
      },
      grid: {
        top: 10,
        left: 30,
        right: 15,
        bottom: 20,
      },
      dataset: {
        source: dataSource,
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
          name: isPercent ? '饱和率' : '数量',
          smooth: true,
          showSymbol: false,
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
