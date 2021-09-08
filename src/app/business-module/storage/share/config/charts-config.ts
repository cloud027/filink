import {CommonUtil} from '../../../../shared-module/util/common-util';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {MaterialTypeEnum} from '../enum/material-type.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import { TimeDimensionEnum } from '../enum/time-dimension.enum';
import {MonthEnum} from '../../../../shared-module/enum/month.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';

/**
 * 图表配置项
 */
export class StorageChartsConfig {
  /**
   * 库存总览统计图配置
   * param orgData  图表数据
   * param isAccordToModel  是否根据物料型号画图
   * param i18n 国际化
   * param type 物料分类类型
   */
  public static inventoryOverviewChart(orgData, isAccordToModel: boolean, i18n, type: MaterialTypeEnum) {
    const xAxisData = [];
    const series = [];
    if (isAccordToModel) {
      // 根据物料型号展示
      orgData[Object.keys(orgData)[0]].forEach((item, index) => {
        // 添加每个物料型号的值，做堆叠效果处理，设置当前型号的值为具体的数量，其他型号的值的为'--'
        const seriesData = Array.from({length: orgData[Object.keys(orgData)[0]].length}, () => '--');
        // 判断是否有重复的图例，有重复的图例，则添加空格，空格的个数取决于当前索引（保证唯一性），然后在legend的formatter中去掉空格展示
        if (xAxisData.find(name => name === item.materialModelName)) {
          const str = Array.from({length: index}, () => ' ').join('');
          item.materialModelName = item.materialModelName + str;
        }
        xAxisData.push(item.materialModelName);
        seriesData[index] = item.total;
        series.push({
          name: item.materialModelName,
          type: 'bar',
          stack: 'stack',
          data: seriesData,
          barWidth: 25
        });
      });
    } else {
      // 根据物料分类展示
      Object.keys(orgData).forEach((key, index) => {
        // 处理X轴的值 即取出物料分类的名称
        switch (type) {
          case MaterialTypeEnum.equipment:
            xAxisData.push(CommonUtil.codeTranslate(EquipmentTypeEnum, i18n, key));
            break;
          case MaterialTypeEnum.facility:
            xAxisData.push(CommonUtil.codeTranslate(DeviceTypeEnum, i18n, key));
            break;
          case MaterialTypeEnum.other:
            xAxisData.push(i18n.translate('storage.otherTotal'));
            break;
        }
        if (orgData[key] && orgData[key].length) {
          orgData[key].forEach((modelItem) => {
            // 添加每个物料分类的值，做堆叠效果处理，设置当前分类的值为具体的数量，其他分类的值的为'--'
            const seriesData = Array.from({length: Object.keys(orgData).length}, () => '--');
            seriesData[index] = modelItem.total;
            series.push({
              name: xAxisData[index],
              type: 'bar',
              stack: 'stack',
              data: seriesData,
              barWidth: 25
            });
          });
        }
      });
    }
    // 每个图例的文字的长度加起来大于60时，则展示分页
    const lengendIsScroll = xAxisData.join('').length > 60;
    return {
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params) => {
          const tempData = params.find(item => item.value !== '--');
          if (tempData) {
            return `${tempData.name}: ${tempData.value}`;
          }
        }
      },
      legend: {
        type: lengendIsScroll ? 'scroll' : 'plain',
        left: lengendIsScroll ? '15%' : 'center',
        right: lengendIsScroll ? '15%' : 'auto',
        formatter: (name) => {
          return name.trim();
        }
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            interval: 0,
            formatter: (value) => {
              let ret = ''; // 拼接加\n返回的类目项
              const maxLength = 8; // 每项显示文字个数
              const valLength = value.length; // X轴类目项的文字个数
              const rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
              if (rowN > 1) {
                for (let i = 0; i < rowN; i++) {
                  let temp = ''; // 每次截取的字符串
                  const start = i * maxLength; // 开始截取的位置
                  const end = start + maxLength; // 结束截取的位置
                  temp = value.substring(start, end) + '\n';
                  ret += temp; // 拼接最终的字符串
                }
                return ret;
              } else {
                return value;
              }
            }
          }
        }
      ],
      yAxis: [{
        type: 'value',
        minInterval: 1,
        splitLine: {
          show: false
        }
      }],
      series: series,
      color: ['#4f8cdf', '#54ce9c', '#77b0de', '#efc136', '#f65f31', '#34cce2', '#9186e0', '#f5a04e', '#71d9b3', '#f77b7b', '#f7ce93', '#add0f6']
    };
  }

  /**
   * 入库出库统计图配置
   * param orgData  图表数据
   * param queryParams
   * param i18n 国际化
   * params isStockIn 判断是入库还是出库 入库是true
   */
  public static stockInAndStockOutChart(orgData, queryParams, i18n, isStockIn: boolean, storageLanguage) {
    // 图例数据
    let legendData = [];
    const unselectedLegendData = {};
    let xAxisData = [];
    let seriesData = [];
    // 规格型号对应的所有数据
    let showName = [];
    const series = [];
    // 处理X轴上的点，选择年，则展示一年12个月的点；选择月，则展示一个月的日期的点；选择日，则展示一天24小时的点
    switch (queryParams.timeDimension) {
      case TimeDimensionEnum.year:
        seriesData = Array.from({length: 12}, () => 0);
        xAxisData = Array.from({length: 12}, (item, i) => `${CommonUtil.codeTranslate(MonthEnum, i18n, i + 1, LanguageEnum.common)}`);
        break;
      case TimeDimensionEnum.month:
        const monthNumber = new Date(queryParams.year, queryParams.month, 0).getDate();
        seriesData = Array.from({length: monthNumber}, () => 0);
        xAxisData = Array.from({length: monthNumber}, (item, i) => `${i + 1}${storageLanguage.date}`);
        break;
      case TimeDimensionEnum.date:
        seriesData = Array.from({length: 24}, () => 0);
        xAxisData = Array.from({length: 24}, (item, i) => `${i}${storageLanguage.hour}`);
        break;
    }
    Object.keys(orgData).forEach((key, index) => {
      const tempSeriesData = [...seriesData];
      if (orgData[key] && orgData[key].length) {
        // const tempXAxis = [];
        // 有重复的图例，则添加空格，空格的个数取决于当前索引（保证唯一性），然后在legend的formatter中去掉空格展示
        const str = Array.from({length: index}, () => ' ').join('');
        orgData[key][0].materialModel = orgData[key][0].materialModel + str;
        // 获取图例数据
        legendData.push(orgData[key][0].materialModel);
        // 获取规格型号对应的所有数据
        showName.push(orgData[key][0]);
        orgData[key].forEach(item => {
          let temp;
          switch (queryParams.timeDimension) {
            case TimeDimensionEnum.year:
              temp = isStockIn ? item.warehousingDateMonth : item.deliveryDateMonth;
              break;
            case TimeDimensionEnum.month:
              temp = isStockIn ? item.warehousingDateDay : item.deliveryDateDay;
              break;
            case TimeDimensionEnum.date:
              // 选择date时是从0时开始显示的，所以需要先+1，在后续步骤中跟年月使用下面的统一处理
              const hourTemp = isStockIn ? item.warehousingDateHour : item.deliveryDateHour;
              temp = Number(hourTemp) + 1;
              break;
          }
          let num = 0;
          // if (tempXAxis.includes(temp)) {
          //   num = tempSeriesData[Number(temp) - 1];
          // } else {
          //   tempXAxis.push(temp);
          // }
          // 去除数字前面的0 然后找到对应的索引位置，放入有效值，没有值的则还是为0
          // 索引是从0开始的，但是实际显示是从1开始的，所以需要-1
          tempSeriesData[Number(temp) - 1] = isStockIn ? Number(item.warehousingNum) + num : Number(item.deliveryNum) + num;
        });
      }
      series.push({
        // 要跟legend中的值保持一致
        name: orgData[key][0].materialModel,
        type: 'line',
        data: tempSeriesData
      });
    });
    // 型号超过5个的图例初始化时灰显
    legendData.filter((item, idx) => idx >= 5).forEach(item => {
      Object.assign(unselectedLegendData, {[item]: false});
    });
    // 每个图例的文字的长度加起来大于60时，则展示分页
    const lengendIsScroll = legendData.join('').length > 60;
    return {
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          // 自定义鼠标浮在折线上的展示内容样式设置
          // params数据中 name返回的是X坐标轴的值，color当前折线颜色，data当前统计出的数值，seriesName规格型号名称
          let str = '';
          params.forEach(item => {
            // 根据当前折线图返回的规格型号名称获取其对应的所有数据包括供应商名称，软硬件版本
            const allData = showName.find(i => i.materialModel === item.seriesName);
            let name;
            // 在折线上的展示内容格式规定为：设备为产品规格-供应商-软件版本-硬件版本,设施为产品规格-供应商
            if (allData.softwareVersion && allData.hardwareVersion) {
              name = allData.materialModel + '-' + allData.supplierName + '-' + allData.softwareVersion + '-' + allData.hardwareVersion;
            } else {
              name = allData.materialModel + '-' + allData.supplierName;
            }
            str += '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:'+item.color+'"></span>'
              + name + ': ' + item.data + '<br/>';
            });
          return str;
        },
      },
      legend: {
        type: lengendIsScroll ? 'scroll' : 'plain',
        left: lengendIsScroll ? '15%' : 'center',
        right: lengendIsScroll ? '15%' : 'auto',
        data: legendData,
        selected: unselectedLegendData,
        formatter: function (name) {
          // 因为有重复名称的图例，有添加空格做区分，图例展示时需要去除空格
          return name.trim();
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: {
          show: false
        },
        name: storageLanguage.unit,
        nameTextStyle: {
          padding: [0, 0, 0, 50]
        }
      },
      series: series,
      color: ['#4f8cdf', '#54ce9c', '#77b0de', '#efc136', '#f65f31', '#34cce2', '#9186e0', '#f5a04e', '#71d9b3', '#f77b7b', '#f7ce93', '#add0f6']
    };
  }
}
