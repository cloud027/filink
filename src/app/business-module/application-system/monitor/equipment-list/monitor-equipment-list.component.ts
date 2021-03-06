import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ApplicationInterface } from '../../../../../assets/i18n/application/application.interface';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { Router } from '@angular/router';
import { NzI18nService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { ResultModel } from '../../../../shared-module/model/result.model';
import { OperationButtonEnum } from '../../share/enum/operation-button.enum';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../shared-module/model/query-condition.model';
import { OperatorEnum } from '../../../../shared-module/enum/operator.enum';
import { AssetManagementLanguageInterface } from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import { PageModel } from '../../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../../shared-module/model/table-config.model';
import { MonitorListModel } from '../../share/model/monitor-list.model';
import { FacilityLanguageInterface } from '../../../../../assets/i18n/facility/facility.language.interface';
import {
  EquipmentStatusEnum,
  EquipmentTypeEnum,
} from '../../../../core-module/enum/equipment/equipment.enum';
import { FacilityForCommonUtil } from '../../../../core-module/business-util/facility/facility-for-common.util';
import { CommonUtil } from '../../../../shared-module/util/common-util';
import { BusinessStatusEnum } from '../../share/enum/camera.enum';
import { FacilityListModel } from '../../../../core-module/model/facility/facility-list.model';
import { ApplicationService } from '../../share/service/application.service';
import { ResultCodeEnum } from '../../../../shared-module/enum/result-code.enum';
import { IndexLanguageInterface } from '../../../../../assets/i18n/index/index.language.interface';
import { PolicyEnum } from '../../share/enum/policy.enum';
import { ChooseTypeEnum, FacilityListTypeEnum } from '../../share/enum/monitor-config.enum';
import { ListExportModel } from '../../../../core-module/model/list-export.model';
import { ExportRequestModel } from '../../../../shared-module/model/export-request.model';
import { EquipmentListModel } from '../../../../core-module/model/equipment/equipment-list.model';
import { IS_TRANSLATION_CONST } from '../../../../core-module/const/common.const';
import { FacilityService } from '../../../../core-module/api-service/facility/facility-manage';

import { SessionUtil } from '../../../../shared-module/util/session-util';
import { MonitorWorkBenchEnum } from '../../share/enum/auth.code.enum';

import { SelectFacilityChangeService } from '../../share/service/select-facility-change.service';

import {SelectModel} from '../../../../shared-module/model/select.model';


@Component({
  selector: 'app-monitor-equipment-list',
  templateUrl: './monitor-equipment-list.component.html',
  styleUrls: ['./monitor-equipment-list.component.scss'],
})
export class MonitorEquipmentListComponent implements OnInit {
  // ????????????
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('equipmentStatusTemp') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentBusinessTemp') equipmentBusinessTemp: TemplateRef<HTMLDocument>;
  // ??????
  @ViewChild('remarkTable') remarkTable: TemplateRef<HTMLDocument>;
  // ????????????
  public loopModalTitle: string;
  // ????????????
  public dataSet: MonitorListModel[] = [];
  // ??????????????????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;
  // ??????????????????
  public equipmentTypeList = [];
  // ??????????????????
  public businessStatusEnum = BusinessStatusEnum;
  // ????????????????????????
  public filterDeviceName: string = '';
  // ?????????????????????
  public facilityVisible: boolean = false;
  // ????????????
  public filterValue: FilterCondition;
  // ?????????????????????
  public selectFacilityData: FacilityListModel[] = [];

  /** ?????? ??????????????? */
  ChooseType = ChooseTypeEnum;
  /** ???????????????????????????????????? ???????????? */
  public selectedType: string = ChooseTypeEnum.collect;
  /** ??????or?????? */
  public facilityOrEquipment: string = FacilityListTypeEnum.equipmentList;

  // ?????????????????????????????????
  public isShowUpIcon: boolean = true;
  // ????????????????????????
  public isShowTable: boolean = true; // ??????????????????????????????

  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  public OperationButtonEnum = OperationButtonEnum;
  /** ?????????????????? */
  public selectFacility: boolean = true;

  /**??????????????????????????????????????????????????? */
  public hasEquipmentMapAuth: boolean;
  // ????????????
  private resultEquipmentStatus: SelectModel[];

  // ??????????????????code??? ?????????????????????????????????????????????
  equipmentAuthCode: string = MonitorWorkBenchEnum.equipmentList;

  // ?????????
  public language: ApplicationInterface;
  // ???????????????
  public assetLanguage: AssetManagementLanguageInterface;
  // ???????????????
  public equipmentLanguage: FacilityLanguageInterface;
  // ?????????????????????
  public languageEnum = LanguageEnum;
  indexLanguage: IndexLanguageInterface;
  constructor(
    private $router: Router,
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    // ????????????
    private $applicationService: ApplicationService,
    private $equipmentAipService: FacilityService,
    private $selectFacilityChangeService: SelectFacilityChangeService,
  ) {}

  ngOnInit() {
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // ?????????????????????
    this.resultEquipmentStatus =     CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, this.languageEnum.facility,) as SelectModel[];
    this.resultEquipmentStatus = this.resultEquipmentStatus.filter(item => item.code !== this.equipmentStatusEnum.dismantled);
    // ??????????????????????????????
    this.$selectFacilityChangeService.eventEmit.subscribe((value) => {
      if (value.equipmentIds && value.equipmentIds.length) {
        // ??????????????????????????????
        this.queryCondition.filterConditions = [
          new FilterCondition('equipmentId', OperatorEnum.in, value.equipmentIds),
        ];
      } else {
        this.queryCondition.filterConditions = [new FilterCondition()];
      }
      this.refreshData();
    });
    this.initTableConfig();
    this.refreshData();

    this.getListByAuthCode();
  }

  /**
   * ????????????????????????????????????????????????
   */
  public getListByAuthCode(): void {
    // ?????????????????????????????????
    const hasEquipmentAuthCode = this.checkHasRole(this.equipmentAuthCode);
    if (hasEquipmentAuthCode) {
      // ???????????????????????????????????????
      this.hasEquipmentMapAuth = true;
    }
  }
  /**
   * ???????????????????????????
   */
  public onShowTable(event: boolean): void {
    this.isShowTable = event;
  }
  /**
   * ????????????????????????????????????
   */
  public checkHasRole(code: string): boolean {
    return SessionUtil.checkHasRole(code);
  }
  // ?????????????????????
  private initTableConfig(): void {
    this.equipmentTypeList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(
      (item) => item.code === EquipmentTypeEnum.weatherInstrument,
    );
    this.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: { x: '1600px', y: '600px' },
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      columnConfig: [
        {
          // ??????
          type: 'serial-number',
          width: 62,
          title: this.language.frequentlyUsed.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '0px' } },
        },
        {
          // ??????
          title: this.language.strategyList.alarmDeviceName,
          key: 'equipmentName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
        },
        // ????????????
        {
          title: this.language.equipmentTable.assetNumber,
          key: 'equipmentCode',
          width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????
          title: this.equipmentLanguage.type,
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
            selectInfo: this.equipmentTypeList,
            label: 'label',
            value: 'code',
          },
        },
        {
          // ??????
          title: this.equipmentLanguage.status,
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
            selectInfo:this.resultEquipmentStatus,
            label: 'label',
            value: 'code',
          },
        },
        {
          //  ??????
          title: this.equipmentLanguage.model,
          key: 'equipmentModel',
          width: 124,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.equipmentLanguage.affiliatedDevice,
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
          // ??????????????????
          title: this.equipmentLanguage.installationDate,
          width: 200,
          configurable: true,
          isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: { type: 'dateRang' },
          key: 'installationDate',
        },
        {
          // ?????????
          title: this.equipmentLanguage.supplierName,
          key: 'supplier',
          width: 125,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.equipmentLanguage.scrapTime,
          key: 'scrapTime',
          width: 100,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.equipmentLanguage.company,
          key: 'company',
          searchable: true,
          width: 150,
          configurable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.equipmentLanguage.businessStatus,
          key: 'businessStatus',
          configurable: true,
          type: 'render',
          renderTemplate: this.equipmentBusinessTemp,
          width: 150,
          searchable: true,
          isShowSort: true,
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
          title: this.equipmentLanguage.affiliatedArea,
          key: 'areaName',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.equipmentLanguage.mountPosition,
          key: 'mountPosition',
          configurable: true,
          width: 100,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.equipmentLanguage.gatewayName,
          key: 'gatewayName',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        // ????????????
        {
          title: this.language.MonitorWorkbench.loop,
          key: 'loop',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????
          title: this.equipmentLanguage.remarks,
          key: 'remarks',
          configurable: true,
          width: 200,
          searchable: true,
          isShowSort: true,
          renderTemplate: this.remarkTable,
          searchConfig: { type: 'input' },
        },
        {
          title: this.equipmentLanguage.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 120,
          fixedStyle: { fixedRight: false, style: { right: '0px' } },
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      // ????????????
      moreButtons: [],
      operation: [
        // ??????
        {
          text: this.language.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: '09-7-3',
          handle: (data: MonitorListModel) => {
            this.handEquipmentOperation(data);
          },
        },
      ],
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // ??????
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
  }
  // ????????????
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  refreshData() {
    const strategyType = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, [
      EquipmentTypeEnum.weatherInstrument,
    ]);
    this.queryCondition.filterConditions = this.queryCondition.filterConditions.concat([
      strategyType,
    ]);
    this.$applicationService.monitorQueryListData_API(this.queryCondition).subscribe(
      (result: ResultModel<any[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          const { totalCount, pageNum, data, size } = result;
          console.log(result, 'result');
          this.dataSet = data;
          this.pageBean.Total = totalCount;
          this.pageBean.pageIndex = pageNum;
          this.pageBean.pageSize = size;
          if (this.dataSet.length) {
            this.dataSet.forEach((item) => {
              // ??????????????????
              const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
              item.statusIconClass = iconStyle.iconClass;
              item.statusColorClass = iconStyle.colorClass;
              // ???????????????????????????
              item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
            });
          }
        } else {
          this.$message.error(result.msg);
        }
      },
      () => (this.tableConfig.isLoading = false),
    );
  }
  // ?????????????????????????????????
  public onShowFacility(value: FilterCondition): void {
    this.filterValue = value;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    this.facilityVisible = true;
  }
  // ??????????????????
  public onFacilityChange(event: FacilityListModel[]): void {
    this.selectFacilityData = event || [];
    if (!_.isEmpty(event)) {
      this.filterDeviceName = event
        .map((item) => {
          return item.deviceName;
        })
        .join(',');
    } else {
      this.filterDeviceName = '';
    }
    this.filterValue.filterValue =
      event.map((item) => {
        return item.deviceId;
      }) || [];
    this.filterValue.operator = OperatorEnum.in;
  }
  /** ???????????? */
  public handEquipmentOperation(data: MonitorListModel): void {
    this.$router
      .navigate(['/business/application/monitor/equipment-list/policy-details'], {
        queryParams: {
          equipmentId: data.equipmentId,
          equipmentType: data.equipmentType,
          equipmentModel: data.equipmentModel,
          equipmentStatus: data.equipmentStatus,
        },
      })
      .then();
  }
}
