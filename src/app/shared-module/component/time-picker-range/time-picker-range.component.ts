import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../enum/language.enum';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../util/common-util';
import * as lodash from 'lodash';

@Component({
  selector: 'app-time-picker-range',
  templateUrl: './time-picker-range.component.html',
  styleUrls: ['./time-picker-range.component.scss']
})
export class TimePickerRangeComponent implements OnInit {
  /** 自由控制没有确认按钮*/
  @Input()
  freeControl: boolean = false;
  /** 时间格式化*/
  @Input() format: string = 'HH:mm:ss';
  /** 点击确定按钮事件*/
  @Output() confirmTimeRange = new EventEmitter<number[]>();
  /** 开始时间*/
  public startTime: Date = null;
  /** 结束时间*/
  public endTime: Date = null;
  /** 公共国际化*/
  public commonLanguage: CommonLanguageInterface;
  /** 时间选择框默认打开的选择*/
  public defaultOpenValue: Date = new Date(0, 0, 0, 0, 0, 0);
  /** 由于time-picker openChange会触发两次所以使用防抖*/
  public handleOpenChange = lodash.debounce((event) => {
    if (this.freeControl && !event) {
      this.handleFreeControlData();
    }
  }, 200);

  constructor(public $nzI18n: NzI18nService,
              private $message: FiLinkModalService) {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  @Input() set timeRange(value: number[]) {
    if (value && value.length) {
      this.startTime = value[0] ? new Date(value[0]) : null;
      this.endTime = value[1] ? new Date(value[1]) : null;
    }
  }

  ngOnInit(): void {

  }

  /**
   * 选择值变化事件
   * param data
   */
  public handleModelChange(data: Date): void {
    if (this.freeControl) {
      if (data === null) {
        this.handleFreeControlData();
      }
    }

  }

  /**
   * 点击确认按钮发送时间
   */
  public confirmTime() {
    if (!(this.startTime && this.endTime)) {
      this.$message.warning(this.commonLanguage.pleaseInputTime);
      return;
    }
    const startTime = new Date(`2020-01-01 ${CommonUtil.dateFmt(this.format.toLowerCase(), this.startTime)}`);
    const endTime = new Date(`2020-01-01 ${CommonUtil.dateFmt(this.format.toLowerCase(), this.endTime)}`);
    if (startTime >= endTime) {
      this.$message.warning(this.commonLanguage.timeRangeErrorTip);
      return;
    }
    this.confirmTimeRange.emit([startTime.getTime(), endTime.getTime()]);
  }

  /**
   * 开始时间禁用小时选择的方法
   */
  disabledStartHours = () => {
    if (this.endTime) {
      return this.getTimeNumberList(this.endTime.getHours(), 24);
    } else {
      return [];
    }
  };

  /**
   * 结束时间禁用小时选择的方法
   */
  disabledEndHours = () => {
    if (this.startTime) {
      return this.getTimeNumberList(0, this.startTime.getHours());
    } else {
      return [];
    }
  };

  /**
   * 开始时间禁用分钟选择的方法
   * param hour
   */
  disabledStartMinutes = (hour: number) => {
    if (this.endTime) {
      if (this.endTime.getHours() === hour) {
        return this.getTimeNumberList(this.endTime.getMinutes(), 59);
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  /**
   * 结束时间禁用分钟选择的方法
   * param hour
   */
  disabledEndMinutes = (hour: number) => {
    if (this.startTime) {
      if (this.startTime.getHours() === hour) {
        return this.getTimeNumberList(0, this.startTime.getMinutes() + 1);
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  /**
   * 自由控制组件返回值处理
   */
  private handleFreeControlData(): void {
    if (this.startTime && this.endTime) {
      const startTime = new Date(`2020-01-01 ${CommonUtil.dateFmt(this.format.toLowerCase(), this.startTime)}`);
      const endTime = new Date(`2020-01-01 ${CommonUtil.dateFmt(this.format.toLowerCase(), this.endTime)}`);
      if (startTime >= endTime) {
        Promise.resolve().then(() => {
          this.endTime = null;
        });
        this.$message.warning(this.commonLanguage.timeRangeErrorTip);
        return;
      }
      this.confirmTimeRange.emit([startTime.getTime(), endTime.getTime()]);
    } else if (!this.startTime && !this.endTime) {
      this.confirmTimeRange.emit([null, null]);
    } else {
      if (this.startTime) {
        const startTime = new Date(`2020-01-01 ${CommonUtil.dateFmt(this.format.toLowerCase(), this.startTime)}`);
        this.confirmTimeRange.emit([startTime.getTime(), null]);
      }
      if (this.endTime) {
        const endTime = new Date(`2020-01-01 ${CommonUtil.dateFmt(this.format.toLowerCase(), this.endTime)}`);
        this.confirmTimeRange.emit([null, endTime.getTime()]);
      }
    }
  }

  /**
   * 获取时间的数字集合
   * param start
   * param end
   */
  private getTimeNumberList(start, end): number[] {
    const arr = [];
    for (let i = start; i < end; i++) {
      arr.push(i);
    }
    return arr;
  }

  /**
   * 比较开始时间和结束时间的大小
   */
  private judgeTimeIsValid() {
    const startHour = this.startTime.getHours();
    const endHour = this.endTime.getHours();
    const startMinute = this.startTime.getMinutes();
    const endMinute = this.endTime.getMinutes();
    const startSecond = this.startTime.getSeconds();
    const endSecond = this.endTime.getSeconds();
    /**
    if (startHour > endHour) {
      return false;
    } else if (startHour === endHour && startMinute >= endMinute) {
      return false;
    } else if (this.format === 'HH:mm:ss' && startHour === endHour && startMinute === endMinute && startSecond >= endSecond) {
      return false;
    }
     */
    return !((startHour > endHour) || (startHour === endHour && startMinute >= endMinute) ||
      (this.format === 'HH:mm:ss' && startHour === endHour && startMinute === endMinute && startSecond >= endSecond));
  }
}
