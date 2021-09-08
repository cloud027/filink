import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {AlarmListModel} from '../../../../../core-module/model/alarm/alarm-list.model';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {TroubleUtil} from '../../../../../core-module/business-util/trouble/trouble-util';
import {AlarmUtil} from '../../../share/util/alarm.util';
import {AlarmPathEnum} from '../../../share/enum/alarm.enum';
import { AlarmForCommonUtil } from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import { AlarmCleanStatusEnum } from '../../../../../core-module/enum/alarm/alarm-clean-status.enum';
import { AlarmConfirmStatusEnum } from '../../../../../core-module/enum/alarm/alarm-confirm-status.enum';
import { AlarmForCommonService } from '../../../../../core-module/api-service';
import {PageTypeEnum} from '../../../../../core-module/enum/alarm/alarm-page-type.enum';
import { FacilityForCommonUtil } from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';


/**
 * 告警诊断详情
 */
@Component({
  selector: 'app-alarm-diagnose',
  templateUrl: './diagnose-details.component.html',
  styleUrls: ['./diagnose-details.component.scss']
})
export class DiagnoseDetailsComponent implements OnInit {
  @ViewChild('alarmImg') alarmImg: TemplateRef<any>;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 页面操作类型
  public pageType: PageTypeEnum = PageTypeEnum.alarm;
  // 区域ID
  public areaId: string;
  // 告警ID
  public alarmId: string;
  // 告警code
  public alarmCode: string;
  // 告警设施ID
  public alarmDeviceId: string;
  // 告警名称
  public alarmName: string;
  // 告警信息
  public alarmInfo: AlarmListModel = new AlarmListModel();
  // 是否加载动画
  public ifSpin: boolean = false;
  // 是否完成
  public isFinish: boolean = false;

  constructor(
    public $alarmStoreService: AlarmStoreService,
    public $nzI18n: NzI18nService,
    public $alarmCommonService: AlarmForCommonService,
    private $active: ActivatedRoute,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.$active.queryParams.subscribe(params => {
      this.pageType = params.type;
      this.alarmId = params.alarmId;
    });
    this.queryCurrentAlarm();
  }
  /**
   * 获取列表详情数据,根据列表数据中的状态控制已处理和误判按钮
   */
  public queryCurrentAlarm(): void {
    this.ifSpin = true;
    // 当前告警
    let urlPath = AlarmPathEnum.alarmCurrent;
    if (this.pageType === PageTypeEnum.history) {
      // 历史告警
      urlPath = AlarmPathEnum.alarmHistory;
    }
    this.$alarmCommonService[urlPath](this.alarmId).subscribe((result: ResultModel<AlarmListModel>) => {
      if (result.code === 0) {
        const resultData = result.data;
        this.alarmInfo = resultData;
        // 等级
        this.alarmInfo.alarmLeaveName = AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, resultData.alarmFixedLevel);
        this.alarmInfo.alarmLeaveClass = this.$alarmStoreService.getAlarmColorByLevel(resultData.alarmFixedLevel);
        // 清除状态
        this.alarmInfo.alarmCleanStatusName = AlarmForCommonUtil.translateAlarmCleanStatus(this.$nzI18n, resultData.alarmCleanStatus);
        this.alarmInfo.alarmCleanStatusClass = TroubleUtil.getColorName(resultData.alarmCleanStatus, AlarmCleanStatusEnum);
        // 确认状态
        this.alarmInfo.alarmConfirmStatusName = AlarmForCommonUtil.translateAlarmConfirmStatus(this.$nzI18n, resultData.alarmConfirmStatus);
        this.alarmInfo.alarmConfirmStatusClass = TroubleUtil.getColorName(resultData.alarmConfirmStatus, AlarmConfirmStatusEnum);
        // 告警持续时间
          this.alarmInfo.alarmContinousTime = CommonUtil.setAlarmContinousTime(resultData.alarmBeginTime, resultData.alarmCleanTime,
            {month: this.language.month, day: this.language.day, hour: this.language.hour});
        // 设施类型
        if (resultData.alarmDeviceTypeId) {
          this.alarmInfo.deviceTypeName = FacilityForCommonUtil.translateDeviceType(this.$nzI18n, resultData.alarmDeviceTypeId);
          this.alarmInfo.deviceTypeIcon = CommonUtil.getFacilityIconClassName(resultData.alarmDeviceTypeId);
        } else {
          this.alarmInfo.deviceTypeName = '';
        }
        // 设备
        if (resultData.alarmSourceTypeId) {
          this.alarmInfo.equipmentName = FacilityForCommonUtil.translateEquipmentType(this.$nzI18n, resultData.alarmSourceTypeId);
          this.alarmInfo.equipmentIcon = CommonUtil.getEquipmentIconClassName(resultData.alarmSourceTypeId);
        }
        if (resultData.alarmHappenCount) {
            this.alarmInfo.fontSize = AlarmForCommonUtil.setFontSize(resultData.alarmHappenCount);
        }
        if (resultData.alarmProcesseStatus) {
           this.alarmInfo.alarmProcesseStatus = AlarmUtil.translateProcessesStatus(this.$nzI18n, resultData.alarmProcesseStatus);
        }
        this.areaId = resultData.areaId;
        this.alarmCode = resultData.alarmCode;
        this.alarmName = resultData.alarmName;
        this.alarmDeviceId = resultData.alarmDeviceId;
        this.ifSpin = false;
        this.isFinish = true;
      }
    });
  }
}
