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
 * ??????????????????-????????????
 */
@Component({
  selector: 'app-redeploy-info',
  templateUrl: './redeploy-info.component.html',
  styleUrls: ['./redeploy-info.component.scss']
})
export class RedeployInfoComponent implements OnInit {
  @Input() alarmId: string;
  // ????????????????????????
  @Input() reloadClearBarrierData: boolean = false;
  // ????????????
  @Input() deviceType: string;
  // ????????????
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('troubleLevelTemp') troubleLevelTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('troubleEquipment') troubleEquipment: TemplateRef<any>;
  // ??????????????????
  @ViewChild('handleStatusTemp') handleStatusTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<any>;
  // ?????????????????????
  public language: AlarmLanguageInterface;
  public workLanguage: WorkOrderLanguageInterface;
  public TroubleLanguage: FaultLanguageInterface;
  public InspectionLanguage: InspectionLanguageInterface; // ?????????
  public commonLanguage: CommonLanguageInterface;
  // ????????????
  public eliminateData: ClearBarrierWorkOrderModel[] = [];
  // ??????
  public troubleData: TroubleModel[] = [];
  // ??????????????????
  public eliminatePageBean: PageModel = new PageModel();
  // ????????????
  public troublePageBean: PageModel = new PageModel();
  // ??????????????????
  public eliminateTableConfig: TableConfigModel;
  // ????????????
  public troubleTableConfig: TableConfigModel;
  // ??????????????????
  public isTurnTrouble: IsTurnTroubleEnum = IsTurnTroubleEnum.canTurn;
  // ??????tab??????
  public selectIndex: SelectedIndexEnum = SelectedIndexEnum.confirmOrder;
  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ??????????????????
  public deviceTypeEnum = DeviceTypeEnum;
  // ??????????????????
  public alarmLevelEnum = AlarmLevelEnum;
  // ???????????????
  public languageEnum = LanguageEnum;
  // ??????????????????
  public handleStatusEnum = HandleStatusEnum;
  // ??????????????????
  public troubleListRole: boolean;
  // ??????????????????
  public addTroubleRole: boolean;
  // ???????????????
  public electronicLock: boolean;
  // ????????????tab??????
  public troubleTableShow: boolean = false;
  // ????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  private troubleTypeList: SelectModel[] = [];

  constructor(
    private $nzI18n: NzI18nService,
    private $troubleToolService: TroubleToolService,
    private $alarmStoreService: AlarmStoreService,
    private $alarmService: AlarmService,
    private $alarmTurnTroubleService: AlarmTurnTroubleService,
  ) {
    // ?????????
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.workLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.TroubleLanguage = this.$nzI18n.getLocaleData(LanguageEnum.fault);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  public ngOnInit(): void {
    // ??????????????????
    this.troubleListRole = SessionUtil.checkHasRole(TroubleRoleEnum.troubleList);
    // ??????????????????
    this.addTroubleRole = SessionUtil.checkHasRole(TroubleRoleEnum.addTrouble);
    // ????????????????????????????????????
    const filterDeviceType = TroubleUtil.filterDeviceType();
    this.electronicLock = filterDeviceType.includes(this.deviceType);
    if ((this.troubleListRole || this.addTroubleRole) && this.electronicLock) {
      this.troubleTableShow = true;
    }
    // ??????????????????
    this.initEliminateTableConfig();
    // ????????????
    this.initTroubleTableConfig();
    // ????????????
    this.refreshData();
    this.$alarmTurnTroubleService.eventEmit.subscribe((value: SelectedIndexEnum) => {
      // ??????????????????
      this.selectIndex = value;
      this.getTroubleData();
    });
    this.$alarmTurnTroubleService.reloadClearBarrierEmit.subscribe((isShow: boolean) => {
      // ??????????????????
      if (isShow) {
        this.selectIndex = SelectedIndexEnum.confirmOrder;
        this.getWorkData();
      }
    });
  }

  /**
   * ????????????
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
        // ?????????????????????
        if (this.eliminateData && this.eliminateData.length > 0) {
          this.$alarmTurnTroubleService.turnOrderEmit.emit(this.eliminateData[0].procId);
        }
        // ?????????????????????????????????
        this.$alarmTurnTroubleService.showClearBarrierEmit.emit(isProgress);
      }
    }, () => {
    });
  }

  /**
   * ????????????
   */
  public getTroubleType(): void {
    if ((this.troubleListRole || this.addTroubleRole) && this.electronicLock) {
      this.$troubleToolService.getTroubleTypeList().then((data: SelectModel[]) => {
        this.troubleTypeList = data;
      });
    }
  }

  /**
   * ????????????
   */
  public getTroubleData(): void {
    if ((this.troubleListRole || this.addTroubleRole) && this.electronicLock) {
      this.$alarmService.getTroubleList(this.alarmId).subscribe((res) => {
        this.eliminateTableConfig.isLoading = false;
        if (res.code === ResultCodeEnum.success) {
          this.troubleData = res.data || [];
          this.troubleData = res.data.map(item => {
            item.style = this.$alarmStoreService.getAlarmColorByLevel(item.troubleLevel);
            // ??????????????????
            item.handleStatusClass = HandleStatusClassEnum[item.handleStatus];
            // ????????????
            item.troubleSource = TroubleUtil.translateTroubleSource(this.$nzI18n, item.troubleSource);
            // ????????????
            if (item.equipment && item.equipment.length > 0) {
              const resultEquipmentData = TroubleUtil.getEquipmentArr(this.language.config, item.equipment);
              // ????????????
              item.equipmentName = resultEquipmentData.resultNames.join(',');
              // ??????????????????
              item.equipmentTypeArr = resultEquipmentData.resultInfo;
            }
            // ????????????
            item.troubleType = TroubleUtil.showTroubleTypeInfo(this.troubleTypeList, item.troubleType);
            return item;
          });
          // ?????????????????????????????????????????????????????????????????????????????????
          // ??????????????????
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
   * ??????????????????
   */
  public getStatusName(status: string): string {
    return this.InspectionLanguage[WorkOrderStatusEnum[status]];
  }

  /**
   * ?????????????????????
   */
  public getStatusClass(status: string): string {
    return `iconfont icon-fiLink ${WorkOrderStatusClassEnum[status]}`;
  }

  /**
   * ????????????
   */
  public eliminatePageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }

  /**
   * ??????
   */
  public troublePageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }

  /**
   * ????????????
   */
  private refreshData(): void {
    // ????????????
    this.getWorkData();
    // ????????????
    this.getTroubleType();
    // ????????????
    this.getTroubleData();
  }

  /**
   * ????????????????????????
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
          // ????????????
          title: this.workLanguage.status, key: 'status',
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        {
          // ????????????
          title: this.workLanguage.deviceType, key: 'deviceType', width: width,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
        },
        // ????????????
        {title: this.workLanguage.deviceName, key: 'deviceName', width: width},
        // ????????????
        {title: this.workLanguage.department, key: 'deviceAreaName', width: width},
        // ????????????
        {title: this.workLanguage.equipmentName, key: 'equipmentName', width: width},
        {
          // ????????????
          title: this.workLanguage.equipmentType, key: 'equipmentType', width: width,
          type: 'render',
          renderTemplate: this.equipmentTypeTemp,
        },
        // ????????????
        {title: this.workLanguage.accountabilityUnitName, key: 'accountabilityDeptName', width: width},
        // ?????????
        {title: this.workLanguage.assignName, key: 'assignName', width: width},
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: []
    };
  }

  /**
   * ??????????????????
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
          // ??????
          title: this.TroubleLanguage.status, key: 'status', width: width,
          type: 'render',
          renderTemplate: this.handleStatusTemp
        },
        {
          // ????????????
          title: this.TroubleLanguage.troubleLevel, key: 'troubleLevel', width: width,
          type: 'render',
          renderTemplate: this.troubleLevelTemp
        },
        // ????????????
        {title: this.TroubleLanguage.troubleType, key: 'troubleType', width: width},
        // ????????????
        {title: this.TroubleLanguage.troubleSource, key: 'troubleSource', width: width},
        // ????????????
        {title: this.TroubleLanguage.troubleFacility, key: 'deviceName', width: width},
        {
          // ????????????
          title: this.TroubleLanguage.troubleEquipment, key: 'troubleEquipment', width: width,
          type: 'render',
          renderTemplate: this.troubleEquipment
        },
        // ????????????
        {title: this.TroubleLanguage.troubleDescribe, key: 'troubleDescribe', width: width},
        // ????????????
        {title: this.TroubleLanguage.deptName, key: 'assignDeptName', width: width},
        // ?????????
        {title: this.TroubleLanguage.reportUserName, key: 'reportUserName', width: width},
      ],
      topButtons: [],
      operation: [],
      leftBottomButtons: []
    };
  }
}
