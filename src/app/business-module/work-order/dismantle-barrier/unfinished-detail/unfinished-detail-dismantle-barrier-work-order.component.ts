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
  // ????????????-????????????
  @ViewChild('deviceEquipmentTemp') deviceEquipmentTemp: TemplateRef<any>;
  // ??????title
  public pageTitle: string;
  // ????????????
  public progressSpeed: number = 0;
  // ????????????????????????
  public resultClearBarrierData123: ClearBarrierWorkOrderModel = new ClearBarrierWorkOrderModel();
  public dismantleBarrierWorkOrderData: DismantleBarrierWorkOrderModel = new DismantleBarrierWorkOrderModel();
  // ??????????????????
  public resultAlarmData: AlarmListModel;
  // ??????????????????
  public resultTroubleData: TroubleModel = new TroubleModel();
  // ????????????
  public isFinished: boolean = false;
  // ??????????????????
  public alarmLevelStatus: string;
  // ???????????????????????????
  public alarmLevelColor: string;
  // ??????????????????
  public alarmConfirmStatus: string;
  // ???????????????????????????
  public alarmConfirmColor: string;
  // ??????????????????
  public alarmCleanStatus: string;
  // ???????????????????????????
  public alarmCleanColor: string;
  // ??????????????????????????????
  public isAlarm: boolean = false;
  // ????????????
  public troubleStatus: string;
  // ????????????
  public handleTableConfig: TableConfigModel;
  // ??????????????????
  public siteDataSet = [];
  // ??????id
  private procId: string;
  // ????????????
  private pageType: WorkOrderPageTypeEnum;
  // ????????????????????????
  queryCondition: QueryConditionModel = new QueryConditionModel();

  // ??????list
  public refEquipmentList: WorkOrderDeviceModel[] = [];
  // ??????
  public refDeviceObject: WorkOrderDeviceModel;

  /** ????????? ??????id */
  filterDeviceId;

  /** ???????????????????????????????????????id */
  filterEquipmentId;

  /** ????????? ?????????????????? */
  isDeviceOrEquipment;
  // ?????????
  public inspectionLanguage: InspectionLanguageInterface;
  public alarmLanguage: AlarmLanguageInterface;
  // ?????????????????????
  public workOrderLanguage: WorkOrderLanguageInterface;

  /** ??????????????? ?????????????????????????????? */
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
   * ???????????????
   */
  public ngOnInit(): void {
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.getPageTitle();
  }

  /**
   * ??????title?????????
   */
  private getPageTitle(): void {
    this.pageTitle = this.workOrderLanguage.orderDetail;
    this.$activatedRoute.queryParams.subscribe((params) => {
      this.pageType = params.type;
      // ?????????????????????
      this.procId = params.id;
      if (params.id && this.pageType === WorkOrderPageTypeEnum.unfinished) {
        this.getFromData(params.id);
        this.isFinished = false;
      } else if (this.pageType === WorkOrderPageTypeEnum.finished) {
        // ?????????????????????
        this.getFinishedData(params.id);
        this.initSiteTable();
        this.isFinished = true;
      }
    });
  }

  /**
   * ??????
   */
  public goBack(): void {
    window.history.back();
  }

  /**
   * ????????????????????????
   */
  private getFinishedData(id: string): void {
    this.$dismantleBarrierWorkOrderService
      .getDismantleFailureByIdForProcess_API(id)
      .subscribe((result: ResultModel<DismantleBarrierWorkOrderModel>) => {
        if (result.code === ResultCodeEnum.success) {
          this.getDeviceAndEquipmentInfo(result.data);
          this.getEvaluateInfo(result.data);
          this.dismantleBarrierWorkOrderData = result.data;

          // ?????? ????????????
          this.hanledRemoveType(result.data.removeType, result.data);

          this.progressSpeed = this.dismantleBarrierWorkOrderData.progressSpeed;
          // ????????????
          if (result.data.troubleId) {
            this.isAlarm = false;
            this.getTroubleData(this.dismantleBarrierWorkOrderData.troubleId);
          }
          // ????????????
          if (result.data.refAlarm) {
            this.isAlarm = true;
            this.getCurrentAlarmData(this.dismantleBarrierWorkOrderData.refAlarm);
          }
          this.getHandleList();
        }
      });
  }

  /**
   * ???????????????????????????
   */
  private getFromData(id: string): void {
    this.$dismantleBarrierWorkOrderService
      .getDismantleFailureByIdForProcess_API(id)
      .subscribe((result: ResultModel<DismantleBarrierWorkOrderModel>) => {
        if (result.code === ResultCodeEnum.success) {
          this.getDeviceAndEquipmentInfo(result.data);
          this.dismantleBarrierWorkOrderData = result.data;

          // ?????? ????????????
          this.hanledRemoveType(result.data.removeType, result.data);
          // ????????????
          if (result.data.troubleId) {
            this.isAlarm = false;
            this.getTroubleData(this.dismantleBarrierWorkOrderData.troubleId);
          }
          // ????????????
          if (result.data.refAlarm) {
            this.isAlarm = true;
            this.getCurrentAlarmData(this.dismantleBarrierWorkOrderData.refAlarm);
          }
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /** ?????? ????????????  */
  hanledRemoveType(type: DismantleTypeEnum, params: DismantleBarrierWorkOrderModel) {
    let equipmentList = [];

    // ???????????? ??????
    /*
     * ????????????????????????????????????????????? ??????????????????????????????????????? */
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
   * ????????????????????????
   */
  private getCurrentAlarmData(id: string): void {
    this.$alarmService
      .queryCurrentAlarmInfoById(id)
      .subscribe((result: ResultModel<AlarmListModel>) => {
        if (result.code === 0 && result.data) {
          this.getAlarmDeviceAndEquipmentInfo(result.data);
          // ??????????????????
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
   * ????????????????????????
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
   * ????????????????????????
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
   * ??????????????????-???????????????????????????
   */
  private getDeviceAndEquipmentInfo(data: DismantleBarrierWorkOrderModel): void {
    // data.equipmentList = data.equipment ? this.WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, equipmentType)(data.equipment) : []
    data.deviceObject = this.getDeviceObject(data.deviceType, false);
  }

  /**
   * ????????????-???????????????????????????
   */
  private getAlarmDeviceAndEquipmentInfo(data: AlarmListModel): void {
    this.refEquipmentList = data.alarmSourceTypeId
      ? this.getEquipmentObject([data.alarmSourceTypeId])
      : [];
    this.refDeviceObject = this.getDeviceObject(data.alarmDeviceTypeId, false);
  }

  /**
   * ??????????????????-????????????
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
   * ??????????????????
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
   * ????????????????????????
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
   * ??????????????????
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
   * ???????????????????????????
   */
  private initAlarmStatus(): void {
    // ????????????
    this.getAlarmOrTroubleLevel();
    // ??????????????????
    this.getAlarmCleanStatus();
    // ??????????????????
    this.getAlarmConfirmStatus();
  }

  /**
   * ????????????/??????????????????
   */
  public judgeAlarmOrTroubleType(): string {
    return this.dismantleBarrierWorkOrderData.refAlarm
      ? this.workOrderLanguage.refAlarm
      : this.workOrderLanguage.relevancyFault;
  }

  /**
   * ????????????/??????????????????
   */
  public judgeAlarmOrTroubleName(): string {
    return this.dismantleBarrierWorkOrderData.refAlarm
      ? this.dismantleBarrierWorkOrderData.refAlarmName
      : this.dismantleBarrierWorkOrderData.troubleName;
  }

  /**
   * ?????????????????????????????????????????????
   */
  public getEvaluatePicture(): string {
    const star = Math.floor(Number(this.dismantleBarrierWorkOrderData.evaluatePoint) / 20);
    return WorkOrderBusinessCommonUtil.getAlarmEvaluate(star.toString());
  }

  /**
   * ????????????????????????????????????:
   * 1.??????????????????1???3?????????
   * 2.??????????????????1???3?????????
   * 3.??????????????????3?????????
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
   * ??????/????????????
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
   * ??????????????????
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
   * ??????????????????
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
   *  ??????????????????
   */
  public getWorkOrderStatus(): string {
    return WorkOrderStatusUtil.getWorkOrderIconClassName(this.dismantleBarrierWorkOrderData.status);
  }

  /**
   *  ????????????????????????
   *  done:????????? undone??????????????????????????????????????????
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
   * ????????????/????????????/????????????Text
   */
  public getClearBarrierReasonText(row: number): string {
    // ????????????/????????????
    if (row === 1) {
      return this.isFinished
        ? this.inspectionLanguage.feeInformation
        : this.inspectionLanguage.retreatSingleReason;
    } else {
      // ????????????/????????????
      return this.isFinished
        ? this.inspectionLanguage.retreatSingleReason
        : this.inspectionLanguage.reasonsForTransfer;
    }
  }

  /**
   *  ????????????/????????????/????????????Content
   */
  public getClearBarrierReasonContent(row: number): string {
    // ????????????/????????????
    if (row === 1) {
      const getCost: any = this.dismantleBarrierWorkOrderData.cost;
      const cost = getCost ? getCost[0].cost : null;
      return this.isFinished ? cost : this.dismantleBarrierWorkOrderData.singleBackUserDefinedReason;
    } else {
      // ????????????/????????????
      return this.isFinished
        ? this.dismantleBarrierWorkOrderData.singleBackUserDefinedReason
        : this.dismantleBarrierWorkOrderData.turnReason;
    }
  }

  /**
   * ????????????????????????
   */
  private getHandleList() {
    this.$clearBarrierWorkOrderService.getSiteList(this.procId).subscribe((result: Result) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach((item) => {
          if (item.type === 1 && item.typeName) {
            // ??????
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
            // ??????
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
   * ??????
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
          // ????????????
          title: this.workOrderLanguage.objectName,
          key: 'objectName',
          width: width,
        },
        {
          // ??????/????????????
          title: this.workOrderLanguage.deviceEquip,
          key: 'deviceEquip',
          width: width,
          type: 'render',
          renderTemplate: this.deviceEquipmentTemp,
        },
        {
          // ????????????
          title: this.workOrderLanguage.errorReason,
          key: 'troubleReason',
          width: width,
        },
        {
          // ????????????
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
