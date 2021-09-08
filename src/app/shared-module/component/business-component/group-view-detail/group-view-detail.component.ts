import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {PageModel} from '../../../model/page.model';
import {TableConfigModel} from '../../../model/table-config.model';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../model/query-condition.model';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {LanguageEnum} from '../../../enum/language.enum';
import {CommonUtil} from '../../../util/common-util';
import {PAGE_NO_DEFAULT_CONST} from '../../../../core-module/const/common.const';
import {OperatorEnum} from '../../../enum/operator.enum';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {GroupListModel} from '../../../../core-module/model/group/group-list.model';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {SelectModel} from '../../../model/select.model';

/**
 * 查看分组详情
 */
@Component({
  selector: 'app-group-view-detail',
  templateUrl: './group-view-detail.component.html',
  styleUrls: ['./group-view-detail.component.scss', '../../../../business-module/facility/facility-common.scss']
})
export class GroupViewDetailComponent implements OnInit, OnDestroy {

  @Input()
  public groupModel: GroupListModel = new GroupListModel();
  // 设施状态
  @ViewChild('deviceStatusRef') private deviceStatusRef: TemplateRef<HTMLDocument>;
  // 设备状态
  @ViewChild('equipmentStatusRef') private equipmentStatusRef: TemplateRef<HTMLDocument>;
  // 设备类型
  @ViewChild('equipmentTypeRef') private equipmentTypeRef: TemplateRef<HTMLDocument>;
  // 设施过滤输入框
  @ViewChild('deviceSelectorTemplate') deviceSelectorTemplate: TemplateRef<HTMLDocument>;
  // 设备列表的设施类型模版
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 设被列表处的设施类型模版
  @ViewChild('deviceTypeRefEquipTemp') deviceTypeRefEquipTemp: TemplateRef<HTMLDocument>;
  // 设施数据集
  public facilityRefGroupData: FacilityListModel[] = [];
  // 设施的分页参数
  public facilityRefGroupPageBean: PageModel = new PageModel();
  // 设施列表的表格参数
  public facilityRefGroupTableConfig: TableConfigModel;
  // 设备列表数据集
  public equipmentRefGroupData: EquipmentListModel[] = [];
  // 设备列表分页参数
  public equipmentRefGroupPageBean: PageModel = new PageModel();
  // 设备列表的参数
  public equipmentRefGroupTableConfig: TableConfigModel;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设施状态
  public deviceStatusEnum = DeviceStatusEnum;
  // 设施国际化
  public facilityLanguage: FacilityLanguageInterface;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 设施选择器是否显示
  public facilityShow: boolean = false;
  // 设施过滤
  public filterValue: FilterCondition;
  // 选择的设施名称
  public filterDeviceNameStr: string;
  // 已选设施数据
  public selectedFacility: FacilityListModel[] = [];
  // 资产国际化
  public assetLanguage: AssetManagementLanguageInterface;
  //  公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 查询设施列表的参数
  private queryFacilityCondition: QueryConditionModel = new QueryConditionModel();
  // 查询设备列表的参数
  private queryEquipmentCondition: QueryConditionModel = new QueryConditionModel();
  // 分组内容设备列表设备状态筛选枚举
  private equipmentStatus;

  /**
   *  构造器
   */
  constructor(
    private $facilityForCommon: FacilityForCommonService,
    private $nzI18n: NzI18nService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.queryEquipmentCondition.bizCondition.groupId = this.groupModel.groupId;
    this.queryFacilityCondition.bizCondition.groupId = this.groupModel.groupId;
    this.equipmentStatus = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, LanguageEnum.facility);
    // 过滤已拆除状态枚举
    this.equipmentStatus = this.equipmentStatus.filter(item => item.code !== EquipmentStatusEnum.dismantled);
    // 初始化分组关联设施列表
    this.initFacilityTable();
    //  初始化分组关联设备列表
    this.initEquipmentTable();
    // 查询分组关联设施列表数据
    this.queryFacilityList();
    // 查询分组关联设备列表数据
    this.queryEquipmentList();
  }

  /**
   * 销毁组件
   */
  public ngOnDestroy(): void {
    this.deviceStatusRef = null;
    this.equipmentStatusRef = null;
    this.equipmentTypeRef = null;
  }

  /**
   *  设施列表分页查询
   */
  public onFacilityRefGroupPageChange(event: PageModel): void {
    this.queryFacilityCondition.pageCondition.pageNum = event.pageIndex;
    this.queryFacilityCondition.pageCondition.pageSize = event.pageSize;
    this.queryFacilityList();
  }

  /**
   * 设备列表分页查询
   */
  public onEquipmentRefGroupPageChange(event: PageModel): void {
    this.queryEquipmentCondition.pageCondition.pageSize = event.pageSize;
    this.queryEquipmentCondition.pageCondition.pageNum = event.pageIndex;
    this.queryEquipmentList();
  }

  /**
   * 选择设施过滤数据
   */
  public onSelectData(devices: FacilityListModel[]): void {
    this.selectedFacility = devices || [];
    if (_.isEmpty(devices)) {
      this.filterDeviceNameStr = '';
      this.filterValue.filterValue = [];
    } else {
      this.filterDeviceNameStr = devices.map(item => item.deviceName).join(',');
      this.filterValue.filterValue = devices.map(row => row.deviceId);
    }
  }

  /**
   * 显示设施选择器
   */
  public onShowDeviceSelector(filterValue: FilterCondition): void {
    this.facilityShow = true;
    this.filterValue = filterValue;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
  }

  /**
   * 初始化设施列表
   */
  private initFacilityTable(): void {
    this.facilityRefGroupTableConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      noAutoHeight: true,
      notShowPrint: true,
      scroll: {x: '600px', y: '400px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.facilityLanguage.serialNumber
        },
        { // 名称
          title: this.facilityLanguage.deviceName_a,
          key: 'deviceName',
          isShowSort: true,
          searchable: true,
          width: 200,
          searchConfig: {type: 'input'},
        },
        { // 类型
          title: this.facilityLanguage.deviceType_a,
          key: 'deviceType',
          width: 150,
          configurable: false,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.getFacilityTypeRoleSelect(),
            label: 'label',
            value: 'code'
          }
        },
        { // 型号
          title: this.facilityLanguage.model,
          key: 'deviceModel',
          width: 100,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // 设备数量
          title: this.assetLanguage.equipmentInfoNum,
          key: 'equipmentQuantity',
          isShowSort: true,
          width: 100,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // 设施状态
          title: this.facilityLanguage.deviceStatus_a,
          key: 'deviceStatus',
          isShowSort: true,
          type: 'render',
          renderTemplate: this.deviceStatusRef,
          width: 150,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, null),
            label: 'label',
            value: 'code'
          }
        },
        { // 详细地址
          title: this.facilityLanguage.address,
          key: 'address',
          isShowSort: true,
          width: 200,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [],
      handleSearch: (event: FilterCondition[]) => {
        this.queryFacilityCondition.filterConditions = event;
        this.queryFacilityCondition.pageCondition.pageNum = 1;
        this.queryFacilityList();
      },
      sort: (event: SortCondition) => {
        this.queryFacilityCondition.sortCondition = event;
        this.queryFacilityList();
      },
    };
  }

  /**
   *  初始化设备列表
   */
  private initEquipmentTable(): void {
    this.equipmentRefGroupTableConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      noAutoHeight: true,
      scroll: {x: '600px', y: '400px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.facilityLanguage.serialNumber,
        },
        { // 名称
          title: this.facilityLanguage.equipmentName,
          key: 'equipmentName',
          width: 200,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 类型
          title: this.facilityLanguage.equipmentType,
          key: 'equipmentTypeName',
          sortKey: 'equipmentType',
          searchKey: 'equipmentType',
          isShowSort: true,
          type: 'render',
          renderTemplate: this.equipmentTypeRef,
          width: 150,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.getEquipmentTypeRoleSelect(),
            label: 'label',
            value: 'code'
          }
        },
        { // 状态
          title: this.facilityLanguage.equipmentStatus,
          key: 'equipmentStatusName',
          sortKey: 'equipmentStatus',
          searchKey: 'equipmentStatus',
          width: 130,
          type: 'render',
          renderTemplate: this.equipmentStatusRef,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.equipmentStatus,
            label: 'label',
            value: 'code'
          }
        },
        { // 所属设施
          title: this.facilityLanguage.affiliatedDevice,
          key: 'deviceName',
          searchKey: 'deviceId',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceSelectorTemplate
          },
        },
        { // 设施类型
          title: this.facilityLanguage.deviceType_a,
          key: 'deviceType',
          width: 150,
          type: 'render',
          renderTemplate: this.deviceTypeRefEquipTemp,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.getFacilityTypeRoleSelect(),
            label: 'label',
            value: 'code'
          }
        },
        {  // 详细地址
          title: this.facilityLanguage.address,
          key: 'address',
          width: 250,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 110,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [],
      handleSearch: (event: FilterCondition[]) => {
        // 判断过滤条件是否包含设施的过滤
        const idx = event.findIndex(e => e.filterField === 'deviceId');
        if (idx >= 0 && !_.isEmpty(event[idx].filterValue)) {
          event[idx].operator = OperatorEnum.in;
        } else {
          this.filterValue = null;
          this.filterDeviceNameStr = '';
          this.selectedFacility = [];
          event = event.filter(item => item.filterField !== 'deviceId');
        }
        this.queryEquipmentCondition.pageCondition.pageNum = PAGE_NO_DEFAULT_CONST;
        this.queryEquipmentCondition.filterConditions = event;
        this.queryEquipmentList();
      },
      sort: (event: SortCondition) => {
        this.queryEquipmentCondition.sortCondition = event;
        this.queryEquipmentList();
      }
    };
  }

  /**
   * 查询分组设施详情列表
   */
  private queryFacilityList(): void {
    this.facilityRefGroupTableConfig.isLoading = true;
    this.$facilityForCommon.queryGroupDeviceInfoList(this.queryFacilityCondition).subscribe(
      (result: ResultModel<FacilityListModel[]>) => {
        this.facilityRefGroupTableConfig.isLoading = false;
        this.facilityRefGroupPageBean.Total = result.totalCount;
        this.facilityRefGroupPageBean.pageIndex = result.pageNum;
        this.facilityRefGroupPageBean.pageSize = result.size;
        if (result.code === ResultCodeEnum.success) {
          this.facilityRefGroupData = result.data;
          if (!_.isEmpty(this.facilityRefGroupData)) {
            this.facilityRefGroupData.forEach(row => {
              row.iconClass = CommonUtil.getFacilityIConClass(row.deviceType);
              // 处理状态图标和国际化
              const statusStyle = CommonUtil.getDeviceStatusIconClass(row.deviceStatus);
              row.deviceStatusIconClass = statusStyle.iconClass;
              row.deviceStatusColorClass = statusStyle.colorClass;
            });
          }
        }
      }, () => {
        this.facilityRefGroupTableConfig.isLoading = false;
      });
  }

  /**
   * 查询设备的分组详情列表
   */
  private queryEquipmentList(): void {
    this.equipmentRefGroupTableConfig.isLoading = true;
    this.$facilityForCommon.queryGroupEquipmentInfoList(this.queryEquipmentCondition).subscribe(
      (result: ResultModel<EquipmentListModel[]>) => {
        this.equipmentRefGroupTableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.equipmentRefGroupPageBean.Total = result.totalCount;
          this.equipmentRefGroupPageBean.pageIndex = result.pageNum;
          this.equipmentRefGroupPageBean.pageSize = result.size;
          this.equipmentRefGroupData = result.data;
          if (!_.isEmpty(this.equipmentRefGroupData)) {
            this.equipmentRefGroupData.forEach(item => {
              // 设置设备类型的图标
              item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
              // 设施类型
              item.deviceIcon = CommonUtil.getFacilityIConClass(item.deviceType);
              // 获取状态图标
              const statusStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
              item.statusIconClass = statusStyle.iconClass;
              item.statusColorClass = statusStyle.colorClass;
            });
          }
        }
      }, () => {
        this.equipmentRefGroupTableConfig.isLoading = false;
      });
  }
  /**
   * 获取设备列表的设备类型过滤下拉选
   */
  private getEquipmentTypeRoleSelect(): SelectModel[] {
    const equipments = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    if (!_.isEmpty(equipments)) {
      return equipments.filter(item => item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock);
    }
    return [];
  }
  /**
   * 获取可过滤的设施类型
   */
  private getFacilityTypeRoleSelect(): SelectModel[] {
    let devices = FacilityForCommonUtil.getRoleFacility(this.$nzI18n) || [];
    if (!_.isEmpty(devices)) {
      devices = devices.filter(item => ![DeviceTypeEnum.well, DeviceTypeEnum.outdoorCabinet, DeviceTypeEnum.opticalBox].includes(item.code as DeviceTypeEnum)) || [];
    }
    return devices;
  }
}
