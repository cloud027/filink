import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {TableConfigModel} from '../../../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../../../shared-module/model/page.model';
import {QueryConditionModel} from '../../../../../../shared-module/model/query-condition.model';
import {WorkOrderLanguageInterface} from '../../../../../../../assets/i18n/work-order/work-order.language.interface';
import {FaultLanguageInterface} from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {InspectionLanguageInterface} from '../../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {AlarmService} from '../../../../share/service/alarm.service';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {AlarmStoreService} from '../../../../../../core-module/store/alarm.store.service';
import {SelectModel} from '../../../../../../shared-module/model/select.model';
import {TroubleModel} from '../../../../../../core-module/model/trouble/trouble.model';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {ClearBarrierWorkOrderModel} from '../../../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {HandleStatusClassEnum, HandleStatusEnum} from '../../../../../../core-module/enum/trouble/trouble-common.enum';
import {TroubleUtil} from '../../../../../../core-module/business-util/trouble/trouble-util';
import {AlarmTurnTroubleService} from '../../../../../../core-module/mission/alarm-turn-trouble.service';
import {WorkOrderStatusClassEnum, WorkOrderStatusEnum} from '../../../../../../core-module/enum/work-order/work-order.enum';
import {TroubleToolService} from '../../../../../../core-module/api-service/trouble/trouble-tool.service';
import {EquipmentTypeEnum} from '../../../../../../core-module/enum/equipment/equipment.enum';
import {DeviceTypeEnum} from '../../../../../../core-module/enum/facility/facility.enum';
import {AlarmLevelEnum} from '../../../../../../core-module/enum/alarm/alarm-level.enum';
import {CloseStatusEnum, IsTurnTroubleEnum, SelectedIndexEnum} from '../../../../share/enum/alarm.enum';
import {SessionUtil} from '../../../../../../shared-module/util/session-util';
import {TroubleRoleEnum} from '../../../../../../core-module/enum/alarm/trouble-role.enum';

declare const $: any;
/**
 * 告警诊断详情-转派信息
 */
@Component({
  selector: 'app-redeploy-info',
  templateUrl: './redeploy-info.component.html',
  styleUrls: ['./redeploy-info.component.scss']
})
export class RedeployInfoComponent implements OnInit {
  @Input() alarmId: string;
  // 是否刷新销账工单
  @Input() reloadClearBarrierData: boolean = false;
  // 设施类型
  @Input() deviceType: string;
  // 处理状态
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // 故障级别模板
  @ViewChild('troubleLevelTemp') troubleLevelTemp: TemplateRef<any>;
  // 故障设备模板
  @ViewChild('troubleEquipment') troubleEquipment: TemplateRef<any>;
  // 故障处理状态
  @ViewChild('handleStatusTemp') handleStatusTemp: TemplateRef<any>;
  // 设施类型
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<any>;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  public workLanguage: WorkOrderLanguageInterface;
  public TroubleLanguage: FaultLanguageInterface;
  public InspectionLanguage: InspectionLanguageInterface; // 国际化
  public commonLanguage: CommonLanguageInterface;
  // 销障工单
  public eliminateData: ClearBarrierWorkOrderModel[] = [];
  // 故障
  public troubleData: TroubleModel[] = [];
  // 销障工单分页
  public eliminatePageBean: PageModel = new PageModel();
  // 故障分页
  public troublePageBean: PageModel = new PageModel();
  // 销障工单配置
  public eliminateTableConfig: TableConfigModel;
  // 故障配置
  public troubleTableConfig: TableConfigModel;
  // 是否可转故障
  public isTurnTrouble: IsTurnTroubleEnum = IsTurnTroubleEnum.canTurn;
  // 当前tab展示
  public selectIndex: SelectedIndexEnum = SelectedIndexEnum.confirmOrder;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 告警级别枚举
  public alarmLevelEnum = AlarmLevelEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 处理状态枚举
  public handleStatusEnum = HandleStatusEnum;
  // 故障列表权限
  public troubleListRole: boolean;
  // 故障新增权限
  public addTroubleRole: boolean;
  // 是否电子锁
  public electronicLock: boolean;
  // 控制故障tab展示
  public troubleTableShow: boolean = false;
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 故障类型
  private troubleTypeList: SelectModel[] = [];

  constructor(
    private $nzI18n: NzI18nService,
    private $troubleToolService: TroubleToolService,
    private $alarmStoreService: AlarmStoreService,
    private $alarmService: AlarmService,
    private $alarmTurnTroubleService: AlarmTurnTroubleService,
  ) {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.workLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.TroubleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.fault);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  public ngOnInit(): void {
    // 故障列表权限
    this.troubleListRole = SessionUtil.checkHasRole(TroubleRoleEnum.troubleList);
    // 新增故障权限
    this.addTroubleRole = SessionUtil.checkHasRole(TroubleRoleEnum.addTrouble);
    // 所有电子锁相关的设施类型
    const filterDeviceType = TroubleUtil.filterDeviceType();
    this.electronicLock = filterDeviceType.includes(this.deviceType);
    if ((this.troubleListRole || this.addTroubleRole) && this.electronicLock) {
      this.troubleTableShow = true;
    }
    // 销障工单列表
    this.initEliminateTableConfig();
    // 故障列表
    this.initTroubleTableConfig();
    // 刷新数据
    this.refreshData();
    this.$alarmTurnTroubleService.eventEmit.subscribe((value: SelectedIndexEnum) => {
      // 刷新故障列表
      this.selectIndex = value;
      this.getTroubleData();
    });
    this.$alarmTurnTroubleService.reloadClearBarrierEmit.subscribe((isShow: boolean) => {
      // 刷新工单列表
      if (isShow) {
        this.selectIndex = SelectedIndexEnum.confirmOrder;
        this.getWorkData();
      }
    });
  }

  /**
   * 销障工单
   */
  public getWorkData(): void {
    this.$alarmService.eliminateAlarmWork(this.alarmId).subscribe((res) => {
      if (res.code === ResultCodeEnum.success) {
        let isProgress: boolean = false;
        if (res.data.length > 0) {
          this.eliminateData = res.data.map(item => {
            item.statusName = this.getStatusName(item.status);
            item.statusClass = this.getStatusClass(item.status);
            if (item.closed === CloseStatusEnum.isClose) {
              isProgress = true;
            }
            item.equipClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
            item.deviceClass = CommonUtil.getFacilityIconClassName(item.deviceType);
            return item;
          });
        }
        // 传递工单的数据
        if (this.eliminateData && this.eliminateData.length > 0) {
          this.$alarmTurnTroubleService.turnOrderEmit.emit(this.eliminateData[0].procId);
        }
        // 控制是否可进行再次点击
        this.$alarmTurnTroubleService.showClearBarrierEmit.emit(isProgress);
      }
    }, () => {
    });
  }

  /**
   * 故障类型
   */
  public getTroubleType(): void {
    if ((this.troubleListRole || this.addTroubleRole) && this.electronicLock) {
      this.$troubleToolService.getTroubleTypeList().then((data: SelectModel[]) => {
        this.troubleTypeList = data;
      });
    }
  }

  /**
   * 故障数据
   */
  public getTroubleData(): void {
    if ((this.troubleListRole || this.addTroubleRole) && this.electronicLock) {
      this.$alarmService.getTroubleList(this.alarmId).subscribe((res) => {
        this.eliminateTableConfig.isLoading = false;
        if (res.code === ResultCodeEnum.success) {
          this.troubleData = res.data || [];
          this.troubleData = res.data.map(item => {
            item.style = this.$alarmStoreService.getAlarmColorByLevel(item.troubleLevel);
            // 处理状态样式
            item.handleStatusClass = HandleStatusClassEnum[item.handleStatus];
            // 故障来源
            item.troubleSource = TroubleUtil.translateTroubleSource(this.$nzI18n, item.troubleSource);
            // 设备展示
            if (item.equipment && item.equipment.length > 0) {
              const resultEquipmentData = TroubleUtil.getEquipmentArr(this.language.config, item.equipment);
              // 设备名称
              item.equipmentName = resultEquipmentData.resultNames.join(',');
              // 多个设备名称
              item.equipmentTypeArr = resultEquipmentData.resultInfo;
            }
            // 故障类型
            item.troubleType = TroubleUtil.showTroubleTypeInfo(this.troubleTypeList, item.troubleType);
            return item;
          });
          // 当列表有一个未提交或者已提交或者处理中就不可以再转故障
          // 处理状态数组
          const handleStatusArray = [HandleStatusEnum.uncommit , HandleStatusEnum.commit , HandleStatusEnum.processing];
          this.troubleData.forEach(el => {
            if (handleStatusArray.includes(el.handleStatus)) {
              this.isTurnTrouble = IsTurnTroubleEnum.noTurn;
              return;
            }
          });
          this.$alarmTurnTroubleService.troubleEmit.emit(this.isTurnTrouble);
        }
      }, () => {
        this.eliminateTableConfig.isLoading = false;
      });
    }
  }

  /**
   * 工单状态名称
   */
  public getStatusName(status: string): string {
    return this.InspectionLanguage[WorkOrderStatusEnum[status]];
  }

  /**
   * 工单类型小图标
   */
  public getStatusClass(status: string): string {
    return `iconfont icon-fiLink ${WorkOrderStatusClassEnum[status]}`;
  }

  /**
   * 销障工单
   */
  public eliminatePageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }

  /**
   * 故障
   */
  public troublePageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }

  /**
   * 刷新数据
   */
  private refreshData(): void {
    // 销障工单
    this.getWorkData();
    // 故障类型
    this.getTroubleType();
    // 故障数据
    this.getTroubleData();
  }

  /**
   * 销障工单列表配置
   */
  private initEliminateTableConfig(): void {
    const width = ($('.allocation-warp').width() - 100) / 9;
    this.eliminateTableConfig = {
      isDraggable: true,
      isLoading: false,
      showPagination: false,
      bordered: false,
      showSearch: false,
      scroll: {x: '512px', y: '600px'},
      columnConfig: [
        {title: this.workLanguage.name, key: 'title', width: width},
        {
          // 工单状态
          title: this.workLanguage.status, key: 'status',
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        {
          // 设施类型
          title: this.workLanguage.deviceType, key: 'deviceType', width: width,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
        },
        // 设施名称
        {title: this.workLanguage.deviceName, key: 'deviceName', width: width},
        // 所属区域
        {title: this.workLanguage.department, key: 'deviceAreaName', width: width},
        // 设备名称
        {title: this.workLanguage.equipmentName, key: 'equipmentName', width: width},
        {
          // 设备类型
          title: this.workLanguage.equipmentType, key: 'equipmentType', width: width,
          type: 'render',
          renderTemplate: this.equipmentTypeTemp,
        },
        // 责任单位
        {title: this.workLanguage.accountabilityUnitName, key: 'accountabilityDeptName', width: width},
        // 责任人
        {title: this.workLanguage.assignName, key: 'assignName', width: width},
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: []
    };
  }

  /**
   * 故障列表配置
   */
  private initTroubleTableConfig(): void {
    const width = ($('.allocation-warp').width() - 100) / 10;
    this.troubleTableConfig = {
      isDraggable: true,
      isLoading: false,
      showPagination: false,
      bordered: false,
      showSearch: false,
      scroll: {x: '512px', y: '600px'},
      columnConfig: [
        {title: this.TroubleLanguage.troubleCode, key: 'troubleCode', width: width},
        {
          // 状态
          title: this.TroubleLanguage.status, key: 'status', width: width,
          type: 'render',
          renderTemplate: this.handleStatusTemp
        },
        {
          // 故障级别
          title: this.TroubleLanguage.troubleLevel, key: 'troubleLevel', width: width,
          type: 'render',
          renderTemplate: this.troubleLevelTemp
        },
        // 故障类型
        {title: this.TroubleLanguage.troubleType, key: 'troubleType', width: width},
        // 故障来源
        {title: this.TroubleLanguage.troubleSource, key: 'troubleSource', width: width},
        // 故障设施
        {title: this.TroubleLanguage.troubleFacility, key: 'deviceName', width: width},
        {
          // 故障设备
          title: this.TroubleLanguage.troubleEquipment, key: 'troubleEquipment', width: width,
          type: 'render',
          renderTemplate: this.troubleEquipment
        },
        // 故障描述
        {title: this.TroubleLanguage.troubleDescribe, key: 'troubleDescribe', width: width},
        // 责任单位
        {title: this.TroubleLanguage.deptName, key: 'assignDeptName', width: width},
        // 填报人
        {title: this.TroubleLanguage.reportUserName, key: 'reportUserName', width: width},
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: []
    };
  }
}
