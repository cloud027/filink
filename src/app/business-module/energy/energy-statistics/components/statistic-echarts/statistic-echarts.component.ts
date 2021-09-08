import {Component, Input, OnInit, Output, EventEmitter, ViewChild, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import _ from 'lodash';

import {NzI18nService} from 'ng-zorro-antd';

import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {EnergyLanguageInterface} from '../../../../../../assets/i18n/energy/energy.language.interface';
import {EnergyEchartUtil} from '../../../share/utils/chart-util';

import {
  energyStatisticsTime,
  statictisRangeTypeEnum,
  StatisticRankTypeEnum,
  StatisticORRankEnum,
} from '../../../share/enum/energy-config.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {EnergyApiService} from '../../../share/service/energy/energy-api.service';
import {
  EnergyStatisticsQueryDataModel,
  TimeSelectValueModel,
} from '../../../share/model/energy-statistic-query-data.model';
import {getDateDayFormate, getMonthBetween, getHoursBetween} from '../../../share/utils/tool.util';
import {DatePickerComponent} from '../../../components/date-picker/date-picker.component';

@Component({
  selector: 'app-statistic-echarts',
  templateUrl: './statistic-echarts.component.html',
  styleUrls: ['./statistic-echarts.component.scss'],
})
export class StatisticEchartsComponent implements OnInit, OnDestroy {
  @ViewChild('rankDatePicker') rankDatePicker: DatePickerComponent;
  /** 搜索条件 */
  @Input() searchContainer: EnergyStatisticsQueryDataModel;
  @Output() statisticRankData = new EventEmitter();

  /** 能耗统计 的 form */
  statisticsSubmitForm: EnergyStatisticsQueryDataModel = new EnergyStatisticsQueryDataModel();

  /** 统计排名 的form */
  statisticRankForm: EnergyStatisticsQueryDataModel = new EnergyStatisticsQueryDataModel();

  // 统计的时间范围下拉框数组
  statisticsSelectTimeList: any = [];

  /** 判断是否是第一次进入页面 */
  public isFirstPage: boolean = true;

  /** 得到时间选择器选择的时间 */
  getSelectedTime: Date;
  selectFlag: boolean = true;

  // 日期选择器 联动-------------
  energyStatisticsTime = energyStatisticsTime;
  // 统计范围枚举
  statictisRangeType = statictisRangeTypeEnum;
  // 保存时间选择器的数据
  saveTimeSelectData;

  // 统计按钮
  btnLoading: boolean = false;

  // 时间段区域
  TimeSlotChartInstance;
  statisticFlag: boolean = false;
  // 电费排名
  ElectricityTariffRankChartInstance;
  rankFlag: boolean = false;

  /** 存储 能耗统计 时间选择器的 数据 */
  statisticTimeDate: TimeSelectValueModel[] = [];
  /** 存储 统计排名 时间选择器的 数据 */
  rankTimeDate: TimeSelectValueModel[] = [];

  /** 判断是 能耗统计 还是 排名统计 */
  StatisticORRank = StatisticORRankEnum;
  language: EnergyLanguageInterface;

  constructor(
    private $nzI18n: NzI18nService,
    private router: Router,
    private $energyApiService: EnergyApiService,
  ) {
    this.statisticsSelectTimeList = CommonUtil.codeTranslate(
      energyStatisticsTime,
      $nzI18n,
      null,
      'energy.config',
    );
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
  }

  ngOnDestroy() {
    this.rankDatePicker = null;
  }

  /** 日月年 选择器改变事件 */
  selectTimeChange(value: energyStatisticsTime, range: StatisticORRankEnum) {
    this.timeSelectChange(this.getSelectedTime, value, range);
  }

  /** 时间范围选择器改变事件 */
  timeSelectChange(timeValue: any, timeType: energyStatisticsTime, range: StatisticORRankEnum) {
    this.getSelectedTime = timeValue;
    // 能耗统计
    if (range === StatisticORRankEnum.statistic) {
      if (timeType === energyStatisticsTime.statisticsHour) {
        this.statisticsSubmitForm.statictisHoursData(timeValue);
        if (!timeValue) {
          return this.statisticsSubmitForm.statictisHoursData(null);
        }
      } else if (timeType === energyStatisticsTime.statisticsDay) {
        this.statisticsSubmitForm.statictisDayData(timeValue);
        if (!timeValue) {
          this.statisticsSubmitForm.statictisDayData(null);
          return;
        }
      } else if (timeType === energyStatisticsTime.statisticsMonth) {
        this.statisticsSubmitForm.statictisMonthData(timeValue);
        if (!timeValue) {
          return this.statisticsSubmitForm.statictisMonthData(null);
        }
      }
    } else if (range === StatisticORRankEnum.rank) {
      if (timeType === energyStatisticsTime.statisticsHour) {
        this.statisticRankForm.statictisHoursData(timeValue);
        if (!timeValue) {
          return this.statisticRankForm.statictisHoursData(null);
        }
      } else if (timeType === energyStatisticsTime.statisticsDay) {
        this.statisticRankForm.statictisDayData(timeValue);
        if (!timeValue) {
          return this.statisticRankForm.statictisDayData(null);
        }
      } else if (timeType === energyStatisticsTime.statisticsMonth) {
        this.statisticRankForm.statictisMonthData(timeValue);
        if (!timeValue) {
          return this.statisticRankForm.statictisMonthData(null);
        }
      }
    }
    this.statistical(range);
  }

  /** 神仙代码,用来判断 时间选择器是否有数据 */
  public timeSelectISValue(): boolean {
    if (
      this.statisticsSubmitForm.frequency === energyStatisticsTime.statisticsHour &&
      !!this.statisticsSubmitForm.startHour.year === false
    ) {
      return false;
    } else if (
      this.statisticsSubmitForm.frequency === energyStatisticsTime.statisticsDay &&
      !!this.statisticsSubmitForm.startDay.year === false
    ) {
      return false;
    } else if (
      this.statisticsSubmitForm.frequency === energyStatisticsTime.statisticsMonth &&
      !!this.statisticsSubmitForm.startMonth.year === false
    ) {
      return false;
    } else if (
      this.statisticRankForm.frequency === energyStatisticsTime.statisticsHour &&
      !!this.statisticRankForm.startHour.year === false
    ) {
      return false;
    } else if (
      this.statisticRankForm.frequency === energyStatisticsTime.statisticsDay &&
      !!this.statisticRankForm.startHour.year === false
    ) {
      return false;
    } else if (
      this.statisticRankForm.frequency === energyStatisticsTime.statisticsMonth &&
      !!this.statisticRankForm.startHour.year === false
    ) {
      return false;
    } else {
      return true;
    }
  }

  /** 重置按钮 */
  resetBtn() {
    this.statisticFlag = false;
    this.rankFlag = false;
  }

  // 统计按钮
  statistical(
    type: StatisticORRankEnum = null,
    rank: StatisticRankTypeEnum = StatisticRankTypeEnum.asc,
  ) {
    const getForm: EnergyStatisticsQueryDataModel = _.cloneDeep(this.statisticsSubmitForm);
    const getRankForm: EnergyStatisticsQueryDataModel = _.cloneDeep(this.statisticRankForm);
    getRankForm.areaIds = getForm.areaIds = this.searchContainer.areaIds;
    getRankForm.rank = getForm.rank = rank;
    getRankForm.scope = getForm.scope = this.searchContainer.scope;
    // if (
    //     this.statisticsSubmitForm.frequency === energyStatisticsTime.statisticsHour ||
    //     this.statisticRankForm.frequency === energyStatisticsTime.statisticsHour
    // ) {
    //     delete getForm.startDay
    //     delete getForm.endDay
    //     delete getForm.startMonth
    //     delete getForm.endMonth

    //     delete getRankForm.startDay
    //     delete getRankForm.endDay
    //     delete getRankForm.startMonth
    //     delete getRankForm.endMonth
    // }
    if (
      this.statisticsSubmitForm.frequency === energyStatisticsTime.statisticsDay ||
      this.statisticRankForm.frequency === energyStatisticsTime.statisticsDay
    ) {
      if (this.isFirstPage) {
        const getDateTime = new Date();
        this.getSelectedTime = new Date();
        getForm.endDay.year = getForm.startDay.year = getDateTime.getFullYear();
        getForm.endDay.month = getForm.startDay.month = getDateTime.getMonth() + 1;
        getForm.startDay.day = 1;
        getForm.endDay.day = new Date(
          getDateTime.getFullYear(),
          getDateTime.getMonth() + 1,
          0,
        ).getDate();
        this.statisticsSubmitForm.initTime(getDateTime);
        this.statisticRankForm.initTime(getDateTime);

        this.statisticsSubmitForm.selectTimeValue = getDateTime;
        this.statisticRankForm.selectTimeValue = getDateTime;
      }
      // delete getForm.startHour
      // delete getForm.endHour
      // delete getForm.startMonth
      // delete getForm.endMonth

      // delete getRankForm.startHour
      // delete getRankForm.endHour
      // delete getRankForm.startMonth
      // delete getRankForm.endMonth
    }
    // if (this.statisticsSubmitForm.frequency === energyStatisticsTime.statisticsMonth ||
    //     this.statisticRankForm.frequency === energyStatisticsTime.statisticsMonth) {
    //     delete getForm.startDay
    //     delete getForm.endDay
    //     delete getForm.startHour
    //     delete getForm.endHour

    //     delete getRankForm.startDay
    //     delete getRankForm.endDay
    //     delete getRankForm.startHour
    //     delete getRankForm.endHour
    // }
    if (this.searchContainer.scope === statictisRangeTypeEnum.statisticsProject) {
      getForm.projects = this.searchContainer.projects
      getRankForm.projects = this.searchContainer.projects

      delete getForm.areaIds;
      delete getRankForm.areaIds;
    }
    if (this.searchContainer.scope === statictisRangeTypeEnum.statisticsRegion) {
      delete getForm.projects;
      delete getRankForm.projects;
    }

    // return
    this.btnLoading = true;
    if (!type) {
      this.StatisticData(getForm);
      this.RankByCondition(this.isFirstPage ? getForm : getRankForm);
      this.isFirstPage = false;
    } else if (type === StatisticORRankEnum.statistic) {
      this.StatisticData(getForm);
    } else if (type === StatisticORRankEnum.rank) {
      this.RankByCondition(getRankForm);
    }
  }

  /** 能耗统计 */
  StatisticData(params) {
    this.statisticFlag = false;
    this.$energyApiService.queryEnergyStatisticData_API(params).subscribe(
      (result) => {
        this.btnLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.setChartData(result.data);
          this.statisticFlag = true;
        }
      },
      (error) => (this.btnLoading = false),
    );
  }

  /** 统计排名 */
  RankByCondition(params) {
    this.rankFlag = false;
    this.$energyApiService.queryEnergyRankByCondition_API(params).subscribe(
      (result) => {
        this.btnLoading = false;
        if (result.code === ResultCodeEnum.success) {
          let getData: any[] = [];
          getData = CommonUtil.deepClone(result.data);
          if (getData.length > 0) {
            getData.forEach((item) => {
              item.energyConsumption = item.energyConsumption.toFixed(2);
              item.energyTarget = item.energyTarget.toFixed(2);
              item.percent = item.percent.toFixed(2);
              item.saveEnergyPercent = item.saveEnergyPercent.toFixed(2);
            });
          }
          this.statisticRankData.emit(getData);
          if (result.data.length > 0) {
            let resData = [];
            if (result.data.length > 10) {
              resData = result.data.slice(0, 10);
            } else {
              resData = result.data;
            }
            this.rankFlag = true;
            const xData = [];
            const legendData = [this.language.proportion, this.language.energyConsumption];
            const series = [
              {
                name: this.language.proportion,
                type: 'bar',
                data: [],
              },
              {
                name: this.language.energyConsumption,
                type: 'bar',
                data: [],
              },
            ];
            resData.forEach((item) => {
              series[0].data.push(item.percent.toFixed(2));
              series[1].data.push(item.energyConsumption.toFixed(2));
              xData.push(item.axis);
            });
            setTimeout(() => {
              this.ElectricityTariffRankChartInstance.setOption(
                this.setBarChartOption(xData, legendData, series),
              );
            });
          } else {
            this.rankFlag = false;
          }
        }
      },
      (error) => (this.btnLoading = false),
    );
  }

  // 电费策略按钮
  powerRateBtn() {
    this.router.navigateByUrl('/business/energy/energy-statistics/electric-strategy');
  }

  // 初始化Ecahrts
  setChartData(params: Array<any>) {
    this.statisticFlag = true;
    let series, xData: string[], legendData;
    if (this.statisticsSubmitForm.frequency === energyStatisticsTime.statisticsHour) {
      xData = getHoursBetween(
        new Date().setHours(this.statisticsSubmitForm.startHour.hour),
        new Date().setHours(this.statisticsSubmitForm.endHour.hour),
      );
    }
    if (this.statisticsSubmitForm.frequency === energyStatisticsTime.statisticsDay) {
      xData = getDateDayFormate(
        new Date(
          this.statisticsSubmitForm.startDay.year,
          this.statisticsSubmitForm.startDay.month - 1,
          this.statisticsSubmitForm.startDay.day,
        ),
        new Date(
          this.statisticsSubmitForm.endDay.year,
          this.statisticsSubmitForm.endDay.month - 1,
          this.statisticsSubmitForm.endDay.day,
        ),
      );
    }
    if (this.statisticsSubmitForm.frequency === energyStatisticsTime.statisticsMonth) {
      xData = getMonthBetween(
        new Date().setMonth(this.statisticsSubmitForm.startMonth.month - 1),
        new Date().setMonth(this.statisticsSubmitForm.endMonth.month - 1),
      );
    }
    legendData = [
      this.language.energyConsumption,
      this.language.energyTarget,
      this.language.saveEnergyPercent,
    ];
    series = [
      {
        name: this.language.energyConsumption,
        type: 'bar',
        barGap: 0.1,
        data: [],
      },
      {
        name: this.language.energyTarget,
        type: 'bar',
        data: [],
      },
      {
        name: this.language.saveEnergyPercent,
        type: 'line',
        data: [],
      },
    ];
    if (params.length > 0) {
      // 天
      if (this.statisticsSubmitForm.frequency === energyStatisticsTime.statisticsHour) {
        // 首先全部填充为零
        xData.forEach(() => {
          series[0].data.push(0);
        });
        xData.forEach((dateItem) => {
          let time = 0;
          if (dateItem.startsWith('0')) {
            time = +dateItem.substr(1, 1);
          } else {
            time = +dateItem.substr(0, 2);
          }
          // 如果 后台返回的时间和取到的时间相等 就将数据填充,不然就是默认值0
          // tslint:disable-next-line: triple-equals
          const getParamTime = params.find((paramItem) => time == paramItem.axis);
          if (getParamTime) {
            series[0].data[time] = getParamTime.energyConsumption.toFixed(2);
            series[1].data[time] = getParamTime.energyTarget.toFixed(2);
            series[2].data[time] = getParamTime.saveEnergyPercent.toFixed(2);
          }
        });
      } else if (this.statisticsSubmitForm.frequency === energyStatisticsTime.statisticsDay) {
        // 首先全部填充为零
        xData.forEach(() => {
          series[0].data.push(0);
        });
        xData.forEach((dateItem) => {
          let time = 0;
          const getDay = dateItem.substr(dateItem.length - 2, 2);
          if (getDay.startsWith('0')) {
            time = +getDay.substr(1, 1);
          } else {
            time = +getDay.substr(0, 2);
          }
          // 如果 后台返回的时间和取到的时间相等 就将数据填充,不然就是默认值0
          // tslint:disable-next-line: triple-equals
          const getParamTime = params.find((paramItem) => time == paramItem.axis);
          if (getParamTime) {
            series[0].data[time - 1] = getParamTime.energyConsumption.toFixed(2);
            series[1].data[time - 1] = getParamTime.energyTarget.toFixed(2);
            series[2].data[time - 1] = getParamTime.saveEnergyPercent.toFixed(2);
          }
        });
      } else if (this.statisticsSubmitForm.frequency === energyStatisticsTime.statisticsMonth) {
        // 首先全部填充为零
        xData.forEach(() => {
          series[0].data.push(0);
        });
        xData.forEach((dateItem) => {
          let time = 0;
          const getDay = dateItem.substr(dateItem.length - 2, 2);
          if (getDay.startsWith('0')) {
            time = +getDay.substr(1, 1);
          } else {
            time = +getDay.substr(0, 2);
          }
          // 如果 后台返回的时间和取到的时间相等 就将数据填充,不然就是默认值0
          // tslint:disable-next-line: triple-equals
          const getParamTime = params.find((paramItem) => time == paramItem.axis);
          if (getParamTime) {
            series[0].data[time - 1] = getParamTime.energyConsumption.toFixed(2);
            series[1].data[time - 1] = getParamTime.energyTarget.toFixed(2);
            series[2].data[time - 1] = getParamTime.saveEnergyPercent.toFixed(2);
          }
        });
      }
    }
    // 时间段区域
    setTimeout(() =>
      this.TimeSlotChartInstance.setOption(
        EnergyEchartUtil.setBarChartOption(xData, legendData, series, false),
      ),
    );
  }

  // Ecahrts 图表 时间段区域
  getTimeSlotChartInstance(event) {
    this.TimeSlotChartInstance = event;
  }

  // Ecahrts 图表 电费排名
  getElectricityTariffRankChartInstance(event) {
    this.ElectricityTariffRankChartInstance = event;
  }

  /** 统计排名 调用的 Echarts */
  setBarChartOption(xData, legendData, series) {
    const option = {
      toolbox: {
        feature: {
          // 升序
          myToolAscendOrder: {
            show: true,
            title: this.language.ascendingOrder,
            icon:
            // tslint:disable-next-line: max-line-length
              'path://M767.808 149.12l170.624 213.312h-128v469.376a42.688 42.688 0 1 1-85.312 0V362.432h-128l170.688-213.312zM554.432 831.808a42.688 42.688 0 0 1-42.624 42.624h-384a42.688 42.688 0 1 1 0-85.312h384c23.552 0 42.624 19.072 42.624 42.688z m0-298.688a42.688 42.688 0 0 1-42.624 42.688h-384a42.688 42.688 0 0 1 0-85.376h384c23.552 0 42.624 19.136 42.624 42.688zM469.12 234.432a42.688 42.688 0 0 1-42.688 42.688H127.808a42.688 42.688 0 1 1 0-85.312h298.624c23.616 0 42.688 19.072 42.688 42.624z',
            onclick: () => {
              this.statistical(StatisticORRankEnum.rank, StatisticRankTypeEnum.asc);
            },
          },
          // 降序
          myTooldescendOrder: {
            show: true,
            title: this.language.descendingOrder,
            icon:
            // tslint:disable-next-line: max-line-length
              'path://M810.432 191.808v469.312h128l-170.624 213.312L597.12 661.12h128V191.808a42.688 42.688 0 1 1 85.312 0zM469.12 789.12a42.688 42.688 0 0 1-42.688 42.688H127.808a42.688 42.688 0 0 1 0-85.376h298.624c23.616 0 42.688 19.136 42.688 42.688z m85.312-298.688a42.688 42.688 0 0 1-42.624 42.688h-384a42.688 42.688 0 1 1 0-85.312h384c23.552 0 42.624 19.072 42.624 42.624z m0-298.624a42.688 42.688 0 0 1-42.624 42.624h-384a42.688 42.688 0 1 1 0-85.312h384c23.552 0 42.624 19.072 42.624 42.688z',
            onclick: () => {
              this.statistical(StatisticORRankEnum.rank, StatisticRankTypeEnum.desc);
            },
          },
          saveAsImage: {
            title: this.language.save,
            icon:
            // tslint:disable-next-line: max-line-length
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
          margin: 8,
          formatter: function (params) {
            let val = "";
            if (params.length > 4) {
              val = params.substr(0, 8) + '...';
              return val;
            } else {
              return params;
            }
          }
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
