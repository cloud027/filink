// tslint:disable: max-line-length
// tslint:disable: no-redundant-jsdoc
import { CommonUtil } from '../../../../shared-module/util/common-util';

export class EnergyEchartUtil {
  public static getLanguage() {
    let save, total, sum, descendingOrder, ascendingOrder;
    const language = CommonUtil.toggleNZi18n().language as any;
    save = language.common.save;
    total = language.common.total;
    sum = language.common.sum;
    descendingOrder = language.energy.descendingOrder;
    ascendingOrder = language.energy.descendingOrder;
    return { save, total, sum, descendingOrder, ascendingOrder };
  }

  /**
   * 柱状图配置
   * @param {Array<string>} xData xAxis X轴的显示文字
   * @param {Array<string>} legendData legend Echarts 头部的导航文字
   * @param { boolean } YFlag 用来显示Y轴的提示文本
   */
  public static setBarChartOption(xData, legendData, series, YFlag = true) {
    const option = {
      toolbox: {
        feature: {
          // 升序
          myToolAscendOrder: {
            show: false,
            title: this.getLanguage().ascendingOrder,
            icon:
              'path://M767.808 149.12l170.624 213.312h-128v469.376a42.688 42.688 0 1 1-85.312 0V362.432h-128l170.688-213.312zM554.432 831.808a42.688 42.688 0 0 1-42.624 42.624h-384a42.688 42.688 0 1 1 0-85.312h384c23.552 0 42.624 19.072 42.624 42.688z m0-298.688a42.688 42.688 0 0 1-42.624 42.688h-384a42.688 42.688 0 0 1 0-85.376h384c23.552 0 42.624 19.136 42.624 42.688zM469.12 234.432a42.688 42.688 0 0 1-42.688 42.688H127.808a42.688 42.688 0 1 1 0-85.312h298.624c23.616 0 42.688 19.072 42.688 42.624z',
          },
          // 降序
          myTooldescendOrder: {
            show: false,
            title: this.getLanguage().descendingOrder,
            icon:
              'path://M810.432 191.808v469.312h128l-170.624 213.312L597.12 661.12h128V191.808a42.688 42.688 0 1 1 85.312 0zM469.12 789.12a42.688 42.688 0 0 1-42.688 42.688H127.808a42.688 42.688 0 0 1 0-85.376h298.624c23.616 0 42.688 19.136 42.688 42.688z m85.312-298.688a42.688 42.688 0 0 1-42.624 42.688h-384a42.688 42.688 0 1 1 0-85.312h384c23.552 0 42.624 19.072 42.624 42.624z m0-298.624a42.688 42.688 0 0 1-42.624 42.624h-384a42.688 42.688 0 1 1 0-85.312h384c23.552 0 42.624 19.072 42.624 42.688z',
            onclick: () => {
              console.log(123, '123');
            },
          },
          saveAsImage: {
            title: this.getLanguage().save,
            icon:
              'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0',
          },
        },
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          color: '#333',
          interval: 0,
          rotate: xData.length > 8 ? 90 : 0,
        },
      },
      legend: {
        data: legendData,
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '11px',
        top: '30px',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        name: YFlag ? '能耗值(kW·h)' : '',
        nameTextStyle: {
          padding: [0, 0, 0, 50],
        },
        type: 'value',
        minInterval: 1,
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5,
          },
        },
      },
      series,
    };
    return option;
  }

  /**
   * 折线图配置
   *  @param {Array<string>} xData xAxis X轴的显示文字
   *  @param {Array<string>} legendData legend Echarts 头部的导航文字
   *  @param {any} tooltipFlag 鼠标移动上去的时候 是否需要自定义 tooltip 默认是 false  不需要自定义
   *
   */
  public static setLineEchartOption(
    xData: string[],
    legendData: string[],
    series: string[],
    rotate: number = 10,
    tooltip = null,
  ) {
    const option = {
      tooltip: tooltip
        ? tooltip
        : {
            trigger: 'axis',
          },
      legend: {
        type: 'scroll',
        data: legendData,
        right: '30px',
        left: '30px',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon:
              'path://M819.814-72.064H204.186c-84.352 0-152.986 68.582-152.986 152.96V687.078c0 84.378 68.634 153.012 152.986 153.012H819.84c84.326-0.026 152.96-68.634 152.96-153.012v-606.182c0-84.378-68.608-152.96-152.986-152.96zM204.186 780.365c-51.456 0-93.312-41.83-93.312-93.312v-606.157c0-51.456 41.856-93.338 93.312-93.338H819.84c51.456 0 93.312 41.882 93.312 93.338V687.078c0 51.482-41.856 93.312-93.312 93.312H204.186v-0.025zM807.04 382.566H216.96V840.064h590.106v-457.498h-0.026z m-530.432 59.7h470.784V780.365H276.608v-338.1z m323.251 250.29h59.648V493.62H599.86V692.557z m0 0',
          },
        },
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          color: '#333',
          interval: 0,
          rotate,
        },
      },
      yAxis: {
        name: '能耗值(kW·h)',
        nameTextStyle: {
          padding: [0, 0, 0, 50],
        },
        type: 'value',
        minInterval: 1,
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5,
          },
        },
      },
      series,
    };
    return option;
  }
}
