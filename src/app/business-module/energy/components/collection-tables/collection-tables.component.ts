import {
  Component,
  OnInit,
  Output,
  ViewChild,
  Input,
  TemplateRef,
  EventEmitter,
} from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { EnergyLanguageInterface } from '../../../../../assets/i18n/energy/energy.language.interface';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';

import { PageModel } from '../../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../../shared-module/model/table-config.model';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../shared-module/model/query-condition.model';
import {
  DeployStatusEnum,
  DeviceStatusEnum,
  DeviceTypeEnum,
} from '../../../../core-module/enum/facility/facility.enum';
import { SelectModel } from '../../../../shared-module/model/select.model';
import { FacilityForCommonUtil } from '../../../../core-module/business-util/facility/facility-for-common.util';
import { FacilityService } from '../../../../core-module/api-service/facility/facility-manage';
import { CommonUtil } from '../../../../shared-module/util/common-util';
import { DeviceTypeCountModel } from '../../../../core-module/model/facility/device-type-count.model';
import { ResultModel } from '../../../../shared-module/model/result.model';
import { ImportMissionService } from '../../../../core-module/mission/import.mission.service';
import {
  EquipmentStatusEnum,
  EquipmentTypeEnum,
  CommunicationEquipmentStatusEnum
} from '../../../../core-module/enum/equipment/equipment.enum';
import { FacilityListModel } from '../../../../core-module/model/facility/facility-list.model';
import { LoopTypeEnum, LoopStatusEnum } from '../../../../core-module/enum/loop/loop.enum';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { EnergyApiService } from '../../share/service/energy/energy-api.service';
import { ResultCodeEnum } from '../../../../shared-module/enum/result-code.enum';
import { OperatorEnum } from '../../../../shared-module/enum/operator.enum';
import { switchPageEnum } from '../../share/enum/energy-config.enum';

@Component({
  selector: 'app-collection-tables',
  templateUrl: './collection-tables.component.html',
  styleUrls: ['./collection-tables.component.scss'],
})
export class CollectionTablesComponent implements OnInit {
  // ????????????
  @ViewChild('deviceStatusTemp') private deviceStatusTemp: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('deviceTypeTemp') private deviceTypeTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  // ??????????????????????????????
  @ViewChild('equipmentDeviceTypeTemp') equipmentDeviceTypeTemp: TemplateRef<HTMLDocument>;

  //  ??????????????????
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // ?????? id
  @Input() energyConsumptionNodeId: string;
  // ????????????????????? ?????? devive ?????? equipment ?????? loop
  @Input() tableType: string = 'device';
  // ?????? ?????????????????????
  @Input() tranTableData: any = [];
  /* ????????????????????????????????? */
  @Input() switchPage: switchPageEnum;
  @Input()
  set visible(params) {
    this._visible = params;
    this.visibleChange.emit(this._visible);
  }
  // ??????modal???????????????
  get visible() {
    return this._visible;
  }

  // ??????????????????
  @Output() public visibleChange = new EventEmitter<any>();
  // ????????????
  public _visible = false;
  tableCheckModalTitle: string;

  // ????????????
  public dataSet = [];
  // ??????????????????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();

  // ????????????
  public deviceTypeCode = DeviceTypeEnum;
  // ??????????????????
  public deviceTypeEnum = DeviceTypeEnum;
  // ???????????????????????????
  private deviceRoleTypes: SelectModel[];

  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;
  public communicationEquipmentStatusEnum = CommunicationEquipmentStatusEnum;

  // ????????????????????????
  public filterDeviceName: string = '';
  // ????????????
  public filterValue: FilterCondition;
  // ?????????????????????
  public facilityVisible: boolean = false;
  // ?????????????????????
  public selectFacility: FacilityListModel[] = [];

  // ??????????????????
  public deviceStatusEnum = DeviceStatusEnum; // ????????????
  private resultDeviceStatus: SelectModel[];

  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ???????????????
  public language: EnergyLanguageInterface;
  constructor(
    private $nzI18n: NzI18nService,
    private $facilityService: FacilityService,
    private $refresh: ImportMissionService,
    public $message: FiLinkModalService,
    private $energyApiService: EnergyApiService,
  ) {}

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
    this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // ?????????????????????
    this.resultDeviceStatus = CommonUtil.codeTranslate(
      DeviceStatusEnum,
      this.$nzI18n,
      null,
    ) as SelectModel[];
    // this.resultDeviceStatus = this.resultDeviceStatus.filter(
    //   (item) => item.code !== this.deviceStatusEnum.dismantled,
    // );
    this.initTableConfig();
    // ??????????????????
    this.refreshData();

    // ????????????????????????
    this.$refresh.refreshChangeHook.subscribe((event) => {
      if (event) {
        // ????????????????????????
        this.queryDeviceTypeCount();
        // ??????????????????
        this.refreshData();
      }
    });
  }
  /**
   *  ???????????????
   */
  private initTableConfig(): void {
    let columnConfig = [];
    switch (this.tableType) {
      // ??????
      case 'device':
        columnConfig = [
          {
            //  ??????
            type: 'serial-number',
            width: 62,
            title: this.language.serialNumber,
          },
          {
            // ??????
            title: this.language.nodesDetails.facilityName,
            key: 'deviceName',
            width: 130,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          {
            // ??????
            title: this.language.nodesDetails.facilityType,
            key: 'deviceType',
            isShowSort: true,
            type: 'render',
            width: 150,
            searchable: true,
            renderTemplate: this.deviceTypeTemp,
            searchConfig: {
              type: 'select',
              selectType: 'multiple',
              selectInfo: this.deviceRoleTypes,
              label: 'label',
              value: 'code',
            },
          },
          // ??????
          {
            title: this.language.nodesDetails.model,
            key: 'deviceModel',
            width: 130,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          // ????????????
          {
            title: this.language.nodesDetails.numberOfEquipment,
            key: 'equipmentQuantity',
            width: 130,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          {
            // ??????
            title: this.language.nodesDetails.facilityStatus,
            key: 'deviceStatus',
            width: 110,
            type: 'render',
            renderTemplate: this.deviceStatusTemp,
            searchable: true,
            isShowSort: true,
            searchConfig: {
              type: 'select',
              selectType: 'multiple',
              selectInfo: this.resultDeviceStatus,
              label: 'label',
              value: 'code',
            },
          },
          {
            // ????????????
            title: this.language.nodesDetails.detailedAddress,
            key: 'address',
            searchable: true,
            width: 150,
            searchConfig: { type: 'input' },
          },
          {
            title: this.language.operate,
            searchable: true,
            searchConfig: { type: 'operate' },
            key: '',
            width: 120,
            fixedStyle: { fixedRight: true, style: { right: '0px' } },
          },
        ];
        break;
      // ??????
      case 'equipment':
        const equipmentLList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
        const selectInfo =
          this.switchPage === switchPageEnum.energyNodes
            ? equipmentLList.filter(
                (item) =>
                  item.code === EquipmentTypeEnum.singleLightController ||
                  item.code === EquipmentTypeEnum.centralController,
              )
            : equipmentLList;
        columnConfig = [
          {
            //  ??????
            type: 'serial-number',
            width: 62,
            title: this.language.serialNumber,
          },
          {
            // ??????
            title: this.language.nodesDetails.equipmentName,
            key: 'equipmentName',
            width: 130,
            configurable: false,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          // ????????????
          {
            title: this.language.nodesDetails.equipmentType,
            key: 'equipmentType',
            isShowSort: true,
            type: 'render',
            width: 160,
            searchable: true,
            renderTemplate: this.equipmentTypeTemp,
            searchConfig: {
              type: 'select',
              selectType: 'multiple',
              selectInfo,
              label: 'label',
              value: 'code',
            },
          },
          // ??????
          {
            title: this.language.nodesDetails.equipmentStatus,
            key: 'equipmentStatus',
            width: 110,
            type: 'render',
            renderTemplate: this.equipmentStatusFilterTemp,
            searchable: true,
            isShowSort: true,
            searchConfig: {
              type: 'select',
              selectType: 'multiple',
              selectInfo: CommonUtil.codeTranslate(
                CommunicationEquipmentStatusEnum,
                this.$nzI18n,
                null,
                this.languageEnum.facility,
              ),
              label: 'label',
              value: 'code',
            },
          },
          {
            // ????????????
            title: this.language.nodesDetails.facilities,
            key: 'deviceName',
            searchKey: 'deviceId',
            width: 150,
            configurable: false,
            searchable: true,
            isShowSort: true,
            searchConfig: {
              type: 'render',
              renderTemplate: this.deviceFilterTemplate,
            },
          },
          // ????????????
          {
            title: this.language.nodesDetails.facilityType,
            key: 'deviceType',
            isShowSort: true,
            type: 'render',
            width: 150,
            searchable: true,
            renderTemplate: this.equipmentDeviceTypeTemp,
            searchConfig: {
              type: 'select',
              selectType: 'multiple',
              selectInfo: this.deviceRoleTypes,
              label: 'label',
              value: 'code',
            },
          },
          {
            // ????????????
            title: this.language.nodesDetails.detailedAddress,
            key: 'address',
            searchable: true,
            width: 150,
            configurable: false,
            searchConfig: { type: 'input' },
          },
          {
            title: this.language.operate,
            searchable: true,
            searchConfig: { type: 'operate' },
            key: '',
            width: 120,
            fixedStyle: { fixedRight: true, style: { right: '0px' } },
          },
        ];
        break;
      // ??????
      case 'loop':
        columnConfig = [
          {
            //  ??????
            type: 'serial-number',
            width: 62,
            title: this.language.serialNumber,
          },
          {
            // ??????
            title: this.language.nodesDetails.circuitName,
            key: 'loopName',
            width: 130,
            configurable: false,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          // ????????????
          {
            title: this.language.nodesDetails.circuitNumber,
            key: 'loopCode',
            width: 150,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          // ??????
          {
            title: this.language.nodesDetails.circuitType,
            key: 'loopType',
            width: 150,
            searchable: true,
            isShowSort: true,
            searchConfig: {
              type: 'select',
              selectType: 'multiple',
              selectInfo: CommonUtil.codeTranslate(
                LoopTypeEnum,
                this.$nzI18n,
                null,
                LanguageEnum.facility,
              ),
              label: 'label',
              value: 'code',
            },
          },
          // ??????
          {
            title: this.language.nodesDetails.circuitStatus,
            key: 'loopStatus',
            width: 120,
            searchable: true,
            isShowSort: true,
            searchConfig: {
              type: 'select',
              selectInfo: CommonUtil.codeTranslate(
                LoopStatusEnum,
                this.$nzI18n,
                null,
                LanguageEnum.facility,
              ),
              label: 'label',
              value: 'code',
            },
          },
          // ???????????????
          {
            title: this.language.nodesDetails.distributionBox,
            key: 'distributionBoxName',
            width: 150,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          {
            // ????????????
            title: this.language.nodesDetails.controlObject,
            key: 'centralizedControlIdName',
            width: 150,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          {
            // ??????
            title: this.language.nodesDetails.remarks,
            key: 'remark',
            width: 150,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          {
            title: this.language.operate,
            searchable: true,
            searchConfig: { type: 'operate' },
            key: '',
            width: 120,
            fixedStyle: { fixedRight: true, style: { right: '0px' } },
          },
        ];
        break;
    }
    this.tableConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      outHeight: 108,
      scroll: { x: '1804px', y: '450px' },
      noIndex: true,
      showSearchExport: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      columnConfig,
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // ????????????
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
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
  }

  // ????????????
  refreshData() {
    this.tableConfig.isLoading = true;
    let filterData: FilterCondition;
    let bizConditionData = {};
    // ????????????????????????????????????
    if (this.switchPage === switchPageEnum.energyNodes) {
      filterData = new FilterCondition(
        'energyConsumptionNodeId',
        OperatorEnum.like,
        this.energyConsumptionNodeId,
      );
      if (this.tableType === 'device') {
        bizConditionData = {
          energyConsumptionNodeDeviceInfo: {
            energyConsumptionNodeId: switchPageEnum.energyNodes,
          },
        };
      }
      if (this.tableType === 'equipment') {
        bizConditionData = {
          energyConsumptionNodeEquipmentInfo: {
            energyConsumptionNodeId: switchPageEnum.energyNodes,
          },
        };
      }
      if (this.tableType === 'loop') {
        bizConditionData = {
          energyConsumptionNodeLoopInfo: {
            energyConsumptionNodeId: switchPageEnum.energyNodes,
          },
        };
      }
    } else if (this.switchPage === switchPageEnum.timeData) {
      filterData = new FilterCondition(
        'equipmentId',
        OperatorEnum.like,
        this.energyConsumptionNodeId,
      );
      if (this.tableType === 'device') {
        bizConditionData = {
          energyConsumptionNodeDeviceInfo: {
            energyConsumptionNodeId: switchPageEnum.timeData,
          },
        };
      }
      if (this.tableType === 'equipment') {
        bizConditionData = {
          energyConsumptionNodeEquipmentInfo: {
            energyConsumptionNodeId: switchPageEnum.timeData,
          },
        };
      }
      if (this.tableType === 'loop') {
        bizConditionData = {
          energyConsumptionNodeLoopInfo: {
            energyConsumptionNodeId: switchPageEnum.timeData,
          },
        };
      }
    }
    this.queryCondition.filterConditions.push(filterData);
    this.queryCondition.bizCondition = bizConditionData;
    // ??????
    if (this.tableType === 'device') {
      this.tableCheckModalTitle = this.language.collectDeviceId;
      this.$energyApiService
        .energyNodesDeviceQueryById_API(this.queryCondition)
        .subscribe((result: any) => {
          if (result.code === ResultCodeEnum.success) {
            this.dataSet = result.data.data.map((item) => {
              const getInfo = item.deviceInfo;
              getInfo._deviceType = getInfo.deviceType;
              getInfo.iconClass = CommonUtil.getFacilityIconClassName(getInfo._deviceType);
              // ??????????????????icon??????
              const statusStyle = CommonUtil.getDeviceStatusIconClass(item.deviceStatus);
              item.deviceStatusIconClass = statusStyle.iconClass;
              item.deviceStatusColorClass = statusStyle.colorClass;

              return getInfo;
            });
            this.pageBean.Total = result.data.totalCount;
            this.pageBean.pageIndex = result.data.pageNum;
            this.pageBean.pageSize = result.data.size;
            this.tableConfig.isLoading = false;
          } else {
            this.tableConfig.isLoading = false;
            this.$message.error(result.msg);
          }
        });
    } else if (this.tableType === 'equipment') {
      this.tableCheckModalTitle = this.language.collectEquipmentId;
      this.$energyApiService
        .energyNodesEquipmentQueryById_API(this.queryCondition)
        .subscribe((result: any) => {
          if (result.code === ResultCodeEnum.success) {
            console.log(result, 'result');
            this.dataSet = result.data.data.map((itemData) => {
              const item = itemData.equipmentInfo;
              // ??????????????????
              const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
              item.statusIconClass = iconStyle.iconClass;
              item.statusColorClass = iconStyle.colorClass;
              // ???????????????????????????
              item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
              item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
              // ????????????
              item.deviceIconClass = CommonUtil.getFacilityIconClassName(item.deviceType);
              return item;
            });
            this.pageBean.Total = result.data.totalCount;
            this.pageBean.pageIndex = result.data.pageNum;
            this.pageBean.pageSize = result.data.size;
            this.tableConfig.isLoading = false;
          } else {
            this.tableConfig.isLoading = false;
            this.$message.error(result.msg);
          }
        });
    } else if (this.tableType === 'loop') {
      this.tableCheckModalTitle = this.language.collectLoopId;
      this.$energyApiService
        .energyNodesLoopQueryById_API(this.queryCondition)
        .subscribe((result: any) => {
          if (result.code === ResultCodeEnum.success) {
            console.log(result, 'result');
            this.dataSet = result.data.data.map((itemData) => {
              const item = itemData.loopInfo;
              // ??????????????????
              if (item.loopStatus !== null) {
                item.loopStatus = CommonUtil.codeTranslate(
                  LoopStatusEnum,
                  this.$nzI18n,
                  item.loopStatus,
                  LanguageEnum.facility,
                );
              }
              // ??????????????????????????????????????????
              if (item.loopType === LoopTypeEnum.customize) {
                item.loopType = item.customizeLoopType;
              } else {
                item.loopType = CommonUtil.codeTranslate(
                  LoopTypeEnum,
                  this.$nzI18n,
                  item.loopType,
                  LanguageEnum.facility,
                );
              }
              // ???????????????????????????????????????????????????
              item.isShowOperateIcon = !!item.centralizedControlId;
              return item;
            });
            this.pageBean.Total = result.data.totalCount;
            this.pageBean.pageIndex = result.data.pageNum;
            this.pageBean.pageSize = result.data.size;
            this.tableConfig.isLoading = false;
          } else {
            this.tableConfig.isLoading = false;
            this.$message.error(result.msg);
          }
        });
    }
  }

  // ????????????
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  // ????????????????????????
  private queryDeviceTypeCount(): void {
    this.$facilityService
      .queryDeviceTypeCount()
      .subscribe((result: ResultModel<Array<DeviceTypeCountModel>>) => {
        const data: Array<DeviceTypeCountModel> = result.data || [];
        if (!_.isEmpty(this.deviceRoleTypes)) {
          this.deviceRoleTypes
            .map((item) => item.code)
            .forEach((code) => {
              const type = data.find((item) => item.deviceType === code);
            });
        }
      });
  }

  // ?????????????????????????????????
  public onShowFacility(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    this.facilityVisible = true;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
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
  }
}
