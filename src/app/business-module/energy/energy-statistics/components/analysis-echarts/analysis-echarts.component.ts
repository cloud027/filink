import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import _ from 'lodash';

import { NzI18nService } from 'ng-zorro-antd';

import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { EnergyLanguageInterface } from '../../../../../../assets/i18n/energy/energy.language.interface';

import {
  timeSelectTypeEnum,
  statictisRangeTypeEnum,
  DatePickerDisabledNumberEnum,
} from '../../../share/enum/energy-config.enum';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { EnergyApiService } from '../../../share/service/energy/energy-api.service';
import { EnergyAnalysisQueryDataModel } from '../../../share/model/energy-analysis-query-data.model';
import { getDateDayFormate, getMonthBetween, getYearBetween } from '../../../share/utils/tool.util';
import { EnergyEchartUtil } from '../../../share/utils/chart-util';
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component';

@Component({
  selector: 'app-analysis-echarts',
  templateUrl: './analysis-echarts.component.html',
  styleUrls: ['./analysis-echarts.component.scss'],
})
export class AnalysisEchartsComponent implements OnInit, OnDestroy {
  @ViewChild('datePickerTemp') datePickerTemp: DatePickerComponent;
  @ViewChild('monthDatePickerTemp') monthDatePickerTemp: DatePickerComponent;
  @ViewChild('yearDatePickerTemp') yearDatePickerTemp: DatePickerComponent;
  // 统计项目
  @Input() energyProjectList = [];
  // 统计范围
  @Input() energyStatisticsSelectRangeList = [];
  /** 搜索条件 */
  @Input() searchContainer;
  selectFlag: boolean = true;

  energyAnalysisSubmit: EnergyAnalysisQueryDataModel = new EnergyAnalysisQueryDataModel();

  timeSelectType = timeSelectTypeEnum;

  // 统计范围枚举
  statictisRangeType = statictisRangeTypeEnum;

  /** 设置 时间选择器的限制时间间隔 */
  DatePickerDisabledNumberEnum = DatePickerDisabledNumberEnum;

  /** 分析按钮 */
  btnLoading: boolean = false;

  // 日能耗
  DayChartInstance;
  dayEchartsFlag: boolean = false;
  // 月能耗
  MonthChartInstance;
  monthEchartsFlag: boolean = false;
  // 年能耗
  YearChartInstance;
  yearEchartsFlag: boolean = false;

  selectValue;

  language: EnergyLanguageInterface;
  constructor(private $nzI18n: NzI18nService, private $energyApiService: EnergyApiService) {}

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
    this.init_selectValue();
  }
  ngOnDestroy() {
    this.datePickerTemp = null;
    this.monthDatePickerTemp = null;
    this.yearDatePickerTemp = null;
  }

  /** 初始化的时候给 时间赋值 */
  init_selectValue() {
    const getNowDate = new Date();
    const getYear = getNowDate.getFullYear();
    const getMonth = getNowDate.getMonth() + 1;
    const getDay = getNowDate.getDate();
    // 开始时间
    const startTime = new Date(`${getYear}-${getMonth}-${getDay - 3}`);
    // 日选择器的结束时间
    const dayEndTime = new Date(`${getYear}-${getMonth}-${getDay - 1}`);
    const setDate = `${getNowDate.getFullYear()}-${getNowDate.getMonth() + 1}-1`;
    this.energyAnalysisSubmit.days = getDateDayFormate(startTime, dayEndTime);
    this.energyAnalysisSubmit.months = getMonthBetween(setDate, new Date());
    this.energyAnalysisSubmit.years = getYearBetween(setDate, new Date());
  }

  // 时间范围选择器改变事件
  selectedTimeValue(time, type: timeSelectTypeEnum) {
    if (time.some((item) => item == null) || time.length === 0) { return; }
    if (type === timeSelectTypeEnum.day) {
      if (time.every((item) => item == null)) { return (this.energyAnalysisSubmit.days = []); }
      this.energyAnalysisSubmit.days = getDateDayFormate(time[0], time[1]);
    } else if (type === timeSelectTypeEnum.month) {
      if (time.every((item) => item == null)) { return (this.energyAnalysisSubmit.months = []); }
      this.energyAnalysisSubmit.months = getMonthBetween(time[0], time[1]);
    } else if (type === timeSelectTypeEnum.year) {
      if (time.every((item) => item == null)) { return (this.energyAnalysisSubmit.years = []); }
      this.energyAnalysisSubmit.years = getYearBetween(time[0], time[1]);
    }
    this.EchartsAnalysis();
  }

  // 分析
  EchartsAnalysis() {
    const getSubmitParams: EnergyAnalysisQueryDataModel = _.cloneDeep(this.energyAnalysisSubmit);
    const getSearchData = _.cloneDeep(this.searchContainer);
    getSubmitParams.scope = getSearchData.scope;
    getSubmitParams.areaIds = this.searchContainer.areaIds;
    if (this.searchContainer.scope === statictisRangeTypeEnum.statisticsProject) {
      getSubmitParams.projects = this.searchContainer.projects
      delete getSubmitParams.areaIds;
    } else if (this.searchContainer.scope === statictisRangeTypeEnum.statisticsRegion) {
      delete getSubmitParams.projects;
    }
    // return
    this.btnLoading = true;
    this.dayEchartsFlag = false;
    this.monthEchartsFlag = false;
    this.yearEchartsFlag = false;
    this.$energyApiService.queryEnergyAnalysisData_API(getSubmitParams).subscribe(
      (result) => {
        this.btnLoading = false;
        if (result.code === ResultCodeEnum.success) {
          const { daysMap, monthsMap, yearsMap } = result.data;
          console.log(result.data, 'result.data');
          if (daysMap) {
            this.dayEchartsFlag = true;
            const getRankMap = this.rankDataBYDate(daysMap);
            this.init_Echarts(getRankMap, timeSelectTypeEnum.day);
          } else { this.dayEchartsFlag = false; }

          if (monthsMap) {
            this.monthEchartsFlag = true;
            const getRankMap = this.rankDataBYDate(monthsMap);
            this.init_Echarts(getRankMap, timeSelectTypeEnum.month);
          } else { this.monthEchartsFlag = false; }

          if (yearsMap) {
            this.yearEchartsFlag = true;
            const getRankMap = this.rankDataBYDate(yearsMap);
            this.init_Echarts(getRankMap, timeSelectTypeEnum.year);
          } else { this.yearEchartsFlag = false; }
        }
      },
      (error) => (this.btnLoading = false),
    );
  }
  /** 初始化 Echarts */
  init_Echarts(params: object, type: timeSelectTypeEnum) {
    const xData = [],
      legendData = [],
      series = [],
      saveData = [];
    let loopIndex = -1;
    // 首先 确定X轴的数据
    if (type === timeSelectTypeEnum.day) {
      let time = 0;
      while (time < 24) {
        saveData.push(time);
        time++;
        if (time % 4 === 0) {
          xData.push(`${time > 10 ? time : `0${time}`}: 00`);
        } else if (time === 1) {
          xData.push(`01: 00`);
        } else {
          xData.push('');
        }
      }
    } else if (type === timeSelectTypeEnum.month) {
      let time = 1;
      while (time <= 31) {
        if ((time - 1) % 5 === 0) {
          xData.push(time);
        } else {
          xData.push('');
        }
        saveData.push(time);
        time++;
      }
    } else if (type === timeSelectTypeEnum.year) {
      let time = 1;
      while (time <= 12) {
        xData.push(time);
        time++;
      }
    }
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        loopIndex++;
        const element = params[key];
        legendData.push(key);
        series.push({
          name: key,
          type: 'line',
          data: [],
        });
        // 说明有数据
        if (Object.keys(element).length) {
          for (const elementKey in element) {
            if (type === timeSelectTypeEnum.year) {
              // series[loopIndex].data.push(element[elementKey].toFixed(2));
              let forData = xData;
              forData.forEach(() => {
                series[loopIndex].data.push('');
              });
              series[loopIndex].data.splice((+elementKey - 1),1,element[elementKey].toFixed(2))
            } else {
              let forData = xData;
              if (type === timeSelectTypeEnum.day || type === timeSelectTypeEnum.month) {
                forData = saveData;
              }
              forData.forEach(() => {
                series[loopIndex].data.push('');
              });
              const getFindIndex = forData.findIndex((item) => item === +elementKey);
              // 说明后台返回了对应的时间数据
              if (getFindIndex !== -1) {
                series[loopIndex].data[getFindIndex] = element[elementKey].toFixed(2);
              }
            }
          }
        }
      }
    }
    if (type === timeSelectTypeEnum.day) {
      const tooltip = {
        trigger: 'axis',
        confine:true,
        // tslint:disable-next-line: no-shadowed-variable
        formatter: (params, ticket, callback) => {
          let html = '';
          params.forEach((paramItem) => {
            html += `${paramItem.marker}<span>${paramItem.seriesName}</span> <span>${
              paramItem.dataIndex + 1
            }:00</span>:<span> ${paramItem.data}(kW·h)</span><br/>`;
          });
          return html;
        },
      };
      setTimeout(() =>
        this.DayChartInstance.setOption(
          EnergyEchartUtil.setLineEchartOption(xData, legendData, series, 90, tooltip),
        ),
      );
    } else if (type === timeSelectTypeEnum.month) {
      const tooltip = {
        trigger: 'axis',
        confine:true,
        // tslint:disable-next-line: no-shadowed-variable
        formatter: (params, ticket, callback) => {
          let html = '';
          params.forEach((paramItem) => {
            html += `${paramItem.marker}<span>${paramItem.seriesName}</span>-<span>${
              paramItem.dataIndex + 1
            }</span>:<span> ${paramItem.data} (kW·h)</span><br/>`;
          });
          return html;
        },
      };
      setTimeout(() =>
        this.MonthChartInstance.setOption(
          EnergyEchartUtil.setLineEchartOption(xData, legendData, series, 0, tooltip),
        ),
      );
    } else if (type === timeSelectTypeEnum.year) {
      setTimeout(() =>
        this.YearChartInstance.setOption(
          EnergyEchartUtil.setLineEchartOption(xData, legendData, series, 0, false),
        ),
      );
    }
  }

  /** 将返回的数据 按照日期大小排序 */
  rankDataBYDate(params) {
    const getArray = Object.keys(params);
    const setArray = getArray.sort(
      (a, b) => Number(a.replace(/-/g, '')) - Number(b.replace(/-/g, '')),
    );
    const rankMap = {};
    setArray.forEach((item) => {
      rankMap[item] = params[item];
    });
    return rankMap;
  }
  // Ecahrts 图表 日能耗
  getDayChartInstance(event) {
    this.DayChartInstance = event;
  }
  // Ecahrts 图表 月能耗
  getMonthChartInstance(event) {
    this.MonthChartInstance = event;
  }

  // Ecahrts 图表 年能耗
  getYearChartInstance(event) {
    this.YearChartInstance = event;
  }

  // 重置
  EchartsResetBtn() {
    this.dayEchartsFlag = false;
    this.monthEchartsFlag = false;
    this.yearEchartsFlag = false;
  }
}
