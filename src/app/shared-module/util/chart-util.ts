import {CommonUtil} from './common-util';

export class ChartUtil {

  public static getLanguage() {
    let save, total, sum;
    const language = CommonUtil.toggleNZi18n().language;
    save = language.common.save;
    total = language.common.total;
    sum = language.common.sum;
    return {save, total, sum};
  }

  /**
   * 环形图配置
   * param data
   * param name
   * @param title string 导出统计图是的文件名称
   */
  public static setRingChartOption(data, name, title?) {
    let chartData = [];
    let chartName = [];
    if (!data.every(item => item.value === 0)) {
      data.forEach((item, index) => {
        if (item.value !== 0) {
          chartData.push(item);
          chartName.push(item.name);
        }
      });
    } else {
      chartData = data;
      chartName = name;
    }
    const option = {
      title: {
        show: false,
        text: title ? title : 'echarts'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',

      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        // x: 'center',
        data: chartName,
        // right: 1,
      },
      grid: {
        containLabel: false
      },
      toolbox: {
        top: 20,
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: true,
          minAngle: 5,
          hoverAnimation: true,
          label: {
            normal: {   // 视觉引导线
              // show: true,
              // position: 'right',
              formatter: '{b} \n{d}%',
            },
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          data: chartData
        }
      ]
    };
    return option;
  }

  /**
   * 扇形图配置
   * param data
   * param name
   */
  public static setPieChartOption(data, name) {
    let chartData = [];
    let chartName = [];
    if (!data.every(item => item.value === 0)) {
      data.forEach((item, index) => {
        if (item.value !== 0) {
          chartData.push(item);
          chartName.push(item.name);
        }
      });
    } else {
      chartData = data;
      chartName = name;
    }
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '70%',
          data: chartData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            length: 10,
            length2: 10
          }
        }
      ]
    };
    return option;
  }

  /**
   * 时间日期折线图图配置
   * param data
   * param name
   */
  public static setLineTimeChartOption(data) {
    const seriesData = [];
    const seriesName = [];
    data.forEach(item => {
      if (item.value !== 0) {
        seriesData.push({
          type: 'line',
          data: item.value,
          name: item.name
        });
        seriesName.push(item.name);
      }
    });
    const option = {
      toolbox: {
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: seriesName
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: true
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
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
        splitLine: {
          show: false
        }
      },
      series: seriesData
    };
    return option;
  }

  /**
   * 柱状图配置
   * param data
   * param name
   * @param title string 导出统计图是的文件名称
   */
  public static setBarChartOption(data, name, title?) {
    const chartData = [];
    const chartName = [];
    data.forEach((item, index) => {
      chartData.push(item);
      chartName.push(name[index]);
    });
    const option = {
      title: {
        show: false,
        text: title ? title : 'echarts'
      },
      toolbox: {
        top: 20,
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
      xAxis: {
        type: 'category',
        data: chartName,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          color: '#333',
          interval: 0,
          rotate: 40,
          formatter: function (params) {
            if (params.length > 4) {
              return params.slice(0, 4) + '...';
            }
            return params;
          }
        },
      },
      legend: {
        data: chartName,
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '11px',
        top: '30px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5
          }
        },
      },
      series: [{
        data: chartData,
        type: 'bar',
        barWidth: '30%',
        label: {
          show: true,
          position: 'top',
        }
      }]
    };
    return option;
  }

  /**
   * topN柱状图配置
   * param data
   * param name
   */
  public static setBarsChartOption(data, title, type?) {
    const seriesName = [];
    const seriesData = [];
    data.forEach(item => {
      seriesName.push(item.deviceName);
      seriesData.push(item.sensorValue);
    });
    const option = {
      toolbox: {
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        minInterval: 1,
        max: function (value) {
          return Math.ceil(value.max) + 2;
        }
      },
      yAxis: {
        type: 'category',
        data: seriesName,
      },
      series: {
        type: 'bar',
        data: seriesData,
        barWidth: '30%',
        label: {
          show: true,
          position: 'right',
          formatter: function (event) {
            if (type) {
              return event.value + '%';
            } else {
              return event.value;
            }
          }
        }
      }
    };
    if (title) {
      option['title'] = title;
    }
    return option;
  }

  /**
   * 折线图图配置
   * param data
   * param name
   * @param title string 导出统计图是的文件名称
   */
  public static setLineChartOption(data, name, title?) {
    const option = {
      title: {
        show: false,
        text: title ? title : 'echarts'
      },
      color: ['#009edf'],
      xAxis: {
        type: 'category',
        data: name
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '11px',
        top: '30px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: name
      },
      yAxis: {
        type: 'value',
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
        type: 'line',
        smooth: true
      }]
    };
    return option;
  }

  /**
   * 环形图配置
   * param data
   * param name
   */
  public static setWorkRingChartOption(total, dataCount, title) {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: title + ' <br/>{b}: {c} ({d}%)'
      },
      grid: {
        containLabel: false // 内容溢出
      },
      legend: {
        itemGap: 3,
        orient: 'vertical',
        right: 0,
        top: '5%',
        width: 100,
        icon: 'circle',
        formatter: function (name) {
          let target;
          if (total !== 0) {
            for (let i = 0; i < dataCount.length; i++) {
              if (dataCount[i].name === name) {
                target = dataCount[i].value;
              }
            }
            const arr = ['{b|' + name + '}',
              '{b|' + ((target / total) * 100).toFixed(2) + '%}',
              '{a|' + target + '}'];
            return arr.join('  ');
          } else {
            for (let i = 0; i < dataCount.length; i++) {
              if (dataCount[i].name === name) {
                target = dataCount[i].value;
              }
            }
            const arr = ['{b|' + name + '}',

              '{a|' + target + '}'];
            return arr.join('  ');
          }
        },
        textStyle: {
          rich: {
            a: {
              fontSize: 10,
              color: '#000',
            },
            b: {
              fontSize: 10,
              color: '#333'
            }
          }
        }
      },
      graphic: {
        type: 'text',
        top: 'center',
        left: '16%',
        style: {
          text: `${this.getLanguage().total}\n ${total}`,
          textAlign: 'center',
          fill: '#fff',
          fontSize: 12,
          fontWeight: 'bold',
        }
      },
      color: ['#fbd517', '#009edf', '#ff6608', '#e51216', '#ef488d'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['20%', '50%'],      // 位置距离
          avoidLabelOverlap: true,    // 避免标注重叠
          hoverAnimation: false,　　　　// 移入放大
          label: {
            normal: {
              fontSize: 12,
              show: false,
              position: 'center',
              formatter: () => {
                return `${this.getLanguage().sum}\n${total}`;
              }
            },
            emphasis: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          data: dataCount
        }
      ]
    };
    return option;
  }

  /**
   * 柱状图配置
   * param data
   * param name
   */
  public static setWorkBarChartOption(data, name) {
    const chartData = [];
    const chartName = [];
    data.forEach((item, index) => {
      chartData.push(item);
      chartName.push(name[index]);
    });
    const option = {
      xAxis: {
        type: 'category',
        data: chartName,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0,
          rotate: -30,
          margin: 20,
          show: true,
          textStyle: {
            align: 'center',
            color: '#333333',
            fontSize : 10
          },
        },
        axisLine: {
          lineStyle: {
            color: '#d9d9d9'
          }
        }
      },
      legend: {
        data: chartName,
      },
      grid: {
        left: '0px',
        right: '4%',
        bottom: '11px',
        top: '25px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5
          }
        },
        axisLine: {
          lineStyle: {
            color: '#d9d9d9'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333333',
            fontSize : 10
          },
        }
      },
      series: [{
        data: chartData,
        type: 'bar',
        barMinWidth: 20,
        barMaxWidth: 35,
        label: {
          show: true,
          position: 'top',
        }
      }]
    };
    return option;
  }
  /**
   * 环形图配置
   * param data
   * param name
   */
  public static setTroubleRingChartOption(dataCount) {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      grid: {
        containLabel: false // 内容溢出
      },
        legend: {
          type: 'scroll',
          x: 'center',
          top: 12,
        },
      color: ['#01c6a9', '#ff6600', '#637ff1'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '55%'],
          center: ['50%', '62%'],      // 位置距离
          avoidLabelOverlap: false,    // 避免标注重叠
          hoverAnimation: false,　　　　// 移入放大
          label: {
            normal: {
              show: true,
              fontSize: 12,
              position: 'outter',
              formatter: '{a}{b}' + '\n' + '{d}%'
            },
          },
          labelLine: {
            normal: {
              length: 15,
              length2: 10,
            }
          },
          data: dataCount
        }
      ]
    };
    return option;
  }

  /**
   * 历史销障工单故障原因统计
   * @param title sring
   * @param data array
   */
  public static setWorkOrderReasonChartOption(title, data, total) {
    const legend = [];
    let score = 0;
    if (data && data.length > 0) {
      data.forEach((item, i) => {
        legend.push(item.name);
        item.score = '';
        if (total > 0) {
          if (i === data.length - 1) {
            item.score = `${item.name} ${(100 - score)}%`;
          } else {
            const num = Math.floor((item.value / total) * 100);
            score += num;
            item.score = `${item.name} ${num}%`;
          }
        } else {
          item.score = `${item.name} 0%`;
        }
      });
    }
    const option = {
      // color: ['#77b0de', '#f8c032', '#959595', '#fb7356', '#36d1c9'],
      color: ['#36d1c9', '#fb7356', '#959595', '#f8c032', '#77b0de'],
      title: {
        text: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        left: 'left',
        data: legend
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: '50%',
          center: ['50%', '65%'],
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            normal: {
              formatter(v) {
                return v.data.score.split(' ').join('\n');
              }
            }
          },
          labelLine: {
            length: 5,
            length2: 10,
          }
        }
      ]
    };
    return option;
  }

  /**
   * 历史告警确认工单告警类型统计
   */
  public static historyAlarmOrderChart(legend, data, colors, title) {
    return {
      color: colors,
      title: {text: '', left: 'center'},
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        data: legend,
        textStyle: {
          fontSize: 10
        }
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: '56%',
          center: ['60%', '53%'],
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            normal: {
              fontSize: 10,
              formatter(v) {
                return `${v.name} ${v.value}(${v.percent}%)`;
              }
            },
            fontSize: 10
          },
          labelLine: {
            length: 5,
            length2: 10,
          }
        }
      ]
    };
  }

  /**
   * 工单环形图配置
   */
  public static initCirclesChart(already: number, title: string, color: string, smallSize?: boolean) {
    const surplus = 100 - already;
    const allColor = '#eff0f4';
    return {
      tooltip: {show: false},
      legend: {show: false},
      color: [color, allColor],
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['87%', '98%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          cursor: 'default',
          label: {
            normal: {
              show: true,
              position: 'center',
              fontSize: smallSize ? 10 : 12,
              lineHeight: 18,
              formatter: '{b}\n{d}.00%', // {b}:数据名； {c}：数据值； {d}：百分比，可以自定义显示内容，
              fontStyle: 'normal'
            }
          },
          emphasis: {
            label: {show: false}
          },
          labelLine: {show: false},
          data: [
            {
              value: already,
              name: title,
              label: {
                normal: {show: true},
              },
              itemStyle: {
                normal: {color: color},
                emphasis: {color: color}
              }
            },
            {
              value: surplus,
              name: '',
              label: {
                normal: {show: false},
              },
              itemStyle: {
                normal: {color: allColor},
                emphasis: {color: allColor}
              }
            }
          ]
        }
      ]
    };
  }

  /**
   * 折线图配置
   * param x
   * param y
   */
  public static brokenLine(x, y, language) {
    return {
      title: {
        text: language.alarmIncrementDrawing,
        left: 'left'
      },
      grid: {
        show: true,
      },
      tooltip: {
        trigger: 'axis',
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: language.save,
            icon: 'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0'
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: x
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        title: language.totalQuantity
      },
      dataZoom: {
        type: 'slider'
      },
      color: ['rgb(188,171,224)'],
      lineStyle: {
        width: 5,
      },
      series: [{

        data: y,
        type: 'line'
      }]
    };
  }
}
