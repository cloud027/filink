import {Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {CommonUtil} from '../../util/common-util';
import {DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../../core-module/enum/equipment/equipment.enum';

/**
 * 多选下来框 图片管理使用
 */
@Component({
  selector: 'check-select-input',
  templateUrl: './check-select-input.component.html',
  styleUrls: ['./check-select-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckSelectInputComponent),
      multi: true
    }
  ]
})
export class CheckSelectInputComponent implements OnInit, ControlValueAccessor, OnChanges {
  // 占位符
  @Input() placeholder: string;
  // 是否全选
  @Input() isAllChecked: boolean = false;
  // 选中列表
  @Input() checkList: Array<Option>;
  // 是否是设备类型
  @Input() isEquipment: boolean = false;
  // 选择变化事件
  @Output() checkChange = new EventEmitter<any>();
  // 是否展开
  public isCollapsed: boolean = true;
  // 已选择数据
  public checkedList: Array<Option> = [];
  // 选择数据名称展示
  public _checkedStr = '';
  // 全选状态
  public checkAllStatus = false;
  // 是否全部禁用
  public allDisable = false;
  // 是否显示清除
  public isShowClear = true;
  @Input() isTrouble = false;
  // 国际化
  public language: FacilityLanguageInterface;
  onModelChange: Function = () => {
  }

  constructor(public $nzI18n: NzI18nService) {
    this.language = $nzI18n.getLocaleData('facility');
  }

  ngOnInit() {
    this.placeholder = this.placeholder || this.language.picInfo.facilityType;
    if (this.isEquipment) {
      this.checkedList = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n) as any[];
    } else {
      this.checkedList = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n) as any[];
    }
  }

  get checkedStr(): any {
    return this._checkedStr;
  }

  set checkedStr(v: any) {
    this._checkedStr = v;
    this.onModelChange(this.checkedList);
  }

  /**
   * 给自定义组件赋值时调用
   * param value
   */
  public writeValue(value: Array<any>): void {
    if (value && value.length) {
      this.checkedList = value;
      this.checkList.forEach(item => {
        (value.filter(el => el.label === item.label)).length > 0 ? item.checked = true : item.checked = false;
      });
      this.checkItem();
    } else {
      this.checkedList = [];
    }
  }

  /**
   * 勾选事件
   * param obj
   */
  public checkItem(obj?: Option): void {
    if (obj) {
      this.checkedList = this.checkList.map(item => {
        if (item.value === obj.value) {
          item.checked = !obj.checked;
        }
        return item;
      });
    }
    if (this.isAllChecked) {
      if (this.checkList.filter(item => !item.isDisable).length !== 0) {
        this.checkAllStatus = this.checkList.filter(item => !item.isDisable).every(item => item.checked);
      }
    } else {
      this.checkAllStatus = false;
    }
    this.checkedList = this.checkList.filter(item => item.checked);
    const arr = this.checkedList.map(item => item.label);
    this.checkedStr = arr.join('，');
    this.checkChange.emit();
  }

  /**
   * 全选事件
   * param event
   */
  public allChecked(event): void {
    this.checkList.filter(item => !item.isDisable).forEach(item => {
      item.checked = event;
    });
    this.checkedList = this.checkList.filter(item => item.checked);
    const arr = this.checkedList.map(item => item.label);
    this.checkedStr = arr.join('，');
    this.checkChange.emit();
  }

  /**
   * 注册onchange事件
   * param fn
   */
  public registerOnChange(fn: any) {
    this.onModelChange = fn;
  }

  /**
   * 注册 onTouched事件
   * param fn
   */
  public registerOnTouched(fn: any) {
  }

  /**
   * 清除数据
   */
  clearData(): void {
    this.checkedStr = '';
    this.checkAllStatus = false;
    if (this.checkList.length > 0) {
      this.checkList.forEach(item => item.checked = false);
    }
    this.checkedList = [];
    this.onModelChange(this.checkedList);
    this.checkChange.emit(true);
  }
  // 监听表单数据变化
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.checkList && this.isTrouble) {
      this.clearData();
    }
  }
}

export interface Option {
  label: string;
  value: any;
  checked?: boolean;
  isDisable?: boolean;
}
