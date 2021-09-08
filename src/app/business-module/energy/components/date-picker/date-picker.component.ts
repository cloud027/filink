import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import _ from 'lodash';

import {timeSelectTypeEnum} from '../../share/enum/energy-config.enum';
import {NzI18nService} from 'ng-zorro-antd';

import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {EnergyLanguageInterface} from '../../../../../assets/i18n/energy/energy.language.interface';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  constructor(private $nzI18n: NzI18nService, public $message: FiLinkModalService) {
  }

  /**
   * 传递的选择器类型
   * 时分秒 time
   * 天 day
   * 月 month
   * 年 year
   */
  @Input() pickType: timeSelectTypeEnum;

  /** 判断是否需要默认的时间的类型 默认 null 都不需要 */
  @Input() needDefaultTimeType: timeSelectTypeEnum;
  /** 设置时间限制的间隔 默认不限制*/
  @Input() datePickDisabled: number;

  @Output() selectedTimeValue = new EventEmitter<any>();

  timeSelectType = timeSelectTypeEnum;
  // 时分秒
  timeStartTime;
  timeEndTime;
  /** 用来存储时分秒的数据 */
  saveTime: any[] = [];
  // 日期选择
  dataPicker;

  // 月份----------------------------------
  startMonthValue: Date | null = null;
  endMonthValue: Date | null = null;
  endMonthOpen: boolean = false;
  // 月份----------------------------------

  // 年份-----------------------------------------
  startYearValue: Date | null = null;
  endYearValue: Date | null = null;
  endYearOpen: boolean = false;
  // 年份-----------------------------------------

  language: EnergyLanguageInterface;
  disabledStartMonth = (startValue: Date): boolean => {
    if (!startValue || !this.endMonthValue) {
      return false;
    }
    if (startValue.getTime() > this.endMonthValue.getTime()) {
      return true;
    }
    if (
      this.endMonthValue.getTime() -
      startValue.setMonth(startValue.getMonth() + this.datePickDisabled) >=
      0
    ) {
      return true;
    }
    return false;
  };
  disabledEndMonth = (endValue: Date): boolean => {
    if (!endValue || !this.startMonthValue) {
      return false;
    }
    if (endValue.getTime() < this.startMonthValue.getTime()) {
      return true;
    }
    if (
      endValue.setMonth(endValue.getMonth() - this.datePickDisabled) -
      this.startMonthValue.getTime() >=
      0
    ) {
      return true;
    } else {
      return false;
    }
  };
  disabledStartYear = (startValue: Date): boolean => {
    if (!startValue || !this.endYearValue) {
      return false;
    }
    if (startValue.getTime() > this.endYearValue.getTime()) {
      return true;
    }
    if (
      this.endYearValue.getTime() -
      startValue.setFullYear(startValue.getFullYear() + this.datePickDisabled) >=
      0
    ) {
      return true;
    } else {
      return false;
    }
  };
  disabledEndYear = (endValue: Date): boolean => {
    if (!endValue || !this.startYearValue) {
      return false;
    }
    if (endValue.getTime() < this.startYearValue.getTime()) {
      return true;
    }
    if (
      endValue.setFullYear(endValue.getFullYear() - this.datePickDisabled) -
      this.startYearValue.getTime() >=
      0
    ) {
      return true;
    } else {
      return false;
    }
  };

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);

    this.init_timeSelect();
  }

  /** 初始化 判断哪些时间选择器需要设置默认的时间 */
  init_timeSelect() {
    const getDateTime = new Date();
    const getYear = getDateTime.getFullYear();
    const getMonth = getDateTime.getMonth() + 1;
    const getDay = getDateTime.getDate();
    let Day;
    if (getDay < 3) {
      Day = '01';
    } else {
      Day = getDay;
    }
    switch (this.needDefaultTimeType) {
      case timeSelectTypeEnum.time:
        break;
      case timeSelectTypeEnum.day:
        const startTime = this.datePickDisabled
          ? new Date(`${getYear}-${getMonth}-${Day}`)
          : new Date(`${getYear}-${getMonth}-01`);
        const endTime = this.datePickDisabled
          ? new Date(`${getYear}-${getMonth}-${Day}`)
          : getDateTime;
        const setDayValue = ['7', '7'];
        this.dataPicker = setDayValue;
        break;
      case timeSelectTypeEnum.month:
        const getTimeMonth: any = new Date(`${getYear}-${getMonth}`);
        this.startMonthValue = getTimeMonth;
        this.endMonthValue = getTimeMonth;
        break;
      case timeSelectTypeEnum.year:
        const getTimeYear: any = new Date(`${getYear}`);
        this.startYearValue = getTimeYear;
        this.endYearValue = getTimeYear;
        break;

      default:
        break;
    }
  }

  // 时分秒修改器
  onTimeChange(result: number[]) {
    this.saveTime = result;
    this.selectedTimeValue.emit(result);
  }

  // 日期选择修改器
  dataPickerChange(value) {
    if (value.length === 0) {
      return this.selectedTimeValue.emit([null, null]);
    }
    if (this.datePickDisabled) {
      const getStartTime: Date = value[0];
      const getEndTime: Date = value[1];
      if (
        new Date(getEndTime).getDate() - new Date(getStartTime).getDate() >=
        this.datePickDisabled
      ) {
        return this.$message.warning(
          `${this.language.picInfo.selectTimeDisabled} ${this.datePickDisabled} ${this.language.picInfo.day}`,
        );
      }
    }
    this.selectedTimeValue.emit(value);
  }

  /** 月份选择 年份选择 器 */
  onModelChange(value, type) {
    if (type === timeSelectTypeEnum.month) {
      if (value === null) {
        this.startMonthValue = null;
        this.endMonthValue = null;
        this.selectedTimeValue.emit([null, null]);
        return;
      }
      this.monthPickerChange();
    } else if (type === timeSelectTypeEnum.year) {
      if (value === null) {
        this.startYearValue = null;
        this.endYearValue = null;
        this.selectedTimeValue.emit([null, null]);
        return;
      }
      this.yearPickerChange();
    }
  }

  // 月份
  monthPickerChange() {
    if (this.startMonthValue && this.endMonthValue) {
      this.selectedTimeValue.emit([this.startMonthValue, this.endMonthValue]);
    } else {
      if (this.startMonthValue) {
        this.selectedTimeValue.emit([this.startMonthValue, null]);
      }
      if (this.endMonthValue) {
        this.selectedTimeValue.emit([null, this.endMonthValue]);
      }
    }
  }

  // 年份
  yearPickerChange() {
    if (this.startYearValue && this.endYearValue) {
      this.selectedTimeValue.emit([this.startYearValue, this.endYearValue]);
    } else {
      if (this.startYearValue) {
        this.selectedTimeValue.emit([this.startYearValue, null]);
      }
      if (this.endYearValue) {
        this.selectedTimeValue.emit([null, this.endYearValue]);
      }
    }
  }

  // 开始日期选择器
  onStartChange(value, type) {
    if (type === timeSelectTypeEnum.month) {
      this.startMonthValue = value;
    } else if (type === timeSelectTypeEnum.year) {
      this.startYearValue = value;
    }
    this.selectedTimeValue.emit(value);
  }

  /**
   * 结束日期选择器
   */
  onEndChange(value, type) {
    if (type === timeSelectTypeEnum.month) {
      this.endMonthValue = value;
    } else if (type === timeSelectTypeEnum.year) {
      this.endYearValue = value;
    }
    this.selectedTimeValue.emit(value);
  }

  handleStartOpenChange(open, type) {
    if (!open) {
      if (type === timeSelectTypeEnum.month) {
        return (this.endMonthOpen = true);
      }
      if (type === timeSelectTypeEnum.year) {
        return (this.endYearOpen = true);
      }
    }
  }

  handleEndOpenChange(open, type) {
    if (type === timeSelectTypeEnum.month) {
      return (this.endMonthOpen = open);
    }
    if (type === timeSelectTypeEnum.year) {
      return (this.endYearOpen = open);
    }
  }

  resetAllValue() {
    this.dataPicker = null;
    this.startMonthValue = null;
    this.endMonthValue = null;
    this.startYearValue = null;
    this.endYearValue = null;
  }
}
