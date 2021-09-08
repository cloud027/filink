// tslint:disable-next-line:class-name
export class indexChart {
  /**
   * 环形图配置
   * param data
   * param name
   */
  public static setRingChartOption(data, title) {
    const option = {
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: '222'
      },
      grid: {
        containLabel: false
      },
      series: [
        {
          minAngle: 20,
          name: title,
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '55%'],      // 位置距离
          avoidLabelOverlap: true,
          label: {
            normal: {
              formatter: '{b} \n {d}%',
            },
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          data: data
        }
      ]
    };
    return option;
  }


  /**
   * 饼状图配置
   * param data
   * param name
   */
  public static setBarChartOption(data, title) {
    const option = {
      tooltip: {
        trigger: 'item',
        confine: true, // 超出当前范围
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: '222'
      },
      grid: {
        containLabel: false
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['0%', '60%'],
          center: ['50%', '55%'],      // 位置距离
          avoidLabelOverlap: true,
          minAngle: 5,
          hoverAnimation: false,　　  // 是否开启 hover 在扇区上的放大动画效果。
          label: {
            normal: {
              formatter: '{b} \n {d}%',
            },
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          data: data
        }
      ]
    };
    return option;
  }

  /**
   * 饼状图配置
   * param data
   * param name
   */
  public static setNewBarChartOption(data, title) {
    const option = {
      tooltip: {
        trigger: 'item',
        confine: false, // 超出当前范围
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        type: 'scroll',
        top: '0%',
        left: 'center'
      },
      grid: {
        containLabel: false
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['30%', '50%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: true,
          minAngle: 5,
          label: {
            normal: {
              formatter: '{b} : {d}%',
            },
          },
          labelLine: {
            normal: {
              show: true
            },
            length: 5,
            length2: 10
          },
          data: data
        }
      ]
    };
    return option;
  }

  /**
   * 柱状图配置
   * param data
   * param name
   * param tilt 横坐标是否倾斜展示
   */
  public static setHistogramChartOption(data, name, color?, tilt?) {
    const option = {
      color: ['#009edf', '#fb7356', '#959595', '#35aace', '#36d1c9', '#f8c032'],
      xAxis: {
        type: 'category',
        data: name,
        axisLabel: {
          color: '#333',
          interval: 0,
          fontSize: 12,
          rotate: tilt ? 30 : 0 // 国际化时部分横坐标太长需倾斜展示才放的下
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        }
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '5px',
        top: '10px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: '#333',
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        },
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5
          }
        }
      },
      series: [{
        data: data,
        type: 'bar',
        avoidLabelOverlap: true,
        barWidth: 20,
        itemStyle: {}
      }]
    };
    if (color) {
      option.series[0].itemStyle = {
        normal: {
          color: function (params) {
            return color[params.dataIndex];
          }
        }
      };
    }
    return option;
  }

  /**
   * 传输有效率柱状图配置
   * param data
   * param name
   */
  public static setEfficiencyChartOption(data, name, color?, type?) {
    const option = {
      color: ['#009edf', '#fb7356', '#959595', '#35aace', '#36d1c9', '#f8c032'],
      xAxis: {
        type: 'category',
        data: name,
        axisLabel: {
          color: '#333',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        }
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '5px',
        top: '10px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
        formatter: type ? '{b} : {c}KW·h' : '{b} : {c}%'
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: '#333',
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        },
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5
          }
        }
      },
      series: [{
        data: data,
        type: 'bar',
        avoidLabelOverlap: true,
        barWidth: 20,
        itemStyle: {}
      }]
    };
    if (color) {
      option.series[0].itemStyle = {
        normal: {
          color: function (params) {
            return color[params.dataIndex];
          }
        }
      };
    }
    return option;
  }


  /**
   * 折线图图配置
   * param data
   * param name
   */
  public static setLineChartOption(data, name) {
    const option = {
      color: ['#009edf', '#fb7356', '#959595', '#35aace', '#36d1c9', '#f8c032'],
      xAxis: {
        type: 'category',
        data: name,
        axisLabel: {
          color: '#333',
          interval: 0,
          rotate: 45,
          fontSize: 12,
          formatter: function (params) {
            if (params.length > 6) {
              return params.slice(5);
            }
          }
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        },
        boundaryGap: false,
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '5px',
        top: '10px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        confine: true
      },
      legend: {
        show: false
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: '#333',
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        },
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5
          }
        }
      },
      series: data
    };
    return option;
  }

  /**
   * new折线图图配置
   * param data
   * param name
   */
  public static setNewLineChartOption(data, name) {
    const option = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          let str: string = '';
          params.forEach((item, index) => {
            if (index === 0) {
              str = str + `${item.seriesName} ${item.data}`;
            } else {
              str = str + `<br />${item.seriesName} ${item.data}`;
            }
            if (item.componentSubType === 'line') {
              str += '%';
            }
          });
          return str;
        }
      },
      legend: {
        data: []
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '5px',
        top: '10px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: name,
        axisLabel: {
          color: '#333',
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        },
        boundaryGap: false,
      },
      //   {
      //   type: 'category',
      //   axisLine: {
      //     lineStyle: {
      //       color: '#cbcbcb'
      //     }
      //   },
      //   axisTick: {
      //     alignWithLabel: true
      //   },
      //   axisLabel: {
      //     color: '#030303'
      //   },
      //   data: name
      //   // type: 'category',
      //   // boundaryGap: false,
      //   // data: name
      // },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: '#333',
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        },
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5
          }
        }
      },
      series: data
    };
    return option;
  }
}
