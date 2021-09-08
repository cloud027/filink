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
  // 设施状态
  @ViewChild('deviceStatusTemp') private deviceStatusTemp: TemplateRef<HTMLDocument>;
  // 设施类型模板
  @ViewChild('deviceTypeTemp') private deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 设备类型
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  // 设备中的设施类型模板
  @ViewChild('equipmentDeviceTypeTemp') equipmentDeviceTypeTemp: TemplateRef<HTMLDocument>;

  //  设备状态模版
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 设施过滤模版
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // 节点 id
  @Input() energyConsumptionNodeId: string;
  // 选择的表格类型 设施 devive 设备 equipment 回路 loop
  @Input() tableType: string = 'device';
  // 获取 传递的表格数据
  @Input() tranTableData: any = [];
  /* 判断是哪个页面调用组件 */
  @Input() switchPage: switchPageEnum;
  @Input()
  set visible(params) {
    this._visible = params;
    this.visibleChange.emit(this._visible);
  }
  // 获取modal框显示状态
  get visible() {
    return this._visible;
  }

  // 显示隐藏变化
  @Output() public visibleChange = new EventEmitter<any>();
  // 显示隐藏
  public _visible = false;
  tableCheckModalTitle: string;

  // 列表数据
  public dataSet = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();

  // 设施枚举
  public deviceTypeCode = DeviceTypeEnum;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 登录有权限设施类型
  private deviceRoleTypes: SelectModel[];

  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  public communicationEquipmentStatusEnum = CommunicationEquipmentStatusEnum;

  // 过滤框显示设施名
  public filterDeviceName: string = '';
  // 设施过滤
  public filterValue: FilterCondition;
  // 设施过滤选择器
  public facilityVisible: boolean = false;
  // 已选择设施数据
  public selectFacility: FacilityListModel[] = [];

  // 设施状态枚举
  public deviceStatusEnum = DeviceStatusEnum; // 设施状态
  private resultDeviceStatus: SelectModel[];

  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 设施语言包
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
    // 过滤已拆除状态
    this.resultDeviceStatus = CommonUtil.codeTranslate(
      DeviceStatusEnum,
      this.$nzI18n,
      null,
    ) as SelectModel[];
    // this.resultDeviceStatus = this.resultDeviceStatus.filter(
    //   (item) => item.code !== this.deviceStatusEnum.dismantled,
    // );
    this.initTableConfig();
    // 查询列表数据
    this.refreshData();

    // 监听列表数据刷新
    this.$refresh.refreshChangeHook.subscribe((event) => {
      if (event) {
        // 查询设备统计数据
        this.queryDeviceTypeCount();
        // 查询列表数据
        this.refreshData();
      }
    });
  }
  /**
   *  初始化表格
   */
  private initTableConfig(): void {
    let columnConfig = [];
    switch (this.tableType) {
      // 设施
      case 'device':
        columnConfig = [
          {
            //  序号
            type: 'serial-number',
            width: 62,
            title: this.language.serialNumber,
          },
          {
            // 名称
            title: this.language.nodesDetails.facilityName,
            key: 'deviceName',
            width: 130,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          {
            // 类型
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
          // 型号
          {
            title: this.language.nodesDetails.model,
            key: 'deviceModel',
            width: 130,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          // 设备数量
          {
            title: this.language.nodesDetails.numberOfEquipment,
            key: 'equipmentQuantity',
            width: 130,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          {
            // 状态
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
            // 详细地址
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
      // 设备
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
            //  序号
            type: 'serial-number',
            width: 62,
            title: this.language.serialNumber,
          },
          {
            // 名称
            title: this.language.nodesDetails.equipmentName,
            key: 'equipmentName',
            width: 130,
            configurable: false,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          // 设备类型
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
          // 状态
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
            // 所属设施
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
          // 设施类型
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
            // 详细地址
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
      // 回路
      case 'loop':
        columnConfig = [
          {
            //  序号
            type: 'serial-number',
            width: 62,
            title: this.language.serialNumber,
          },
          {
            // 名称
            title: this.language.nodesDetails.circuitName,
            key: 'loopName',
            width: 130,
            configurable: false,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          // 回路编号
          {
            title: this.language.nodesDetails.circuitNumber,
            key: 'loopCode',
            width: 150,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          // 类型
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
          // 状态
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
          // 所属配电箱
          {
            title: this.language.nodesDetails.distributionBox,
            key: 'distributionBoxName',
            width: 150,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          {
            // 控制对象
            title: this.language.nodesDetails.controlObject,
            key: 'centralizedControlIdName',
            width: 150,
            searchable: true,
            isShowSort: true,
            searchConfig: { type: 'input' },
          },
          {
            // 备注
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
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 过滤查询
      handleSearch: (event: FilterCondition[]) => {
        const deviceIndex = event.findIndex((row) => row.filterField === 'deviceId');
        // 使用设施选择器的设施之后对设施ID过滤进行处理
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

  // 表格刷新
  refreshData() {
    this.tableConfig.isLoading = true;
    let filterData: FilterCondition;
    let bizConditionData = {};
    // 说明是从节点页面进入组件
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
    // 设施
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
              // 处理设施状态icon图标
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
              // 设置状态样式
              const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
              item.statusIconClass = iconStyle.iconClass;
              item.statusColorClass = iconStyle.colorClass;
              // 获取设备类型的图标
              item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
              item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
              // 设施图标
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
              // 回路状态转换
              if (item.loopStatus !== null) {
                item.loopStatus = CommonUtil.codeTranslate(
                  LoopStatusEnum,
                  this.$nzI18n,
                  item.loopStatus,
                  LanguageEnum.facility,
                );
              }
              // 回路类型不是自定义国际化转换
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
              // 如果没有控制对象就不显示拉闸和合闸
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

  // 表格分页
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  // 查询设施类型总数
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

  // 点击输入框弹出设施选择
  public onShowFacility(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    this.facilityVisible = true;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
  }
  /**
   * 选择设施数据
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
