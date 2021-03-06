import {Component, OnInit, TemplateRef, ViewChild, OnDestroy} from '@angular/core';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {WorkOrderStatusClassEnum} from '../../../../core-module/enum/work-order/work-order-status-class.enum';
import {IsSelectAllEnum, LastDaysIconClassEnum, OrderBusinessStatusEnum, ReasonForChargeback} from '../../share/enum/clear-barrier-work-order.enum';
import {RealPictureComponent} from '../../../../shared-module/component/real-picture/real-picture.component';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {InstallWorkOrderService} from '../../share/service/installation';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {InstallWorkOrderModel} from '../../../../core-module/model/work-order/install-work-order.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {HostTypeEnum} from '../../../../core-module/enum/facility/Intelligent-lock/host-type.enum';
import {EquipmentStatusEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';

/**
 * ??????????????????
 */
@Component({
  selector: 'app-install-order-view',
  templateUrl: './install-order-view.component.html',
  styleUrls: ['./install-order-view.component.scss']
})
export class InstallOrderViewComponent implements OnInit, OnDestroy {

  // ?????????
  @ViewChild('editPicture') editPicture: RealPictureComponent;
  // ??????
  @ViewChild('tablesComponent') tableComponent: TableComponent;
  //  ??????????????????
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentBusinessTemp') equipmentBusinessTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipTemp') equipTemp: TemplateRef<HTMLDocument>;
  // ?????????
  public inspectionLanguage: InspectionLanguageInterface;
  // ???????????????
  public facilityLanguage: FacilityLanguageInterface;
  // ????????????
  public installEquipmentData: EquipmentListModel[] = [];
  // ????????????
  public resultData = new InstallWorkOrderModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????id
  public deviceId: string;
  // ????????????
  public pageType: string;
  public pageTypeEnum = WorkOrderPageTypeEnum;
  // ??????????????????????????????
  public isWisdomDevice: boolean = false;
  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;
  // ??????????????????
  public businessStatusEnum = OrderBusinessStatusEnum;
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ??????id
  private procId: string;
  // ????????????id
  private installEquipmentId?: string;
  // ????????????
  private resultEquipmentStatus: SelectModel[] = [];

  constructor(
    private $activatedRoute: ActivatedRoute,
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $installService: InstallWorkOrderService,
  ) { }

  public ngOnInit(): void {
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.initPageJump();
    this.initTableConfig();
  }

  public ngOnDestroy(): void {
    this.tableComponent = null;
  }

  /**
   * ??????????????????
   */
  private initPageJump(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.procId = params.procId;
      this.pageType = params.type;
      if (params.deviceType === DeviceTypeEnum.wisdom) {
        this.isWisdomDevice = true;
      }
      if (params.type === WorkOrderPageTypeEnum.unfinished) {
        this.$installService.getDetailById(params.procId).subscribe((res: ResultModel<InstallWorkOrderModel>) => {
          if (res.code === ResultCodeEnum.success) {
            this.setPageData(res.data);
          }
        });
      } else {
        this.$installService.historyDetailById(params.procId).subscribe((res: ResultModel<InstallWorkOrderModel>) => {
          if (res.code === ResultCodeEnum.success) {
            this.setPageData(res.data);
          }
        });
      }
    });
  }

  /**
   * ??????????????????
   */
  private setPageData(data: any): void {
   this.deviceId = data.deviceId;
    data.statusName = this.inspectionLanguage[WorkOrderStatusEnum[data.status]];
    data.statusClass = WorkOrderStatusClassEnum[data.status];
    data.createTime = WorkOrderBusinessCommonUtil.formatterDate(data.createTime);
    if (data.planCompletedTime) {
      data.planCompletedTime = WorkOrderBusinessCommonUtil.formatterDate(data.planCompletedTime);
    }
    if (data.startTime) {
      data.startTime = WorkOrderBusinessCommonUtil.formatterDate(data.startTime);
    }
    if (data.realityCompletedTime) {
      data.realityCompletedTime = WorkOrderBusinessCommonUtil.formatterDate(data.realityCompletedTime);
    }
    // ????????????
    if (data.lastDays >= 1 && data.lastDays <= 3) {
      data.latsDayClass = LastDaysIconClassEnum.lastDay_1;
    } else if (data.lastDays > 3) {
      data.latsDayClass = LastDaysIconClassEnum.lastDay_2;
    } else {
      data.latsDayClass = LastDaysIconClassEnum.lastDay_3;
    }
    // ???????????????????????????class
    if (data.deviceType) {
      /*if (data.deviceType === DeviceTypeEnum.wisdom) {
        this.isWisdomDevice = true;
      }*/
      data.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, data.deviceType);
      if (data.deviceTypeName) {
        data.deviceClass = CommonUtil.getFacilityIconClassName(data.deviceType);
      }
    }
    // ???????????????????????????class
    if (data.equipmentType) {
      data.equipmentTypeName = WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, data.equipmentType);
      if (data.equipmentTypeName) {
        data.equipmentTypeClass = CommonUtil.getEquipmentIconClassName(data.equipmentType);
      }
    }
    // ????????????
    if (data.singleBackReason === ReasonForChargeback.falsePositive) {
      data.singleBackUserDefinedReason = this.inspectionLanguage.falsePositive;
    } else {
      data.singleBackUserDefinedReason = data.singleBackUserDefinedReason ? data.singleBackUserDefinedReason : '';
    }
    data.turnReason = data.turnReason ? data.turnReason : '';
    data.remark = data.remark ? data.remark : '';
    if (data.equipment && data.equipment.length) {
      data.equipmentName = data.equipment[0].equipmentName;
      // ??????????????????
      this.installEquipmentId = data.equipment[0].equipmentId;
      this.refreshData();
    }
    // ????????????
    if (data.autoDispatch === IsSelectAllEnum.right) {
      data.autoDispatchStr = this.inspectionLanguage.autoDispatchStr;
    }
    // ????????????
    data.costInfo = '';
    if (data.cost && data.cost.length) {
      const arr = data.cost.map(v => v.cost);
      data.costInfo = arr.join(',');
    }
    this.resultData = data;
  }

  /**
   * ????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    const obj = this.queryCondition.filterConditions.find(v => v.filterField === 'equipmentId');
    if (!obj) {
      this.queryCondition.filterConditions.push({
        filterField: 'equipmentId',
        filterValue: [this.installEquipmentId],
        operator: OperatorEnum.in
      });
    }
    this.$installService.queryEquipList(this.queryCondition).subscribe((result: ResultModel<EquipmentListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.installEquipmentData = result.data || [];
        this.installEquipmentData.forEach(item => {
          // ??????????????????
          const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
          item.facilityRelocation = true;
          item.deviceConfiguration = <string>item.equipmentModelType !== HostTypeEnum.PassiveLock;
          item.statusIconClass = iconStyle.iconClass;
          item.statusColorClass = iconStyle.colorClass;
          // ???????????????????????????class
          if (item.equipmentType) {
            item.equipmentTypeName = WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, item.equipmentType);
            if (item.equipmentTypeName) {
              item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
            }
          }
        });
      }
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    // ?????????????????????
    this.resultEquipmentStatus = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, this.languageEnum.facility) as SelectModel[];
    this.resultEquipmentStatus = this.resultEquipmentStatus.filter(item => item.code !== this.equipmentStatusEnum.dismantled);
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '06-4-1-5',
      closeCacheQueryConditions: true,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: false,
      showSearchExport: false,
      notShowPrint: true,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        { // ????????????
          title: this.facilityLanguage.deviceCode_a, key: 'equipmentCode', width: 150,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}},
          configurable: false, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.facilityLanguage.deviceName, key: 'equipmentName', width: 150,
          configurable: true, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.facilityLanguage.deviceType, key: 'equipmentTypeName', width: 150,
          configurable: true, isShowSort: true,
          searchKey: 'equipmentType', searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.equipTemp,
        },
        { // ??????
          title: this.facilityLanguage.deviceStatus, key: 'equipmentStatus', width: 150,
          configurable: true, isShowSort: true, searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.resultEquipmentStatus,
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.equipmentStatusFilterTemp,
        },
        { // ??????
          title: this.facilityLanguage.model, key: 'equipmentModel', width: 150,
          configurable: true, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        { // ?????????
          title: this.facilityLanguage.supplierName, key: 'supplier', width: 150,
          configurable: true, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.facilityLanguage.scrapTime, key: 'scrapTime', width: 150,
          configurable: true, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.facilityLanguage.affiliatedDevice, key: 'deviceName', width: 150,
          configurable: true, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.facilityLanguage.mountPosition, key: 'mountPosition', width: 150,
          configurable: true, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.facilityLanguage.installationDate, key: 'installationDate', width: 150,
          configurable: true, isShowSort: true, searchable: true,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd',
          searchConfig: {type: 'dateRang'}
        },
        { // ????????????
          title: this.facilityLanguage.company, key: 'company', width: 150,
          configurable: true, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.facilityLanguage.businessStatus, key: 'businessStatus', width: 150,
          configurable: true, isShowSort: true, searchable: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(OrderBusinessStatusEnum, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.equipmentBusinessTemp,
        },
        { // ????????????
          title: this.facilityLanguage.affiliatedArea, key: 'areaName', width: 150,
          configurable: true, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.facilityLanguage.address, key: 'address',
          configurable: true, width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        { // ????????????
          title: this.facilityLanguage.gatewayName, key: 'gatewayName',
          configurable: true, width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.facilityLanguage.remarks, key: 'remarks',
          configurable: true, width: 200,
          searchable: true, isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {// ??????
          title: this.inspectionLanguage.operate, key: '', width: 70,
          configurable: false, searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      showPagination: false,
      showEsPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        // this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
  }
}
