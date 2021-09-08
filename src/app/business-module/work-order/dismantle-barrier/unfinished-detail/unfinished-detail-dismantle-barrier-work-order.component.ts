import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { DismantleBarrierWorkOrderService } from '../../share/service/dismantle-barrier/dismantle-barrier-work-order.service';
import { InspectionLanguageInterface } from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import { CommonUtil } from '../../../../shared-module/util/common-util';
import { ResultModel } from '../../../../shared-module/model/result.model';
import { ClearBarrierWorkOrderModel } from '../../../../core-module/model/work-order/clear-barrier-work-order.model';
import { AlarmLanguageInterface } from '../../../../../assets/i18n/alarm/alarm-language.interface';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { ResultCodeEnum } from '../../../../shared-module/enum/result-code.enum';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { WorkOrderBusinessCommonUtil } from '../../share/util/work-order-business-common.util';
import { WorkOrderPageTypeEnum } from '../../share/enum/work-order-page-type.enum';
import { WorkOrderDeviceModel } from '../../../../core-module/model/work-order/work-order-device.model';
import { WorkOrderNodeEnum, WorkOrderNodeShineEnum } from '../../share/enum/refAlarm-faultt.enum';
import { InspectionEquipmentInfoModel } from '../../../../core-module/model/work-order/inspection-equipment-info.model';
import {
  HandleStatusClassEnum,
  WorkOrderAlarmLevelColor,
} from '../../../../core-module/enum/trouble/trouble-common.enum';
import { TroubleUtil } from '../../../../core-module/business-util/trouble/trouble-util';
import { AlarmCleanStatusEnum } from '../../../../core-module/enum/alarm/alarm-clean-status.enum';
import { TableConfigModel } from '../../../../shared-module/model/table-config.model';
import { Result } from '../../../../shared-module/entity/result';
import { AlarmForCommonUtil } from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import { AlarmForCommonService } from '../../../../core-module/api-service/alarm';
import { TroubleForCommonService } from '../../../../core-module/api-service/trouble';
import { TroubleModel } from '../../../../core-module/model/trouble/trouble.model';
import { AlarmListModel } from '../../../../core-module/model/alarm/alarm-list.model';
declare const $: any;

import { WorkOrderLanguageInterface } from '../../../../../assets/i18n/work-order/work-order.language.interface';
import { DismantleBarrierWorkOrderModel } from '../../share/model/dismantle-barrier-model/dismantle-barrier-work-order.model';
import { DismantleTypeEnum } from '../../share/enum/dismantle-barrier.config.enum';
import { WorkOrderStatusUtil } from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import { QueryConditionModel } from '../../../../shared-module/model/query-condition.model';
import { ClearBarrierWorkOrderService } from '../../share/service/clear-barrier';

@Component({
  selector: 'app-unfinished-detail',
  templateUrl: './unfinished-detail-dismantle-barrier-work-order.component.html',
  styleUrls: ['./unfinished-detail-dismantle-barrier-work-order.component.scss'],
})
export class UnfinishedDetailDismantleBarrierWorkOrderComponent implements OnInit {
  // 设施图标-设备类型
  @ViewChild('deviceEquipmentTemp') deviceEquipmentTemp: TemplateRef<any>;
  // 页面title
  public pageTitle: string;
  // 页面类型
  public progressSpeed: number = 0;
  // 销账工单详情数据
  public resultClearBarrierData123: ClearBarrierWorkOrderModel = new ClearBarrierWorkOrderModel();
  public dismantleBarrierWorkOrderData: DismantleBarrierWorkOrderModel = new DismantleBarrierWorkOrderModel();
  // 关联警告数据
  public resultAlarmData: AlarmListModel;
  // 关联警告数据
  public resultTroubleData: TroubleModel = new TroubleModel();
  // 剩余天数
  public isFinished: boolean = false;
  // 关联告警等级
  public alarmLevelStatus: string;
  // 关联告警等级背景色
  public alarmLevelColor: string;
  // 关联告警确认
  public alarmConfirmStatus: string;
  // 关联告警确认背景色
  public alarmConfirmColor: string;
  // 关联告警清除
  public alarmCleanStatus: string;
  // 关联告警清除背景色
  public alarmCleanColor: string;
  // 判断告警或故障标识位
  public isAlarm: boolean = false;
  // 故障状态
  public troubleStatus: string;
  // 表格配置
  public handleTableConfig: TableConfigModel;
  // 现场处理数据
  public siteDataSet = [];
  // 工单id
  private procId: string;
  // 页面类型
  private pageType: WorkOrderPageTypeEnum;
  // 表格通用查询条件
  queryCondition: QueryConditionModel = new QueryConditionModel();

  // 设备list
  public refEquipmentList: WorkOrderDeviceModel[] = [];
  // 设施
  public refDeviceObject: WorkOrderDeviceModel;

  /** 设施的 过滤id */
  filterDeviceId;

  /** 如果选择拆除的是设备过滤的id */
  filterEquipmentId;

  /** 判断是 设施还是设备 */
  isDeviceOrEquipment;
  // 国际化
  public inspectionLanguage: InspectionLanguageInterface;
  public alarmLanguage: AlarmLanguageInterface;
  // 销账工单国际化
  public workOrderLanguage: WorkOrderLanguageInterface;

  /** 新增编辑时 选择的是设施还是设备 */
  DismantleTypeEnum = DismantleTypeEnum;

  constructor(
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $dismantleBarrierWorkOrderService: DismantleBarrierWorkOrderService,
    private $activatedRoute: ActivatedRoute,
    private $alarmService: AlarmForCommonService,
    private $troubleService: TroubleForCommonService,
    private $clearBarrierWorkOrderService: ClearBarrierWorkOrderService,
  ) {}

  /**
   * 数据初始化
   */
  public ngOnInit(): void {
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.getPageTitle();
  }

  /**
   * 获取title及参数
   */
  private getPageTitle(): void {
    this.pageTitle = this.workOrderLanguage.orderDetail;
    this.$activatedRoute.queryParams.subscribe((params) => {
      this.pageType = params.type;
      // 未完成销账工单
      this.procId = params.id;
      if (params.id && this.pageType === WorkOrderPageTypeEnum.unfinished) {
        this.getFromData(params.id);
        this.isFinished = false;
      } else if (this.pageType === WorkOrderPageTypeEnum.finished) {
        // 已完成销账工单
        this.getFinishedData(params.id);
        this.initSiteTable();
        this.isFinished = true;
      }
    });
  }

  /**
   * 返回
   */
  public goBack(): void {
    window.history.back();
  }

  /**
   * 请求历史详情数据
   */
  private getFinishedData(id: string): void {
    this.$dismantleBarrierWorkOrderService
      .getDismantleFailureByIdForProcess_API(id)
      .subscribe((result: ResultModel<DismantleBarrierWorkOrderModel>) => {
        if (result.code === ResultCodeEnum.success) {
          this.getDeviceAndEquipmentInfo(result.data);
          this.getEvaluateInfo(result.data);
          this.dismantleBarrierWorkOrderData = result.data;

          // 判断 拆除类型
          this.hanledRemoveType(result.data.removeType, result.data);

          this.progressSpeed = this.dismantleBarrierWorkOrderData.progressSpeed;
          // 关联故障
          if (result.data.troubleId) {
            this.isAlarm = false;
            this.getTroubleData(this.dismantleBarrierWorkOrderData.troubleId);
          }
          // 关联告警
          if (result.data.refAlarm) {
            this.isAlarm = true;
            this.getCurrentAlarmData(this.dismantleBarrierWorkOrderData.refAlarm);
          }
          this.getHandleList();
        }
      });
  }

  /**
   * 请求未完工表单数据
   */
  private getFromData(id: string): void {
    this.$dismantleBarrierWorkOrderService
      .getDismantleFailureByIdForProcess_API(id)
      .subscribe((result: ResultModel<DismantleBarrierWorkOrderModel>) => {
        if (result.code === ResultCodeEnum.success) {
          this.getDeviceAndEquipmentInfo(result.data);
          this.dismantleBarrierWorkOrderData = result.data;

          // 判断 拆除类型
          this.hanledRemoveType(result.data.removeType, result.data);
          // 故障工单
          if (result.data.troubleId) {
            this.isAlarm = false;
            this.getTroubleData(this.dismantleBarrierWorkOrderData.troubleId);
          }
          // 告警工单
          if (result.data.refAlarm) {
            this.isAlarm = true;
            this.getCurrentAlarmData(this.dismantleBarrierWorkOrderData.refAlarm);
          }
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /** 判断 拆除类型  */
  hanledRemoveType(type: DismantleTypeEnum, params: DismantleBarrierWorkOrderModel) {
    let equipmentList = [];

    // 拆除类型 设备
    /*
     * 如果是设备，拆除点位表格的数据 直接从返回的详情数据中获取 */
    if (type === DismantleTypeEnum.equipment) {
      this.filterEquipmentId = params.equipmentId;
      equipmentList.push({
        styleColor: CommonUtil.getEquipmentTypeIcon(this.dismantleBarrierWorkOrderData as any),
        typeName: WorkOrderBusinessCommonUtil.equipTypeNames(
          this.$nzI18n,
          this.dismantleBarrierWorkOrderData.equipmentType,
        ),
        equipmentName: this.dismantleBarrierWorkOrderData.equipmentName,
      });
    } else if (type === DismantleTypeEnum.device) {
      this.filterDeviceId = params.deviceId;
      this.filterEquipmentId = params.equipmentInfoList.map((item) => item.equipmentId);
      equipmentList = params.equipmentInfoList;
      equipmentList.forEach((item) => {
        item['styleColor'] = CommonUtil.getEquipmentTypeIcon(item);
        item['typeName'] = WorkOrderBusinessCommonUtil.equipTypeNames(
          this.$nzI18n,
          item.equipmentType,
        );
      });
    }
    this.dismantleBarrierWorkOrderData.equipmentList = equipmentList;
  }
  /**
   * 请求当前关联告警
   */
  private getCurrentAlarmData(id: string): void {
    this.$alarmService
      .queryCurrentAlarmInfoById(id)
      .subscribe((result: ResultModel<AlarmListModel>) => {
        if (result.code === 0 && result.data) {
          this.getAlarmDeviceAndEquipmentInfo(result.data);
          // 告警持续时间
          result.data.alarmContinuedTimeString = CommonUtil.setAlarmContinousTime(
            result.data.alarmBeginTime,
            result.data.alarmCleanTime,
            {
              month: this.alarmLanguage.month,
              day: this.alarmLanguage.day,
              hour: this.alarmLanguage.hour,
            },
          );
          this.resultAlarmData = result.data;
          if (this.resultAlarmData.alarmHappenCount) {
            this.resultAlarmData.fontSize = AlarmForCommonUtil.setFontSize(
              this.resultAlarmData.alarmHappenCount,
            );
          }
          this.initAlarmStatus();
        } else {
          this.getHistoryAlarmData(id);
        }
      });
  }

  /**
   * 请求历史关联告警
   */
  private getHistoryAlarmData(id: string): void {
    this.$alarmService
      .queryAlarmHistoryInfo(id)
      .subscribe((result: ResultModel<AlarmListModel>) => {
        if (result.code === 0) {
          this.getAlarmDeviceAndEquipmentInfo(result.data);
          this.resultAlarmData = result.data;
          if (this.resultAlarmData.alarmHappenCount) {
            this.resultAlarmData.fontSize = AlarmForCommonUtil.setFontSize(
              this.resultAlarmData.alarmHappenCount,
            );
          }
          this.initAlarmStatus();
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 请求关联故障数据
   */
  private getTroubleData(id: string): void {
    this.$troubleService.queryTroubleDetail(id).subscribe((result: ResultModel<TroubleModel>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data) {
          result.data.equipmentList = this.getTroubleEquipmentObject(result.data.equipment);
          result.data.deviceObject = this.getDeviceObject(
            result.data.deviceType,
            true,
            result.data.deviceName,
          );
          this.resultTroubleData = result.data;
          if (!result.data.handleTime || result.data.handleTime === 0) {
            result.data.handleTime = null;
          }
          this.troubleStatus = HandleStatusClassEnum[this.resultTroubleData.handleStatus];
          this.getAlarmOrTroubleLevel();
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 获取故障详情-设施和设备映射信息
   */
  private getDeviceAndEquipmentInfo(data: DismantleBarrierWorkOrderModel): void {
    // data.equipmentList = data.equipment ? this.WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, equipmentType)(data.equipment) : []
    data.deviceObject = this.getDeviceObject(data.deviceType, false);
  }

  /**
   * 关联警告-设施和设备映射信息
   */
  private getAlarmDeviceAndEquipmentInfo(data: AlarmListModel): void {
    this.refEquipmentList = data.alarmSourceTypeId
      ? this.getEquipmentObject([data.alarmSourceTypeId])
      : [];
    this.refDeviceObject = this.getDeviceObject(data.alarmDeviceTypeId, false);
  }

  /**
   * 获取故障详情-评价信息
   */
  private getEvaluateInfo(data: DismantleBarrierWorkOrderModel): void {
    if (data.evaluateInfo && data.evaluateInfo.length > 0) {
      data.evaluatePoint = data.evaluateInfo[0].evaluatePoint;
      data.evaluateDetailInfo = data.evaluateInfo[0].evaluateInfo;
    } else {
      data.evaluatePoint = '';
      data.evaluateDetailInfo = '';
    }
  }

  /**
   * 获取设备对象
   */
  private getEquipmentObject(list: string[]): WorkOrderDeviceModel[] {
    const equipmentList = [];
    list.forEach((equipmentType) => {
      const equipmentModel = new WorkOrderDeviceModel();
      equipmentModel.name = WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, equipmentType);
      equipmentModel.picture = CommonUtil.getEquipmentIconClassName(equipmentType);
      equipmentModel.typeName = WorkOrderBusinessCommonUtil.equipTypeNames(
        this.$nzI18n,
        equipmentType,
      );
      equipmentList.push(equipmentModel);
    });
    return equipmentList;
  }

  /**
   * 故障获取设备名称
   */
  private getTroubleEquipmentObject(list: InspectionEquipmentInfoModel[]): WorkOrderDeviceModel[] {
    list = list || [];
    const equipmentList = [];
    list.forEach((equipment) => {
      const equipmentModel = new WorkOrderDeviceModel();
      equipmentModel.name = equipment.equipmentName;
      equipmentModel.picture = CommonUtil.getEquipmentIconClassName(equipment.equipmentType);
      equipmentModel.typeName = WorkOrderBusinessCommonUtil.equipTypeNames(
        this.$nzI18n,
        equipment.equipmentType,
      );
      equipmentList.push(equipmentModel);
    });
    return equipmentList;
  }

  /**
   * 获取设施对象
   */
  private getDeviceObject(
    code: string,
    isDevice: boolean,
    deviceName?: string,
  ): WorkOrderDeviceModel {
    const deviceModel = new WorkOrderDeviceModel();
    deviceModel.name = isDevice
      ? deviceName
      : WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, code);
    if (!deviceModel.name || deviceModel.name.length === 0) {
      deviceModel.picture = '';
    } else {
      deviceModel.picture = CommonUtil.getFacilityIconClassName(code);
      deviceModel.typeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, code);
    }
    return deviceModel;
  }

  /**
   * 初始化告警工单状态
   */
  private initAlarmStatus(): void {
    // 告警等级
    this.getAlarmOrTroubleLevel();
    // 告警清除状态
    this.getAlarmCleanStatus();
    // 告警确认状态
    this.getAlarmConfirmStatus();
  }

  /**
   * 关联告警/故障类型判断
   */
  public judgeAlarmOrTroubleType(): string {
    return this.dismantleBarrierWorkOrderData.refAlarm
      ? this.workOrderLanguage.refAlarm
      : this.workOrderLanguage.relevancyFault;
  }

  /**
   * 关联告警/故障类型判断
   */
  public judgeAlarmOrTroubleName(): string {
    return this.dismantleBarrierWorkOrderData.refAlarm
      ? this.dismantleBarrierWorkOrderData.refAlarmName
      : this.dismantleBarrierWorkOrderData.troubleName;
  }

  /**
   * 获取已完成工单星级评价图片类型
   */
  public getEvaluatePicture(): string {
    const star = Math.floor(Number(this.dismantleBarrierWorkOrderData.evaluatePoint) / 20);
    return WorkOrderBusinessCommonUtil.getAlarmEvaluate(star.toString());
  }

  /**
   * 获取剩余天数状态背景图片:
   * 1.剩余天数小于1～3的状态
   * 2.剩余天数小于1～3的状态
   * 3.剩余天数大于3的状态
   */
  public getRemainDaysPicture(): string {
    if (this.dismantleBarrierWorkOrderData.lastDays < 1) {
      return WorkOrderBusinessCommonUtil.getAlarmRemainDays('1');
    } else if (
      this.dismantleBarrierWorkOrderData.lastDays > 1 &&
      this.dismantleBarrierWorkOrderData.lastDays < 3
    ) {
      return WorkOrderBusinessCommonUtil.getAlarmRemainDays('2');
    } else {
      return WorkOrderBusinessCommonUtil.getAlarmRemainDays('3');
    }
  }

  /**
   * 告警/故障等级
   */
  private getAlarmOrTroubleLevel(): void {
    this.alarmLevelStatus = this.alarmLanguage[
      TroubleUtil.getColorName(
        this.isAlarm ? this.resultAlarmData.alarmFixedLevel : this.resultTroubleData.troubleLevel,
        WorkOrderAlarmLevelColor,
      )
    ];
    this.alarmLevelColor = TroubleUtil.getColorName(
      this.isAlarm ? this.resultAlarmData.alarmFixedLevel : this.resultTroubleData.troubleLevel,
      WorkOrderAlarmLevelColor,
    );
  }

  /**
   * 警告清除状态
   */
  private getAlarmCleanStatus(): void {
    this.alarmCleanStatus = this.alarmLanguage[
      TroubleUtil.getColorName(this.resultAlarmData.alarmCleanStatus, AlarmCleanStatusEnum)
    ];
    this.alarmCleanColor = TroubleUtil.getColorName(
      this.resultAlarmData.alarmCleanStatus,
      AlarmCleanStatusEnum,
    );
  }

  /**
   * 警告确认状态
   */
  private getAlarmConfirmStatus(): void {
    this.alarmConfirmStatus = this.alarmLanguage[
      TroubleUtil.getColorName(this.resultAlarmData.alarmConfirmStatus, AlarmCleanStatusEnum)
    ];
    this.alarmConfirmColor = TroubleUtil.getColorName(
      this.resultAlarmData.alarmConfirmStatus,
      AlarmCleanStatusEnum,
    );
  }

  /**
   *  工单详情状态
   */
  public getWorkOrderStatus(): string {
    return WorkOrderStatusUtil.getWorkOrderIconClassName(this.dismantleBarrierWorkOrderData.status);
  }

  /**
   *  故障节点状态转换
   *  done:已完成 undone：已打回，节点状态都是已完成
   */
  public getTroubleNode(nodeId: string): string {
    if (
      this.resultTroubleData.handleStatus === 'done' ||
      this.resultTroubleData.handleStatus === 'undone'
    ) {
      return this.inspectionLanguage[this.resultTroubleData.handleStatus];
    }
    for (const key in WorkOrderNodeEnum) {
      if (key && WorkOrderNodeEnum[key] === nodeId) {
        return WorkOrderNodeShineEnum[key];
      }
    }
  }

  /**
   * 退单原因/费用信息/转派原因Text
   */
  public getClearBarrierReasonText(row: number): string {
    // 退单原因/费用信息
    if (row === 1) {
      return this.isFinished
        ? this.inspectionLanguage.feeInformation
        : this.inspectionLanguage.retreatSingleReason;
    } else {
      // 退单原因/转派原因
      return this.isFinished
        ? this.inspectionLanguage.retreatSingleReason
        : this.inspectionLanguage.reasonsForTransfer;
    }
  }

  /**
   *  退单原因/费用信息/转派原因Content
   */
  public getClearBarrierReasonContent(row: number): string {
    // 退单原因/费用信息
    if (row === 1) {
      const getCost: any = this.dismantleBarrierWorkOrderData.cost;
      const cost = getCost ? getCost[0].cost : null;
      return this.isFinished ? cost : this.dismantleBarrierWorkOrderData.singleBackUserDefinedReason;
    } else {
      // 退单原因/转派原因
      return this.isFinished
        ? this.dismantleBarrierWorkOrderData.singleBackUserDefinedReason
        : this.dismantleBarrierWorkOrderData.turnReason;
    }
  }

  /**
   * 获取现场处理数据
   */
  private getHandleList() {
    this.$clearBarrierWorkOrderService.getSiteList(this.procId).subscribe((result: Result) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach((item) => {
          if (item.type === 1 && item.typeName) {
            // 设施
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(
              this.$nzI18n,
              item.typeName,
            );
            if (item.deviceTypeName) {
              item.deviceClass = CommonUtil.getFacilityIconClassName(item.typeName);
            } else {
              item.deviceClass = '';
            }
          } else if (item.type === 2 && item.typeName) {
            // 设备
            item.equipmentTypeList = [];
            item.equipmentTypeName = '';
            const names = [];
            const arr = item.typeName.split(',');
            for (let k = 0; k < arr.length; k++) {
              const name = WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, arr[k]);
              if (name && name.length > 0) {
                item.equipmentTypeList.push({
                  key: CommonUtil.getEquipmentIconClassName(arr[k]),
                  label: name,
                });
                names.push(name);
              }
            }
            item.equipmentTypeName = names.join(',');
          }
        });
        this.siteDataSet = result.data;
      }
    });
  }
  /**
   * 列表
   */
  private initSiteTable(): void {
    const width = ($('.work-order-detail').width() - 100) / 4;
    this.handleTableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: false,
      showSearchExport: false,
      notShowPrint: false,
      simplePage: false,
      scroll: { x: '1600px', y: '305px' },
      columnConfig: [
        {
          // 对象名称
          title: this.workOrderLanguage.objectName,
          key: 'objectName',
          width: width,
        },
        {
          // 设施/设备类型
          title: this.workOrderLanguage.deviceEquip,
          key: 'deviceEquip',
          width: width,
          type: 'render',
          renderTemplate: this.deviceEquipmentTemp,
        },
        {
          // 故障原因
          title: this.workOrderLanguage.errorReason,
          key: 'troubleReason',
          width: width,
        },
        {
          // 处理方案
          title: this.workOrderLanguage.processingScheme,
          key: 'processingScheme',
          width: width,
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      sort: () => {},
      openTableSearch: () => {},
      handleSearch: () => {},
    };
  }
}
