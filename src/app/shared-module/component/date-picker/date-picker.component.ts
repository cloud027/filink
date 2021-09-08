/**
 * Created by xiaoconghu on 2019/1/15.
 */
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

/**
 * 日期选择器组件
 */
@Component({
  selector: 'xc-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit, OnChanges {
  // 传入值范围
  @Input() rangValue;
  // 选择值变化
  @Output() rangValueChange = new EventEmitter();
  // 开始日期
  public startValue: Date = null;
  // 结束日期
  public endValue: Date = null;
  // 结束日期是否打开
  public endOpen: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.rangValue) {
      if (changes.rangValue.currentValue === undefined || changes.rangValue.currentValue === null) {
        this.startValue = null;
        this.endValue = null;
      }
    }
  }

  /**
   * 禁用开始
   * param {Date} startValue
   * returns {boolean}
   */
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  }
  /**
   * 禁用结束
   * param {Date} endValue
   * returns {boolean}
   */
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  }

  /**
   * 开始日期变化
   * param {Date} date
   */
  public onStartChange(date: Date): void {
    this.startValue = date;
    this.rangValueChange.emit([this.startValue, this.endValue]);
  }
  /**
   * 结束日期变化
   * param {Date} date
   */
  public onEndChange(date: Date): void {
    this.endValue = date;
    this.rangValueChange.emit([this.startValue, this.endValue]);
  }
  /**
   * 开始日期打开
   * param {boolean} open
   */
  public handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }
  /**
   * 结束日期打开
   * param {boolean} open
   */
  public handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }
}
