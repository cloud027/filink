import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {TroubleModel} from '../../../../../core-module/model/trouble/trouble.model';
import {WorkOrderNodeEnum, WorkOrderNodeShineEnum} from '../../enum/refAlarm-faultt.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {TroubleForCommonService} from '../../../../../core-module/api-service/trouble';
import {HandleStatusClassEnum, WorkOrderAlarmLevelColor} from '../../../../../core-module/enum/trouble/trouble-common.enum';
import {WorkOrderBusinessCommonUtil} from '../../util/work-order-business-common.util';

/**
 * 关联故障弹窗组件
 */
@Component({
  selector: 'app-relevance-fault',
  templateUrl: './relevance-fault.component.html',
  styleUrls: ['./relevance-fault.component.scss']
})
export class RelevanceFaultComponent implements OnInit {

  // 传入的参数
  // 故障id
  @Input() public faultId: string;
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<boolean>();
  // 显示
  public isShowRefFault: boolean;
  // 国际化
  public workOrderLanguage: WorkOrderLanguageInterface;
  public inspectionLanguage: InspectionLanguageInterface;
  public alarmLanguage: AlarmLanguageInterface;
  // 故障数据
  public modalData: TroubleModel;

  constructor(
    private $nzI18n: NzI18nService,
    private $troubleService: TroubleForCommonService,
    private $message: FiLinkModalService,
  ) { }

  public ngOnInit(): void {
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.getFaultData();
  }

  /**
   * 关闭
   */
  public handleClose(): void {
    this.selectDataChange.emit(false);
    this.isShowRefFault = false;
  }

  /**
   * 获取class
   */
  private getFaultIconClass(code: string, enums): string {
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

  /**
   *获取故障数据
   */
  private getFaultData(): void {
    this.$troubleService.queryTroubleDetail(this.faultId).subscribe((result: ResultModel<TroubleModel>) => {
      if (result.code === ResultCodeEnum.success && result.data) {
        if (!result.data.handleTime || result.data.handleTime === 0) {
          result.data.handleTime = null;
        }
        for (const key in result.data) {
          if (key && !result.data[key]) {
            result.data[key] = '';
          }
        }
        this.modalData = result.data;
        this.loadData();
        this.isShowRefFault = true;
      } else {
        this.$message.error(this.workOrderLanguage.noData);
      }
    });
  }

  /**
   * 拼接数据
   */
  private loadData(): void {
    this.modalData.handleStatusName = HandleStatusClassEnum[this.modalData.handleStatus];
    this.modalData.troubleSource = WorkOrderBusinessCommonUtil.getOrderTroubleSource(this.$nzI18n, this.modalData.troubleSource);
    // 故障等级
    const levelName = this.getFaultIconClass(this.modalData.troubleLevel, WorkOrderAlarmLevelColor);
    this.modalData.troubleLevelName = this.alarmLanguage[levelName];
    this.modalData.troubleLevelClass = levelName;
    if (this.modalData.deviceType) {
      this.modalData.deviceTypeClass = CommonUtil.getFacilityIconClassName(this.modalData.deviceType);
    }
    // 获取设备类型名称及设备类型图标
    this.modalData.equipmentTypeNames = '';
    if (this.modalData.equipment && this.modalData.equipment.length > 0) {
      const names = [];
      this.modalData.equipment.forEach(item => {
        names.push(item.equipmentName);
        if (item.equipmentType) {
          item.equipmentTypeClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
        }
      });
      this.modalData.equipmentTypeNames = names.join(',');
    }
    this.modalData.currentNode = '';
    if (this.modalData.handleStatus === 'done' || this.modalData.handleStatus === 'undone') {
      // this.modalData.currentNode = this.inspectionLanguage[this.modalData.handleStatus];
    }
    for (const key in WorkOrderNodeEnum) {
      if (key && WorkOrderNodeEnum[key] === this.modalData.progessNodeId) {
        this.modalData.currentNode = this.workOrderLanguage.node + WorkOrderNodeShineEnum[key];
      }
    }
  }
}
