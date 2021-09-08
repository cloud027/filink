import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { NzI18nService, NzModalService, UploadFile } from 'ng-zorro-antd';
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
  DeviceDetailStatusEnum,
  DeviceTypeEnum,
  FacilityListTypeEnum,
  WellCoverTypeEnum,
} from '../../../../../core-module/enum/facility/facility.enum';
import { IrregularData, IS_TRANSLATION_CONST } from '../../../../../core-module/const/common.const';
import { OperatorEnum } from '../../../../../shared-module/enum/operator.enum';
import { DismantleBarrierWorkOrderService } from '../../../share/service/dismantle-barrier';
import { WorkOrderPageTypeEnum } from '../../../share/enum/work-order-page-type.enum';
import {ActivatedRoute} from "@angular/router";



/** 拆除设施 */
@Component({
  selector: 'app-remove-device',
  templateUrl: './remove-device.component.html',
  styleUrls: ['./remove-device.component.scss'],
})
export class RemoveDeviceComponent implements OnInit {
  // 设施类型模板
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 设施状态
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<HTMLDocument>;
  // 业务状态模板
  @ViewChild('businessStatusTemplate') businessStatusTemplate: TemplateRef<HTMLDocument>;
  /** 过滤条件 */
  @Input() filterDeviceId;
  @Input()  pageType
  // 表格配置
  public tableConfig: TableConfigModel;
  dataSet: FacilityListModel[] = [];
  // 查询参数模型
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 工单页面类型
  public WorkOrderPageType = WorkOrderPageTypeEnum
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
  // 设施状态枚举
  public deviceDetailStatusEnum = DeviceDetailStatusEnum;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  public deviceStatusStatusEnum

  // 设施语言包
  public language: FacilityLanguageInterface;
  // 模块枚举
  public languageEnum = LanguageEnum;
  constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    private $activatedRoute: ActivatedRoute,
    public $dismantleBarrierWorkOrderService: DismantleBarrierWorkOrderService,
  ) {}

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
        if(this.pageType == 'finished'){
         this.deviceStatusStatusEnum =  CommonUtil.codeTranslate(DeviceDetailStatusEnum, this.$nzI18n, null,) as SelectModel[]
        }else {
          this.deviceStatusStatusEnum =  CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, null,) as SelectModel[]
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
      isDraggable: true,
      isLoading: true,
      outHeight: 108,
      showSizeChanger: true,
      showSearchSwitch: true,
      scroll: { x: '1804px', y: '340px' },
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: 'serial-number',
          key: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '0' } },
        },
        {
          // 名称
          title: this.language.deviceName,
          key: 'deviceName',
          width: 150,
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 资产编号
          title: this.language.deviceCode,
          key: 'deviceCode',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 类型
          title: this.language.deviceType,
          key: 'deviceType',
          width: 150,
          configurable: true,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          minWidth: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
            label: 'label',
            value: 'code',
          },
        },
        {
          // 状态
          title: this.language.deviceStatus,
          key: 'deviceStatus',
          width: 120,
          type: 'render',
          renderTemplate: this.deviceStatusTemp,
          configurable: true,
          isShowSort: true,
          searchable: true,
          minWidth: 90,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.deviceStatusStatusEnum,
            label: 'label',
            value: 'code',
          },
        },
        {
          // 型号
          title: this.language.deviceModel,
          key: 'deviceModel',
          width: 120,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 供应商
          title: this.language.supplierName,
          key: 'supplier',
          width: 120,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 报废年限
          title: this.language.scrapTime,
          key: 'scrapTime',
          width: 170,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 设备数量
          title: this.language.equipmentQuantity,
          key: 'equipmentQuantity',
          width: 170,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 业务状态
          title: this.language.businessStatus,
          key: 'businessStatus',
          width: 120,
          type: 'render',
          renderTemplate: this.businessStatusTemplate,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            notAllowClear: false,
            selectInfo: CommonUtil.codeTranslate(
              BusinessStatusEnum,
              this.$nzI18n,
              null,
              this.languageEnum.facility,
            ),
            label: 'label',
            value: 'code',
          },
        },
        {
          // 安装日期
          title: this.language.installationDate,
          key: 'installationDate',
          width: 230,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd',
          hidden: true,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'dateRang' },
        },
        {
          // 所属区域
          title: this.language.parentId,
          key: 'areaName',
          width: 100,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 详细地址
          title: this.language.address,
          key: 'address',
          width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          hidden: false,
          searchConfig: { type: 'input' },
        },
        {
          // 备注
          title: this.language.remarks,
          key: 'remarks',
          configurable: true,
          searchable: true,
          isShowSort: true,
          hidden: true,
          width: 150,
          searchConfig: { type: 'input' },
        },
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 200,
          fixedStyle: { fixedRight: true, style: { right: '0px' } },
        },
      ],
      showPagination: false,
      notShowPrint: true,
      bordered: false,
      showSearch: false,
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
  }

  /**
   * 刷新表格数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    if (this.filterDeviceId) {
      this.queryCondition.filterConditions.push({
        filterField: 'deviceId',
        filterValue: [this.filterDeviceId],
        operator: OperatorEnum.in,
      });
    }
      this.$dismantleBarrierWorkOrderService
        .deviceListByPageForListPageNewWO(this.queryCondition)
        .subscribe(
          (result: ResultModel<FacilityListModel[]>) => {
            this.tableConfig.isLoading = false;
            if (result.code === ResultCodeEnum.success) {
              this.dataSet = result.data || [];
              this.dataSet.forEach((item) => {
                item.iconClass = CommonUtil.getFacilityIConClass(item.deviceType);
                // 处理设施状态icon图标
                const statusStyle = CommonUtil.getDeviceAllStatusIconClass(item.deviceStatus);
                item.deviceStatusIconClass = statusStyle.iconClass;
                item.deviceStatusColorClass = statusStyle.colorClass;
                // 光交箱 配线架 接头盒显示配置业务信息按钮
                if (
                  [
                    DeviceTypeEnum.opticalBox,
                    DeviceTypeEnum.distributionFrame,
                    DeviceTypeEnum.junctionBox,
                  ].includes(item.deviceType)
                ) {
                  item.infoButtonShow = true;
                }
                // 光交箱 人井 室外柜显示控制按钮
                if (
                  [
                    DeviceTypeEnum.well,
                    DeviceTypeEnum.opticalBox,
                    DeviceTypeEnum.outdoorCabinet,
                  ].includes(item.deviceType)
                ) {
                  item.controlButtonShow = true;
                }
                if ([DeviceTypeEnum.wisdom].includes(item.deviceType)) {
                  item.wisdomButtonShow = true;
                }
                item.facilityRelocation = true;
                // 通过安装时间和报废年限判断设备是否报废
                if (item.installationDate && item.scrapTime) {
                  // 安装时间加报废年限是否大于当前时间
                  const scrapped =
                    Date.now() >
                    addYears(new Date(item.installationDate), Number(item.scrapTime)).getTime();
                  item.rowStyle = scrapped ? IrregularData : {};
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

  }
}
