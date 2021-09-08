/**
 * Created by xiaoconghu on 2019/6/18.
 */

export class DeviceChartUntil {
  /**
   * 时间日期折线图图配置（传感器阈值）
   * param data
   * returns any
   */
  public static setLineTimeChartOption(data) {
    const seriesData = [];
    const seriesName = [];
    data.forEach(item => {
      seriesData.push({
        type: 'line',
        data: item.value,
        name: item.name,
        areaStyle: {}
      });
      seriesName.push(item.name);
    });
    const option = {
      color: ['#009edf', '#dfaa8c', '#81dfdf', '#df448f'],
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: seriesName
      },
      xAxis: {
        type: 'time',
        axisLine: {
          show: false
        },
        splitLine: {
          show: true
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: data.length > 0,
          start: 0,
          end: 100,
          bottom: 0
        },
        {
          type: 'inside',
          start: 0,
          end: 35
        },
      ],
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      series: seriesData
    };
    return option;
  }

  /**
   * 开锁次数统计图
   * param date
   * param arr
   */
  public static setUnlockingChartOption(date, arr) {
    const option = {
      // width: '90%',
      height: '60%',
      tooltip: {
        trigger: 'axis',
      },
      color: ['#009edf'],
      xAxis: {
        // type: 'category',
        // show: false,
        // data: date
        type: 'category',
        show: arr.length > 0,
        splitLine: {
          show: false
        },
        // 换显示方式代码还有用
        // axisLabel: {
        //   formatter: (value) => {
        //     return CommonUtil.dateFmt('yyyy-MM-dd', new Date(value));
        //     console.log(value);
        //   }
        // }
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      grid: {
        // left: '10px',
        top: '20px'
      },
      series: {
        type: 'line', label: {show: true, position: 'top'}, smooth: true, areaStyle: {color: '#d0e9ff'},
        data: arr
      }
    };
    return option;
  }

  /**
   * 端口统计柱形图
   * returns any
   */
  public static setStatisticsBarChartOption(language, data, xData) {
    const barChartOption = {
      grid: {
        left: '50px',
      },
      tooltip: {
        trigger: 'axis',
      },
      color: ['#009edf'],
      xAxis: {
        type: 'category',
        axisLabel: {
          formatter: function (params) {
            if (params.length > 4) {
              return params.slice(0, 4) + '...';
            }
            return params;
          }
        },
        data: xData
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: {
          show: false
        },
        max: function (value) {
          if (value.max === 0) {
            return value.max + 2;
          } else {
            return value.max;
          }
        }
      },
      series: [{
        data: data,
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        type: 'bar'
      }],
      toolbox: {
        feature: {
          saveAsImage: {
            title: language.save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.' +
              '582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 15' +
              '3.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84' +
              '.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.8' +
              '3-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41' +
              '.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566' +
              'H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 25' +
              '0.29h59.648V493.62H599.86V692.557z m0 0'
          }
        },
        iconStyle: {}
      }
    };
    return barChartOption;
  }

  /**
   * 设施详情智能标签端口占用统计
   * param data
   * returns any
   */
  public static setStatisticsPieChartOption(language, data) {
    const pieChartOption = {
      width: '320px',
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: []
      },
      color: ['#fbd517', '#009edf', '#ff6608', '#e51216', '#ef488d'],
      series: [
        {
          name: language.dataShare,
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          label: {
            normal: {
              show: true,
              fontSize: '12',
              position: 'outter',
              formatter: '{b}: {c} \n({d}%)'
            },
          },
          labelLine: {
            normal: {
              show: true,
              length: 20,
              length2: 4,
            }
          },
          data: data
        }
      ],
      toolbox: {
        feature: {
          saveAsImage: {
            title: language.save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.' +
              '582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 15' +
              '3.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84' +
              '.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.8' +
              '3-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41' +
              '.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566' +
              'H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 25' +
              '0.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
    };
    return pieChartOption;
  }

  /**
   * 设置告警名称统计配置
   * param data
   * returns any
   */
  public static setAlarmNameStatisticsChartOption(name, data) {
    const ringOption = {
      grid: {
        containLabel: false // 内容溢出
      },
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: []
      },
      series: [
        {
          name: name,
          type: 'pie',
          radius: ['45%', '60%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '17',
                fontWeight: 'bold'
              }
            }
          },
          itemStyle: {
            normal: {
              color: function () {
                return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: data
        }
      ]
    };
    return ringOption;
  }

  /**
   * 设置告警级别统计配置
   * param data
   * returns any
   */
  public static setAlarmLevelStatisticsChartOption(name, data, color) {
    const chartOption = {
      color: ['#009edf'],
      title: {},
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: []
      },
      series: [
        {
          name: name,
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          minAngle: 5,   // 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
          avoidLabelOverlap: true,
          color: color,
          data: data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    return chartOption;
  }

  /**
   * 告警增量设施统计
   * param data
   * returns any
   */
  public static setAlarmSourceIncrementalChartOption(data) {
    const columnarOption = {
      color: ['#009edf'],
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'time',
        // boundaryGap: true,
        splitLine: {
          show: false
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: {
          show: false
        },
        max: function (value) {
          return value.max + 2;
        },
      },
      series: [{type: 'line', barMaxWidth: 50, label: {show: true, position: 'top'}, data: data}]
    };
    return columnarOption;
  }

  /**
   * 故障率表盘统计图
   */
  public static setBreakRateChartOption(productLanguage, data) {
    const option = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
      },
      series: [
        {
          name: productLanguage.businessIndicators,
          type: 'gauge',
          radius: '100%',
          title: {
            show: true,
            fontSize: 12,
            padding: [20, 0, 0, 0]
          },
          detail: {
            formatter: '{value}%',
            textStyle: {fontSize: 12}
          },
          axisLine: { // 仪表盘轴线样式
            lineStyle: {
              width: 12
            },
            fontSize: 9
          },
          splitLine: {
            length: 12
          },

          pointer: {
            width: 3,
            length: '80%',
            shadowBlur: 5
          },

          data: [{
            value: data, name: productLanguage.failureRate
          }],
        }

      ]
    };
    return option;
  }
}

