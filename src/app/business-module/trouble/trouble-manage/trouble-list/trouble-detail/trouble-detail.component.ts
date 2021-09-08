import {Component, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import { FaultLanguageInterface } from '../../../../../../assets/i18n/fault/fault-language.interface';
import {ActivatedRoute} from '@angular/router';
import {Result} from '../../../../../shared-module/entity/result';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {TroubleUtil} from '../../../../../core-module/business-util/trouble/trouble-util';
import {HandleStatusClassEnum, HandleStatusEnum} from '../../../../../core-module/enum/trouble/trouble-common.enum';
import {TroubleForCommonService} from '../../../../../core-module/api-service/trouble';
import {TroubleModel} from '../../../../../core-module/model/trouble/trouble.model';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {LanguageTypeEnum} from '../../../../../core-module/enum/language-type.enum';
/**
 * 故障详情
 */
@Component({
  selector: 'app-trouble-detail',
  templateUrl: './trouble-detail.component.html',
  styleUrls: ['./trouble-detail.component.scss']
})
export class TroubleDetailComponent implements OnInit {
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 故障基本信息
  public troubleInfo: TroubleModel = new TroubleModel();
  public ifSpin: boolean = false;
  // 标题
  public title: string = '';
  // 故障id
  public troubleId: string;
  // 是否展示弹出框
  public isShow: boolean = false;
  // 故障处理状态
  public handleStatus: string;
  // 流程节点
  public flowId: string;
  // 流程实例id
  public instanceId: string;
  // 流程名称
  public currentHandleProgress: string;
  // 故障来源
  public troubleSource: string;
  // 告警code
  public alarmCode: string;
  // 区域code
  public areaCode: string;
  // procId
  public procId: string;
  // 是否显示基本操作
  public isShowOperate: boolean = true;

  constructor(
    public $alarmStoreService: AlarmStoreService,
    private $nzI18n: NzI18nService,
    private $troubleService: TroubleForCommonService,
    private $message: FiLinkModalService,
    private $active: ActivatedRoute,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.title = this.language.troubleDetail;
    this.$active.queryParams.subscribe(params => {
      this.troubleId = params.id;
      this.refreshData(params.id);
    });
  }

  /**
   * 获取故障详情
   */
  private refreshData(id: string): void {
    this.ifSpin = true;
    const lang = localStorage.getItem('localId');
    this.$troubleService.queryTroubleDetail(id).subscribe((res: Result) => {
      if (res.code === ResultCodeEnum.success) {
        this.ifSpin = false;
        this.troubleInfo = res.data;
        if (lang === LanguageTypeEnum.en && (res.data.handleStatus === HandleStatusEnum.commit || res.data.handleStatus === HandleStatusEnum.processing)) {
          this.isShowOperate = false;
        }
        // 状态
        this.troubleInfo.handleStatusName = TroubleUtil.translateHandleStatus(this.$nzI18n, res.data.handleStatus);
        this.troubleInfo.handleStatusIcon = HandleStatusClassEnum[this.troubleInfo.handleStatus];
        // 等级
        this.troubleInfo.troubleLevelName = AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, res.data.troubleLevel);
        this.troubleInfo.troubleLevelClass = this.$alarmStoreService.getAlarmColorByLevel(this.troubleInfo.troubleLevel);
        // 设施类型
        this.troubleInfo.deviceTypeIcon = CommonUtil.getFacilityIconClassName(res.data.deviceType);
        this.troubleInfo.deviceTypeName = FacilityForCommonUtil.translateDeviceType(this.$nzI18n, res.data.deviceType);
        // 设备类型
        if (res.data.equipment && res.data.equipment.length > 0) {
          const resultEquipmentData = TroubleUtil.getEquipmentArr(this.language.config, res.data.equipment);
          this.troubleInfo.equipmentTypeNames = resultEquipmentData.resultNames.join(',');
          this.troubleInfo.equipmentTypeArr = resultEquipmentData.resultInfo;
        }
        this.troubleInfo.currentHandleProgress = res.data.currentHandleProgress;
        // 故障来源
        this.troubleInfo.troubleSourceName = TroubleUtil.translateTroubleSource(this.$nzI18n, res.data.troubleSource);
        // 发生时间
        this.troubleInfo.happenTime = res.data.happenTime ? res.data.happenTime : '';
        // 处理时间
        this.troubleInfo.handleTime = res.data.handleTime ? res.data.handleTime : '';
        this.flowId = res.data.progessNodeId;
        this.handleStatus = res.data.handleStatus;
        this.instanceId = res.data.instanceId;
        this.currentHandleProgress = res.data.currentHandleProgress;
        this.troubleSource = res.data.troubleSource;
        this.areaCode = res.data.areaCode;
        this.procId = res.data.proc ? res.data.proc.procId : '';
        this.isShow = true;
      }
    }, (res) => {
      this.ifSpin = false;
      this.$message.success(res.msg);
    });
  }
}
