import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { NzI18nService, NzModalService, UploadFile } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { addYears } from 'date-fns';
import {
  SortCondition,
  FilterCondition,
  QueryConditionModel,
} from '../../../../../shared-module/model/query-condition.model';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { TableConfigModel } from '../../../../../shared-module/model/table-config.model';
import { FacilityListModel } from '../../../../../core-module/model/facility/facility-list.model';
import { CommonUtil } from '../../../../../shared-module/util/common-util';
import { BusinessStatusEnum } from '../../../../../core-module/enum/equipment/equipment.enum';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { SelectModel } from '../../../../../shared-module/model/select.model';
import { ResultModel } from '../../../../../shared-module/model/result.model';
import { FacilityForCommonUtil } from '../../../../../core-module/business-util/facility/facility-for-common.util';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { FacilityLanguageInterface } from '../../../../../../assets/i18n/facility/facility.language.interface';
import {
  DeployStatusEnum,
  DeviceStatusEnum,
  DeviceTypeEnum,
  FacilityListTypeEnum,
  WellCoverTypeEnum,
} from '../../../../../core-module/enum/facility/facility.enum';
import { IrregularData, IS_TRANSLATION_CONST } from '../../../../../core-module/const/common.const';
import { OperatorEnum } from '../../../../../shared-module/enum/operator.enum';
import { EquipmentListModel } from '../../../../../core-module/model/equipment/equipment-list.model';
import { PageModel } from '../../../../../shared-module/model/page.model';
import { DismantleBarrierWorkOrderService } from '../../../share/service/dismantle-barrier';
import {
  EquipmentStatusEnum,
  EquipmentEnumStatus,
  EquipmentTypeEnum,
} from '../../../../../core-module/enum/equipment/equipment.enum';
import { HostTypeEnum } from '../../../../../core-module/enum/facility/Intelligent-lock/host-type.enum';
import {WorkOrderPageTypeEnum} from "../../../share/enum/work-order-page-type.enum";

/** ???????????? */
@Component({
  selector: 'app-remove-equipment',
  templateUrl: './remove-equipment.component.html',
  styleUrls: ['./remove-equipment.component.scss'],
})
export class RemoveEquipmentComponent implements OnInit {
  // ????????????
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  ??????????????????
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentBusinessTemp') equipmentBusinessTemp: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // ????????????????????????
  @ViewChild('deviceNameTemplate') deviceNameTemplate: TemplateRef<HTMLDocument>;
  /** ???????????? */
  @Input() filterEquipmentId;
  @Input() pageType;
  // ????????????
  public tableConfig: TableConfigModel;
  dataSet: EquipmentListModel[] = [];
  // ??????????????????
  public pageBean: PageModel = new PageModel();
  // ??????????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  public WorkOrderPageType = WorkOrderPageTypeEnum
  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;
  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ???????????????????????????
  private deviceRoleTypes: SelectModel[];
  // ????????????
  public resultDeviceStatus: SelectModel[];
  // ??????????????????
  public businessStatus = BusinessStatusEnum;
  // ??????????????????
  public businessStatusEnum = BusinessStatusEnum;
  // ??????????????????
  public deviceStatusEnum = DeviceStatusEnum;
  // ??????????????????
  public deviceTypeEnum = DeviceTypeEnum;
  // ????????????????????????
  public filterDeviceName: string = '';
  // ????????????
  public filterValue: FilterCondition;
  // ?????????????????????
  public facilityVisible: boolean = false;
  // ?????????????????????
  public selectFacility: FacilityListModel[] = [];
  public equipmentStatus
  // ???????????????
  public language: FacilityLanguageInterface;
  // ????????????
  public languageEnum = LanguageEnum;
  constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $dismantleBarrierWorkOrderService: DismantleBarrierWorkOrderService,
  ) {}

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    if(this.pageType == 'finished'){
    this.equipmentStatus =  CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, this.languageEnum.facility,) as SelectModel[]
    } else {
      this.equipmentStatus = CommonUtil.codeTranslate(EquipmentEnumStatus, this.$nzI18n, null, this.languageEnum.facility,) as SelectModel[]
    }
    this.initTableConfig();
    // ??????????????????
    this.refreshData();
  }

  /**
   * ?????????????????????
   */
  initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      keepSelected: true,
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: { x: '1804px', y: '340px' },
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      showImport: false,
      columnConfig: [
        {
          // ??????
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '0' } },
        },
        {
          // ??????
          title: this.language.name,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
        },
        {
          // ????????????
          title: this.language.deviceCode,
          key: 'equipmentCode',
          width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????id
          title: this.language.sequenceId,
          key: 'sequenceId',
          width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????
          title: this.language.type,
          key: 'equipmentType',
          isShowSort: true,
          type: 'render',
          configurable: true,
          width: 160,
          searchable: true,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code',
          },
        },
        {
          // ??????
          title: this.language.status,
          key: 'equipmentStatus',
          width: 130,
          type: 'render',
          renderTemplate: this.equipmentStatusFilterTemp,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.equipmentStatus,
            label: 'label',
            value: 'code',
          },
        },
        {
          //  ??????
          title: this.language.model,
          key: 'equipmentModel',
          width: 124,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ?????????
          title: this.language.supplierName,
          key: 'supplier',
          width: 125,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.scrapTime,
          key: 'scrapTime',
          width: 100,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.affiliatedDevice,
          key: 'deviceName',
          searchKey: 'deviceId',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceFilterTemplate,
          },
        },
        {
          // ????????????
          title: this.language.mountPosition,
          key: 'mountPosition',
          configurable: true,
          width: 100,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????????????????
          title: this.language.installationDate,
          width: 200,
          configurable: true,
          isShowSort: true,
          searchable: true,
          hidden: true,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd',
          searchConfig: { type: 'dateRang' },
          key: 'installationDate',
        },
        {
          // ????????????
          title: this.language.company,
          key: 'company',
          searchable: true,
          width: 150,
          configurable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.businessStatus,
          key: 'businessStatus',
          configurable: true,
          type: 'render',
          renderTemplate: this.equipmentBusinessTemp,
          width: 150,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(
              BusinessStatusEnum,
              this.$nzI18n,
              null,
              LanguageEnum.facility,
            ),
            label: 'label',
            value: 'code',
          },
        },
        {
          // ????????????
          title: this.language.affiliatedArea,
          key: 'areaName',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.address,
          key: 'address',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.gatewayName,
          key: 'gatewayName',
          configurable: true,
          hidden: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????
          title: this.language.remarks,
          key: 'remarks',
          configurable: true,
          hidden: true,
          width: 200,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 100,
          fixedStyle: { fixedRight: true, style: { right: '0px' } },
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // ??????????????????
      handleSearch: (event: FilterCondition[]) => {
        const deviceIndex = event.findIndex((row) => row.filterField === 'deviceId');
        // ?????????????????????????????????????????????ID??????????????????
        if (deviceIndex >= 0 && !_.isEmpty(event[deviceIndex].filterValue)) {
          event[deviceIndex].operator = OperatorEnum.in;
        } else {
          this.filterDeviceName = '';
          this.filterValue = null;
          event = event.filter((item) => item.filterField !== 'deviceId');
          this.selectFacility = [];
        }
        this.queryCondition.filterConditions = event;
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      },
    };
  }

  /**
   * ??????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    if (this.filterEquipmentId) {
      let filterValue;
      if (Array.isArray(this.filterEquipmentId)) {
        filterValue = this.filterEquipmentId.length ? [...this.filterEquipmentId] : ['null'];
      } else {
        filterValue = [this.filterEquipmentId];
      }

      this.queryCondition.filterConditions.push({
        filterField: 'equipmentId',
        filterValue,
        operator: OperatorEnum.in,
      });
    }
    // if(this.pageType === this.WorkOrderPageType.unfinished){
      this.$dismantleBarrierWorkOrderService
        .listEquipmentForListPageNewWO(this.queryCondition)
        .subscribe(
          (result: ResultModel<EquipmentListModel[]>) => {
            this.tableConfig.isLoading = false;
            if (result.code === ResultCodeEnum.success) {
              this.pageBean.Total = result.totalCount;
              this.pageBean.pageIndex = result.pageNum;
              this.pageBean.pageSize = result.size;
              this.dataSet = result.data || [];
              // ?????????????????????????????????co
              this.dataSet.forEach((item) => {
                // ??????????????????
                const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
                item.facilityRelocation = true;
                item.deviceConfiguration =
                  <string>item.equipmentModelType !== HostTypeEnum.PassiveLock;
                item.statusIconClass = iconStyle.iconClass;
                item.statusColorClass = iconStyle.colorClass;
                // ???????????????????????????
                item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
                // ?????????????????????????????????????????????????????????
                if (item.installationDate && item.scrapTime) {
                  const now = new Date().getTime();
                  const tempDate = new Date(Number(item.installationDate));
                  tempDate.setFullYear(tempDate.getFullYear() + Number(item.scrapTime));
                  item.rowStyle = now > tempDate.getTime() ? IrregularData : {};
                }
              });
            } else {
              this.$message.error(result.msg);
            }
          },
          () => {
            this.tableConfig.isLoading = false;
          },
        );
    // }
  }

  /**
   * ????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ?????????????????????????????????
   */
  public onShowFacility(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    this.facilityVisible = true;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    } else {
      const deviceNameArr = this.filterValue.filterName.split(',');
      this.selectFacility = this.filterValue.filterValue.map((item, index) => {
        return { deviceId: item, deviceName: deviceNameArr[index] };
      });
    }
  }

  /**
   * ??????????????????
   */
  public onFacilityChange(event: FacilityListModel[]): void {
    this.filterValue.filterValue =
      event.map((item) => {
        return item.deviceId;
      }) || [];
    this.selectFacility = event || [];
    if (!_.isEmpty(event)) {
      this.filterDeviceName = event
        .map((item) => {
          return item.deviceName;
        })
        .join(',');
    } else {
      this.filterDeviceName = '';
    }
    this.filterValue.filterName = this.filterDeviceName;
  }
}
