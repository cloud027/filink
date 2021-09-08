import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InspectionLanguageInterface} from '../../../../assets/i18n/inspection-task/inspection.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../enum/language.enum';
import {AlarmLanguageInterface} from '../../../../assets/i18n/alarm/alarm-language.interface';
import {WorkOrderLanguageInterface} from '../../../../assets/i18n/work-order/work-order.language.interface';
import {WorkOrderAlarmLevelColor} from '../../../core-module/enum/trouble/trouble-common.enum';
import {CommonUtil} from '../../util/common-util';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {AlarmConfirmStatusEnum} from '../../../core-module/enum/alarm/alarm-confirm-status.enum';
import {AlarmCleanStatusEnum} from '../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmStoreService} from '../../../core-module/store/alarm.store.service';
import {AlarmForCommonUtil} from '../../../core-module/business-util/alarm/alarm-for-common.util';

/**
 * 关联告警弹窗组件
 */
@Component({
  selector: 'app-relevance-alarm',
  templateUrl: './relevance-alarm.component.html',
  styleUrls: ['./relevance-alarm.component.scss']
})
export class RelevanceAlarmComponent implements OnInit {

  // 传入的参数
  @Input() public modalData;
  // 显示
  @Input() public xcVisible: boolean;
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<any>();
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<any>();
  public inspectionLanguage: InspectionLanguageInterface;
  public workOrderLanguage: WorkOrderLanguageInterface;
  public alarmLanguage: AlarmLanguageInterface;
  public deviceTypeName: string;

  constructor(
      public $alarmStoreService: AlarmStoreService,
      private $Nz18n: NzI18nService,
  ) {}

  ngOnInit() {
    this.inspectionLanguage = this.$Nz18n.getLocaleData(LanguageEnum.inspection);
    this.alarmLanguage = this.$Nz18n.getLocaleData(LanguageEnum.alarm);
    this.workOrderLanguage = this.$Nz18n.getLocaleData(LanguageEnum.workOrder);
    for (const key in this.modalData) {
      if (key && !this.modalData[key]) {
        this.modalData[key] = '';
      }
    }
    // 告警名称
    const alName = AlarmForCommonUtil.translateAlarmNameByCode(this.$Nz18n, this.modalData.alarmCode);
    if (alName) {
      this.modalData.alarmName = alName;
    }
    // 清除状态
    const clearName = this.getIconClass(this.modalData.alarmCleanStatus, AlarmCleanStatusEnum);
    this.modalData.alarmCleanColor = clearName;
    this.modalData.alarmCleanStatus = this.alarmLanguage[clearName];
    // 告警等级
    const levelName = this.getIconClass(this.modalData.alarmFixedLevel, WorkOrderAlarmLevelColor);
    this.modalData.alarmLevelColor = this.$alarmStoreService.getAlarmColorByLevel(this.modalData.alarmFixedLevel);
    this.modalData.alarmLevelStatus = this.alarmLanguage[levelName];
    // 确认状态
    const confirmName = this.getIconClass(this.modalData.alarmConfirmStatus, AlarmConfirmStatusEnum);
    this.modalData.alarmConfirmColor = confirmName;
    this.modalData.alarmConfirmStatus = this.alarmLanguage[confirmName];
    if (this.modalData.alarmHappenCount) {
      this.modalData.fontSize = this.setFontSize(this.modalData.alarmHappenCount);
    }
    // 持续时间
    this.modalData.alarmContinuedTimeString = CommonUtil.setAlarmContinousTime(this.modalData.alarmBeginTime, this.modalData.alarmCleanTime,
      {month: this.alarmLanguage.month, day: this.alarmLanguage.day, hour: this.alarmLanguage.hour});
    // 设施
    /*this.modalData.deviceTypeName = getDevicesName(this.modalData.alarmDeviceTypeId, this.inspectionLanguage);*/
    this.modalData.deviceTypeName = FacilityForCommonUtil.translateDeviceType(this.$Nz18n, this.modalData.alarmDeviceTypeId);
    this.modalData.deviceTypeClass = CommonUtil.getFacilityIconClassName(this.modalData.alarmDeviceTypeId);
    // 设备
    this.modalData.equipmentList = [];
    this.modalData.equipmentTypeName = '';
    const code = this.modalData.alarmSourceTypeId;
    if (this.modalData.alarmSourceTypeId) {
      const arr = code.split(',');
      const names = [];
      for (let k = 0; k < arr.length; k++) {
        const name = FacilityForCommonUtil.translateEquipmentType(this.$Nz18n, arr[k]);
        if (name && name.length > 0) {
          this.modalData.equipmentList.push({
            iconClass: CommonUtil.getEquipmentIconClassName(arr[k]),
            name: name
          });
          names.push(name);
        }
      }
      this.modalData.equipmentTypeName = names.join(',');
    }
  }

  /**
   * 关闭
   */
  public handleClose(): void {
    this.selectDataChange.emit(false);
    this.xcVisible = false;
  }

  /**
   * 设置字体大小
   */
  private setFontSize(text) {
    const countLength = (text.toString()).length;
    let fontSize = 0;
    if (countLength > 4) {
      fontSize = 16;
    } else if (countLength > 2) {
      fontSize = 22;
    } else {
      fontSize = 28;
    }
    return fontSize;
  }

  /**
   * 获取class
   */
  private getIconClass(code, enums) {
    if (code) {
      for (const key in enums) {
        if (key && enums[key] === code) {
          return key;
        }
      }
    } else {
      return '';
    }
  }
}
