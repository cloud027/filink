import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import _ from 'lodash';

import { NzI18nService } from 'ng-zorro-antd';

import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { EnergyLanguageInterface } from '../../../../../../assets/i18n/energy/energy.language.interface';
import { EnergyEchartUtil } from '../../../share/utils/chart-util';

import {
  energyStatisticsTime,
  statictisRangeTypeEnum,
  StatisticRankTypeEnum,
  StatisticORRankEnum,
} from '../../../share/enum/energy-config.enum';
import { CommonUtil } from '../../../../../shared-module/util/common-util';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { EnergyApiService } from '../../../share/service/energy/energy-api.service';
import {
  EnergyStatisticsQueryDataModel,
  TimeSelectValueModel,
} from '../../../share/model/energy-statistic-query-data.model';
import { getDateDayFormate, getMonthBetween, getHoursBetween } from '../../../share/utils/tool.util';
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component';

@Component({
  selector: 'app-nodes-statistic',
  templateUrl: './nodes-statistic.component.html',
  styleUrls: ['./nodes-statistic.component.scss'],
})
export class NodesStatisticComponent implements OnInit, OnDestroy {
  @ViewChild('rankDatePicker') rankDatePicker: DatePickerComponent;

  /** 需要传递的节点id */
  @Input() nodeEquipmentId;

  /** 年月日选择器的判断 */
  frequency: energyStatisticsTime = energyStatisticsTime.statisticsHour;
  statisticsSubmitForm: EnergyStatisticsQueryDataModel = new EnergyStatisticsQueryDataModel();
  /** 时间选择器绑定的数据 */
  selectTimeValue: Date = new Date();
  // 统计的时间范围下拉框数组
  statisticsSelectTimeList: any = [];
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

  /** 传递的时间 */
  startTime: any = {};
  endTime: any = {};

  language: EnergyLanguageInterface;
  constructor(private $nzI18n: NzI18nService, private $energyApiService: EnergyApiService) {
    this.statisticsSelectTimeList = CommonUtil.codeTranslate(
      energyStatisticsTime,
      $nzI18n,
      null,
      'energy.config',
    );
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
    this.statistical();
  }
  ngOnDestroy() {
    this.rankDatePicker = null;
  }
  /** 日月年 选择器改变事件 */
  selectTimeChange(value: energyStatisticsTime) {
    this.frequency = value;
    this.timeSelectChange();
  }

  /** 时间范围选择器改变事件 */
  timeSelectChange() {
    this.statistical();
  }
  /** 统计 */
  statistical() {
    const getTime = this.setTime();
    const params = {
      nodeEquipmentId: this.nodeEquipmentId,
      scope: 3,
      frequency: this.frequency,
      ...getTime[0],
      ...getTime[1],
    };
    this.$energyApiService.queryEnergyStatisticData_API(params).subscribe(
      (result) => {
        this.btnLoading = false;
        if (result.code === ResultCodeEnum.success) {
          console.log(result.data, 'data');
          this.setChartData(result.data);
          this.statisticFlag = true;
        }
      },
      (error) => (this.btnLoading = false),
    );
  }
  /** 用来设置传递数据的时间格式 */
  setTime() {
    const getTime = new Date(this.selectTimeValue);
    this.startTime.day = this.endTime.day = getTime.getDate();
    this.startTime.month = this.endTime.month = getTime.getMonth() + 1;
    this.startTime.year = this.endTime.year = getTime.getFullYear();
    if (this.frequency === energyStatisticsTime.statisticsHour) {
      this.startTime.hour = 0;
      this.endTime.hour = 23;
      return [
        {
          startHour: this.startTime,
        },
        {
          endHour: this.endTime,
        },
      ];
    } else if (this.frequency === energyStatisticsTime.statisticsDay) {
      this.startTime.day = 1;
      this.endTime.day = new Date(getTime.getFullYear(), getTime.getMonth() + 1, 0).getDate();
      return [
        {
          startDay: this.startTime,
        },
        {
          endDay: this.endTime,
        },
      ];
    } else if (this.frequency === energyStatisticsTime.statisticsMonth) {
      delete this.startTime.day;
      delete this.endTime.day;
      this.startTime.month = 1;
      this.endTime.year = this.startTime.year = getTime.getFullYear();
      this.endTime.month = 12;
      return [
        {
          startMonth: this.startTime,
        },
        {
          endMonth: this.endTime,
        },
      ];
    }
  }

  // Ecahrts 图表 时间段区域
  getTimeSlotChartInstance(event) {
    this.TimeSlotChartInstance = event;
  }
  // 初始化Ecahrts
  setChartData(params: Array<any>) {
    this.statisticFlag = true;
    let series,
      xData = [],
      legendData;
    if (this.frequency === energyStatisticsTime.statisticsHour) {
      let time = 0;
      while (time < 24) {
        time++;
        if (time === 1) {
          xData.push(`01: 00`);
        } else {
          xData.push(`${time >= 10 ? time : `0${time}`}: 00`);
        }
      }
    } else if (this.frequency === energyStatisticsTime.statisticsDay) {
      xData = getDateDayFormate(
        new Date(this.startTime.year, this.startTime.month - 1, this.startTime.day),
        new Date(this.endTime.year, this.endTime.month - 1, this.endTime.day),
      );
    } else if (this.frequency === energyStatisticsTime.statisticsMonth) {
      xData = getMonthBetween(
        new Date().setMonth(this.startTime.month - 1),
        new Date().setMonth(this.endTime.month - 1),
      );
    }

    legendData = [this.language.energyConsumption];
    series = [
      {
        name: this.language.energyConsumption,
        type: 'line',
        data: [],
      },
    ];
    if (params.length) {
      // 首先全部填充
      xData.forEach(() => {
        series[0].data.push('');
      });
      // 天
      if (this.frequency === energyStatisticsTime.statisticsHour) {
        xData.forEach((dateItem) => {
          let time = 0;
          if (dateItem.startsWith('0')) {
            time = +dateItem.substr(1, 1);
          } else {
            time = +dateItem.substr(0, 2);
          }
          time = time - 1;
          // 如果 后台返回的时间和取到的时间相等 就将数据填充,不然就是默认值0
          const getParamTime = params.find((paramItem) => time === +paramItem.axis);
          if (getParamTime) {
            series[0].data[time] = getParamTime.energyConsumption.toFixed(2);
          }
        });
      } else if (this.frequency === energyStatisticsTime.statisticsDay) {
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
          }
        });
      } else if (this.frequency === energyStatisticsTime.statisticsMonth) {
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
          }
        });
      }
    }
    // 时间段区域
    setTimeout(() =>
      this.TimeSlotChartInstance.setOption(
        EnergyEchartUtil.setLineEchartOption(xData, legendData, series, 90),
      ),
    );
  }
}
