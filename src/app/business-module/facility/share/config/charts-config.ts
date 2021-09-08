import {CommonUtil} from '../../../../shared-module/util/common-util';

export class ChartsConfig {
  public static getLanguage() {
    let save, unit;
    const language = CommonUtil.toggleNZi18n().language;
    save = language.facility.assetAnalysis.saveAsPicture;
    unit = language.facility.assetAnalysis.unit;
    return {save, unit};
  }
  /**
   * 资产占比统计
   */
  public static assetRatioStatistics(title, data) {
    return {
      tooltip: {
        trigger: 'item',
        confine: true, // 超出当前范围
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        x: 'center',
        top: 20,
        data: data.name,
        type: 'scroll',
        width: 400
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon: 'path://M803.61 126.49c26.34 0 51.14 10.24 69.85 28.83 18.71 18.59 29.01 43.25 29.01 69.44v579.28c0 54.19-44.35 98.27-98.85 98.27H220.89c-54.51 0-98.85-44.08-98.85-98.27V224.7' +
              '6c0-54.19 44.35-98.27 98.85-98.27h582.72m0-57.69H220.89C134.38 68.8 64 138.76 64 224.76v579.28c0 86 70.38 155.96 156.89 155.96h582.72c86.5 0 156.89-69.96 156.89-155.96V224.76c0-86-' +
              '70.39-155.96-156.89-155.96z M669.14 435.18H355.37c-28.83 0-51.41-26.94-51.41-61.34V147.49c0-34.39 22.58-61.34 51.41-61.34h313.77c28.83 0 51.41 26.94 51.41 61.34v226.36c0 34.39-22.58 ' +
              '61.33-51.41 61.33z m-306.86-58h299.95c0.19-0.92 0.32-2.04 0.32-3.34V147.49c0-1.29-0.13-2.41-0.32-3.34H362.28c-0.19 0.92-0.32 2.04-0.32 3.34v226.36c-0.01 1.29 0.13 2.41 0.32 3.33z ' +
              'M568.48 313.88h44.83c12.38 0 22.41-9.97 22.41-22.28v-66.84c0-12.3-10.03-22.28-22.41-22.28h-44.83c-12.38 0-22.41 9.97-22.41 22.28v66.84c0 12.3 10.04 22.28 22.41 22.28z',
            iconStyle: {
              color: '#36cfc9',
              borderColor: '#36cfc9',
              borderStyle: 'solid',
              borderWidth: 0.5
            },
            emphasis: {
              iconStyle: {
                color: '#36cfc9', // 图片Tip提示文字颜色
                // textPosition: 'top'
                fontSize: 12,
              }
            },
          }
        },
        itemSize: 17,
        right: 68,
      },
      grid: {
        containLabel: false,
        top: 30,
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
              formatter: '{d}%',
            },
          },
          labelLine: {
            normal: {
              show: true,
              length: 2
            }
          },
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  /**
   * 资产增长率统计
   */
  public static assetGrowthRateStatistics(xData, yData) {
    return {
      title: {
        text: '',
        left: 'center',
        top: 20,
        textStyle: {
          color: 'rgba(3,3,3,0.99)',
          font: 12
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#283b56'
          }
        },
        formatter: function(params) {
          let str: string = '';
          params.forEach((item, index) => {
            if (index === 0) {
              str = str + `${item.seriesName}: ${item.data}`;
            } else {
              str = str + `<br />${item.seriesName}: ${item.data}`;
            }
            if (item.componentSubType === 'line') {
              str += '%';
            }
          });
          return str;
        }
      }
        ,
      legend: {
        orient: 'horizontal',
        x: 'center',
        top: 20,
        type: 'scroll',
        width: 600
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: this.getLanguage().save,
            icon: 'path://M803.61 126.49c26.34 0 51.14 10.24 69.85 28.83 18.71 18.59 29.01 43.25 29.01 69.44v579.28c0 54.19-44.35 98.27-98.85 98.27H220.89c-54.51 0-98.85-44.08-98.85-98.27V224.7' +
              '6c0-54.19 44.35-98.27 98.85-98.27h582.72m0-57.69H220.89C134.38 68.8 64 138.76 64 224.76v579.28c0 86 70.38 155.96 156.89 155.96h582.72c86.5 0 156.89-69.96 156.89-155.96V224.76c0-86-' +
              '70.39-155.96-156.89-155.96z M669.14 435.18H355.37c-28.83 0-51.41-26.94-51.41-61.34V147.49c0-34.39 22.58-61.34 51.41-61.34h313.77c28.83 0 51.41 26.94 51.41 61.34v226.36c0 34.39-22.58 ' +
              '61.33-51.41 61.33z m-306.86-58h299.95c0.19-0.92 0.32-2.04 0.32-3.34V147.49c0-1.29-0.13-2.41-0.32-3.34H362.28c-0.19 0.92-0.32 2.04-0.32 3.34v226.36c-0.01 1.29 0.13 2.41 0.32 3.33z ' +
              'M568.48 313.88h44.83c12.38 0 22.41-9.97 22.41-22.28v-66.84c0-12.3-10.03-22.28-22.41-22.28h-44.83c-12.38 0-22.41 9.97-22.41 22.28v66.84c0 12.3 10.04 22.28 22.41 22.28z',
            iconStyle: {
              color: '#36cfc9',
              borderColor: '#36cfc9',
              borderStyle: 'solid',
              borderWidth: 0.5
            },
            emphasis: {
              iconStyle: {
                color: '#36cfc9', // 图片Tip提示文字颜色
                // textPosition: 'top'
                fontSize: 12,
              }
            },
          }
        },
        itemSize: 17,
        right: 60,
      },
      grid: {
        containLabel: false,
        top: 50,
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#cbcbcb'
            }
          },
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: '#030303'
          },
          data: xData
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: this.getLanguage().unit,
          nameTextStyle: {
            color: '#030303',
          },
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#cbcbcb'
            }
          },
          axisLabel: {
            formatter: '{value}',
            color: '#030303'
          },
          splitLine: false,
          minInterval: 1
        },
        {
          type: 'value',
          name: '',
          show: true,
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#cbcbcb'
            }
          },
          axisLabel: {
            formatter: '{value}%',
            color: '#030303'
          },
          splitLine: false,
          minInterval: 1
        }
      ],
      series: yData
    };
  }

  /**
   * 资产故障分布统计
   */
  public static assetFailureDistributionStatistics() {
    return {
      title: {
        text: '',
        left: 'center',
        top: 20,
        textStyle: {
          color: 'rgba(3,3,3,0.99)',
          font: 12
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#283b56'
          }
        }
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: '222'
      },
      toolbox: {
        feature: {
          saveAsImage: {
            icon: 'path://M803.61 126.49c26.34 0 51.14 10.24 69.85 28.83 18.71 18.59 29.01 43.25 29.01 69.44v579.28c0 54.19-44.35 98.27-98.85 98.27H220.89c-54.51 0-98.85-44.08-98.85-98.27V224.7' +
              '6c0-54.19 44.35-98.27 98.85-98.27h582.72m0-57.69H220.89C134.38 68.8 64 138.76 64 224.76v579.28c0 86 70.38 155.96 156.89 155.96h582.72c86.5 0 156.89-69.96 156.89-155.96V224.76c0-86-' +
              '70.39-155.96-156.89-155.96z M669.14 435.18H355.37c-28.83 0-51.41-26.94-51.41-61.34V147.49c0-34.39 22.58-61.34 51.41-61.34h313.77c28.83 0 51.41 26.94 51.41 61.34v226.36c0 34.39-22.58 ' +
              '61.33-51.41 61.33z m-306.86-58h299.95c0.19-0.92 0.32-2.04 0.32-3.34V147.49c0-1.29-0.13-2.41-0.32-3.34H362.28c-0.19 0.92-0.32 2.04-0.32 3.34v226.36c-0.01 1.29 0.13 2.41 0.32 3.33z ' +
              'M568.48 313.88h44.83c12.38 0 22.41-9.97 22.41-22.28v-66.84c0-12.3-10.03-22.28-22.41-22.28h-44.83c-12.38 0-22.41 9.97-22.41 22.28v66.84c0 12.3 10.04 22.28 22.41 22.28z',
            iconStyle: {
              color: '#36cfc9',
              borderColor: '#36cfc9',
              borderStyle: 'solid',
              borderWidth: 0.5
            },
            emphasis: {
              iconStyle: {
                color: '#36cfc9', // 图片Tip提示文字颜色
                // textPosition: 'top'
                fontSize: 12,
              }
            },
          }
        },
        itemSize: 17,
        right: 60,
      },
      grid: {
        containLabel: false,
        top: 50
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#cbcbcb'
            }
          },
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: '#030303'
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '单位：kw',
          nameTextStyle: {
            color: '#030303',
          },
          min: 0,
          max: 250,
          show: true,
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#cbcbcb'
            }
          },
          axisLabel: {
            formatter: '{value}',
            color: '#030303'
          },
          splitLine: false
        },
        {
          type: 'value',
          name: '',
          min: 0,
          max: 250,
          show: false,
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#cbcbcb'
            }
          },
          axisLabel: {
            formatter: '{value} %',
            color: '#030303'
          },
          splitLine: false
        },
      ],
      series: [
        {
          name: '摄像头',
          type: 'bar',
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
          barGap: '0%',
          barWidth: '20%'
        },
        {
          name: '增长率',
          type: 'line',
          yAxisIndex: 1,
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
        {
          name: '型号1',
          type: 'bar',
          data: [3.0, 2.9, 6.0, 20.2, 26.6, 76.7, 140.6, 162.2, 45.6, 30.0, 9.4, 4.3],
          barGap: '50%',
          barWidth: '20%'
        },
        {
          name: '型号2',
          type: 'line',
          data: [7.0, 8.9, 4.0, 23.2, 35.6, 80.7, 123.6, 150.2, 45.6, 67.0, 8.4, 2.3]
        },
      ]
    };
  }
}
