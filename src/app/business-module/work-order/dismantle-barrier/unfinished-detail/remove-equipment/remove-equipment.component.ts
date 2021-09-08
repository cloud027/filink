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

/** 拆除设备 */
@Component({
  selector: 'app-remove-equipment',
  templateUrl: './remove-equipment.component.html',
  styleUrls: ['./remove-equipment.component.scss'],
})
export class RemoveEquipmentComponent implements OnInit {
  // 设备类型
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 业务状态
  @ViewChild('equipmentBusinessTemp') equipmentBusinessTemp: TemplateRef<HTMLDocument>;
  // 设施过滤模版
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // 设施列表展示模版
  @ViewChild('deviceNameTemplate') deviceNameTemplate: TemplateRef<HTMLDocument>;
  /** 过滤条件 */
  @Input() filterEquipmentId;
  @Input() pageType;
  // 表格配置
  public tableConfig: TableConfigModel;
  dataSet: EquipmentListModel[] = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 查询参数模型
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 工单页面类型
  public WorkOrderPageType = WorkOrderPageTypeEnum
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 登录有权限设施类型
  private deviceRoleTypes: SelectModel[];
  // 设施状态
  public resultDeviceStatus: SelectModel[];
  // 业务状态枚举
  public businessStatus = BusinessStatusEnum;
  // 业务状态枚举
  public businessStatusEnum = BusinessStatusEnum;
  // 设施状态枚举
  public deviceStatusEnum = DeviceStatusEnum;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 过滤框显示设施名
  public filterDeviceName: string = '';
  // 设施过滤
  public filterValue: FilterCondition;
  // 设施过滤选择器
  public facilityVisible: boolean = false;
  // 已选择设施数据
  public selectFacility: FacilityListModel[] = [];
  public equipmentStatus
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 模块枚举
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
    // 查询列表数据
    this.refreshData();
  }

  /**
   * 初始化表格配置
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
          // 序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '0' } },
        },
        {
          // 名称
          title: this.language.name,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
        },
        {
          // 资产编码
          title: this.language.deviceCode,
          key: 'equipmentCode',
          width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 设备id
          title: this.language.sequenceId,
          key: 'sequenceId',
          width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 类型
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
          // 状态
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
          //  型号
          title: this.language.model,
          key: 'equipmentModel',
          width: 124,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 供应商
          title: this.language.supplierName,
          key: 'supplier',
          width: 125,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 报废时间
          title: this.language.scrapTime,
          key: 'scrapTime',
          width: 100,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 所属设施
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
          // 挂载位置
          title: this.language.mountPosition,
          key: 'mountPosition',
          configurable: true,
          width: 100,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 安装时间日期
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
          // 权属公司
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
          // 业务状态
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
          // 区域名称
          title: this.language.affiliatedArea,
          key: 'areaName',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 详细地址
          title: this.language.address,
          key: 'address',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 所属网关
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
          // 备注
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
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 过滤查询数据
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
        this.queryCondition.filterConditions = event;
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      },
    };
  }

  /**
   * 刷新表格数据
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
              // 处理各种状态的显示情况co
              this.dataSet.forEach((item) => {
                // 设置状态样式
                const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
                item.facilityRelocation = true;
                item.deviceConfiguration =
                  <string>item.equipmentModelType !== HostTypeEnum.PassiveLock;
                item.statusIconClass = iconStyle.iconClass;
                item.statusColorClass = iconStyle.colorClass;
                // 获取设备类型的图标
                item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
                // 计算安装时间和当前时间是否超过报废年限
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
   * 切换分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 点击输入框弹出设施选择
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
    this.filterValue.filterName = this.filterDeviceName;
  }
}
