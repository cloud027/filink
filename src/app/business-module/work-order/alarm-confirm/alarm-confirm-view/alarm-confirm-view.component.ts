import { Component, OnInit } from '@angular/core';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {WorkOrderDeviceModel} from '../../../../core-module/model/work-order/work-order-device.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import {AlarmForCommonService} from '../../../../core-module/api-service/alarm';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {TroubleUtil} from '../../../../core-module/business-util/trouble/trouble-util';
import {WorkOrderAlarmLevelColor} from '../../../../core-module/enum/trouble/trouble-common.enum';
import {AlarmCleanStatusEnum} from '../../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmConfirmStatusEnum} from '../../../../core-module/enum/alarm/alarm-confirm-status.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmConfirmWorkOrderModel} from '../../../../core-module/model/work-order/alarm-confirm.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {AlarmConfirmWorkOrderService} from '../../share/service/alarm-confirm';

/***
 * ????????????????????????
 */
@Component({
  selector: 'app-alarm-confirm-view',
  templateUrl: './alarm-confirm-view.component.html',
  styleUrls: ['./alarm-confirm-view.component.scss']
})
export class AlarmConfirmViewComponent implements OnInit {
  // ?????????
  public inspectionLanguage: InspectionLanguageInterface;
  public workOrderLanguage: WorkOrderLanguageInterface;
  // ?????????????????????
  public alarmLanguage: AlarmLanguageInterface;
  // ??????title
  public pageTitle: string;
  // ?????????/??????????????????
  public isFinished: boolean = false;
  // ????????????????????????
  public alarmOrderData: AlarmConfirmWorkOrderModel = new AlarmConfirmWorkOrderModel();
  // ????????????
  private pageType: WorkOrderPageTypeEnum;
  // ??????list
  public refEquipmentList: WorkOrderDeviceModel[] = [];
  // ??????????????????
  public resultAlarmData: AlarmListModel = new AlarmListModel();
  // ??????????????????
  public alarmLevelStatus: string;
  // ???????????????????????????
  public alarmLevelColor: string;
  // ??????????????????
  public alarmCleanStatus: string;
  // ???????????????????????????
  public alarmCleanColor: string;
  // ??????????????????
  public alarmConfirmStatus: string;
  // ???????????????????????????
  public alarmConfirmColor: string;
  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $alarmService: AlarmForCommonService,
    private $activatedRoute: ActivatedRoute,
    private $message: FiLinkModalService,
    private $alarmWorkOrderService: AlarmConfirmWorkOrderService,
  ) {
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  public ngOnInit(): void {
    this.getPageTitle();
  }

  /**
   * ??????title?????????
   */
  private getPageTitle(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.type;
      if (params.type === WorkOrderPageTypeEnum.unfinished) {
        this.isFinished = false;
        this.pageTitle = this.workOrderLanguage.alarmConfirmOrderDetail;
        // ?????????????????????????????????????????????
        this.$alarmWorkOrderService.getOrderDetailById(params.id).subscribe((res: ResultModel<AlarmConfirmWorkOrderModel>) => {
          this.handleData(res);
        });
      } else {
        this.pageTitle = this.workOrderLanguage.historyAlarmConfirmOrderDetail;
        this.isFinished = true;
        // ??????????????????
        this.$alarmWorkOrderService.historyDetailById(params.id).subscribe((res: ResultModel<AlarmConfirmWorkOrderModel>) => {
          this.handleData(res);
        });
      }
    });
  }

  /**
   * ????????????
   */
  private handleData(res: ResultModel<AlarmConfirmWorkOrderModel>): void {
    if (res.code === ResultCodeEnum.success && res.data) {
      this.alarmOrderData = res.data;
      // ????????????
      if (res.data.refAlarmId) {
        this.getCurrentAlarmData(res.data.refAlarmId);
      }
      // ??????
      this.alarmOrderData.equipmentList = res.data.equipment ? this.getEquipmentName(res.data.equipment, true) : [];
      if (res.data.deviceType) {
        this.alarmOrderData.picture = CommonUtil.getFacilityIconClassName(res.data.deviceType);
        this.alarmOrderData.typeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, res.data.deviceType) as string;
      }
      this.alarmOrderData.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(this.alarmOrderData.status);
      // ??????
      this.alarmOrderData.starClass = 'threeStar';
      this.alarmOrderData.evaluateDetailInfo = this.inspectionLanguage.orderEvaluation;
      if (res.data.evaluatePoint) {
        const star =  Math.floor(Number(this.alarmOrderData.evaluatePoint) / 20);
        this.alarmOrderData.starClass = WorkOrderBusinessCommonUtil.getAlarmEvaluate(star.toString());
      }
      // ????????????
      if (res.data.lastDays < 1) {
        this.alarmOrderData.lastDayClass = WorkOrderBusinessCommonUtil.getAlarmRemainDays('1');
      } else if (res.data.lastDays > 1 && res.data.lastDays < 3) {
        this.alarmOrderData.lastDayClass = WorkOrderBusinessCommonUtil.getAlarmRemainDays('2');
      } else {
        this.alarmOrderData.lastDayClass = WorkOrderBusinessCommonUtil.getAlarmRemainDays('3');
      }
      this.alarmOrderData.realityAlarmReason = this.alarmOrderData.realityAlarmReason ? this.alarmOrderData.realityAlarmReason : '';
      this.alarmOrderData.maintenanceAdvice = this.alarmOrderData.maintenanceAdvice ? this.alarmOrderData.maintenanceAdvice : '';
    } else {
      this.$message.error(res.msg);
    }
  }

  /**
   * ??????????????????
   */
  private getEquipmentName(list: any[], flag?: boolean): WorkOrderDeviceModel[] {
    const equipmentList = [];
    list.forEach((equipment) => {
      const equipmentModel = new WorkOrderDeviceModel();
      equipmentModel.name = flag ? equipment.equipmentName : WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, equipment);
      equipmentModel.picture = flag ? CommonUtil.getEquipmentIconClassName(equipment.equipmentType) : CommonUtil.getEquipmentIconClassName(equipment);
      equipmentModel.typeName = flag ? WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, equipment.equipmentType) : WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, equipment);
      if (equipmentModel.name && equipmentModel.name.length > 0) {
        equipmentList.push(equipmentModel);
      }
    });
    return equipmentList;
  }


  /**
   * ??????????????????
   */
  private getCurrentAlarmData(id: string): void {
    this.$alarmService.queryCurrentAlarmInfoById(id).subscribe((result: ResultModel<AlarmListModel>) => {
      if (result.code === 0 && result.data) {
        this.getAlarmDeviceAndEquipmentInfo(result.data);
        // ??????????????????
        result.data.alarmContinuedTimeString = CommonUtil.setAlarmContinousTime(result.data.alarmBeginTime, result.data.alarmCleanTime,
          {month: this.alarmLanguage.month, day: this.alarmLanguage.day, hour: this.alarmLanguage.hour});
        this.resultAlarmData = result.data;
        if (this.resultAlarmData.alarmHappenCount) {
          this.resultAlarmData.fontSize = AlarmForCommonUtil.setFontSize(this.resultAlarmData.alarmHappenCount);
        }
        this.initAlarmStatus();
      } else {
        this.getHistoryAlarmData(id);
      }
    }, () => {
      this.getHistoryAlarmData(id);
    });
  }
  /**
   * ????????????????????????
   */
  private getHistoryAlarmData(id: string): void {
    this.$alarmService.queryAlarmHistoryInfo(id).subscribe((result: ResultModel<AlarmListModel>) => {
      if (result.code === 0) {
        this.getAlarmDeviceAndEquipmentInfo(result.data);
        this.resultAlarmData = result.data;
        if (this.resultAlarmData.alarmHappenCount) {
          this.resultAlarmData.fontSize = AlarmForCommonUtil.setFontSize(this.resultAlarmData.alarmHappenCount);
        }
        this.initAlarmStatus();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
  /**
   * ????????????-???????????????????????????
   */
  private getAlarmDeviceAndEquipmentInfo(data: AlarmListModel): void {
    this.refEquipmentList = data.alarmSourceTypeId ? this.getEquipmentName(data.alarmSourceTypeId.split(','), false) : [];
    this.resultAlarmData.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, data.alarmDeviceTypeId);
    this.resultAlarmData.deviceTypeIcon = CommonUtil.getFacilityIconClassName(data.alarmDeviceTypeId);
  }
  /**
   * ???????????????????????????
   */
  private initAlarmStatus(): void {
    // ????????????
    this.alarmLevelStatus = this.alarmLanguage[TroubleUtil.getColorName(this.resultAlarmData.alarmFixedLevel, WorkOrderAlarmLevelColor)];
    this.alarmLevelColor = TroubleUtil.getColorName(this.resultAlarmData.alarmFixedLevel, WorkOrderAlarmLevelColor);
    // ??????????????????
    this.alarmCleanStatus = this.alarmLanguage[TroubleUtil.getColorName(this.resultAlarmData.alarmCleanStatus, AlarmCleanStatusEnum)];
    this.alarmCleanColor = TroubleUtil.getColorName(this.resultAlarmData.alarmCleanStatus, AlarmCleanStatusEnum);
    // ??????????????????
    this.alarmConfirmStatus = this.alarmLanguage[TroubleUtil.getColorName(this.resultAlarmData.alarmConfirmStatus, AlarmConfirmStatusEnum)];
    this.alarmConfirmColor = TroubleUtil.getColorName(this.resultAlarmData.alarmConfirmStatus, AlarmConfirmStatusEnum);
  }
}
