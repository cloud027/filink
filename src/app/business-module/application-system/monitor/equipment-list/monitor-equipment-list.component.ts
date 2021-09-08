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
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  // 设备状态模版
  @ViewChild('equipmentStatusTemp') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 设施过滤模版
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // 业务状态
  @ViewChild('equipmentBusinessTemp') equipmentBusinessTemp: TemplateRef<HTMLDocument>;
  // 备注
  @ViewChild('remarkTable') remarkTable: TemplateRef<HTMLDocument>;
  // 弹框标题
  public loopModalTitle: string;
  // 列表数据
  public dataSet: MonitorListModel[] = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设备状态集合
  public equipmentTypeList = [];
  // 业务状态枚举
  public businessStatusEnum = BusinessStatusEnum;
  // 过滤框显示设施名
  public filterDeviceName: string = '';
  // 设施过滤选择器
  public facilityVisible: boolean = false;
  // 设施过滤
  public filterValue: FilterCondition;
  // 已选择设施数据
  public selectFacilityData: FacilityListModel[] = [];

  /** 分组 关注的枚举 */
  ChooseType = ChooseTypeEnum;
  /** 判断是选择的添加关注还是 分组变更 */
  public selectedType: string = ChooseTypeEnum.collect;
  /** 设备or设施 */
  public facilityOrEquipment: string = FacilityListTypeEnum.equipmentList;

  // 是否隐藏地图变小化按钮
  public isShowUpIcon: boolean = true;
  // 是否隐藏列表部分
  public isShowTable: boolean = true; // 鼠标拖拽默认起始位置

  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 操作按钮枚举
  public OperationButtonEnum = OperationButtonEnum;
  /** 已选设施数据 */
  public selectFacility: boolean = true;

  /**是否有设备列表或者分组列表地图权限 */
  public hasEquipmentMapAuth: boolean;
  // 设备状态
  private resultEquipmentStatus: SelectModel[];

  // 设备列表权限code码 ，默认为智慧照明设备列表权限码
  equipmentAuthCode: string = MonitorWorkBenchEnum.equipmentList;

  // 国际化
  public language: ApplicationInterface;
  // 资产语言包
  public assetLanguage: AssetManagementLanguageInterface;
  // 设施语言包
  public equipmentLanguage: FacilityLanguageInterface;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  indexLanguage: IndexLanguageInterface;
  constructor(
    private $router: Router,
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    // 接口服务
    private $applicationService: ApplicationService,
    private $equipmentAipService: FacilityService,
    private $selectFacilityChangeService: SelectFacilityChangeService,
  ) {}

  ngOnInit() {
    this.indexLanguage = this.$nzI18n.getLocaleData('index');
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // 过滤已拆除状态
    this.resultEquipmentStatus =     CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, this.languageEnum.facility,) as SelectModel[];
    this.resultEquipmentStatus = this.resultEquipmentStatus.filter(item => item.code !== this.equipmentStatusEnum.dismantled);
    // 监听地图选中设备变化
    this.$selectFacilityChangeService.eventEmit.subscribe((value) => {
      if (value.equipmentIds && value.equipmentIds.length) {
        // 联动列表筛选条件改变
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
   * 根据权限码判断有哪些列表访问权限
   */
  public getListByAuthCode(): void {
    // 是否有设备列表查询权限
    const hasEquipmentAuthCode = this.checkHasRole(this.equipmentAuthCode);
    if (hasEquipmentAuthCode) {
      // 判断是否有设备列表查询权限
      this.hasEquipmentMapAuth = true;
    }
  }
  /**
   * 地图下列表是否展示
   */
  public onShowTable(event: boolean): void {
    this.isShowTable = event;
  }
  /**
   * 判断是否有权限操作或访问
   */
  public checkHasRole(code: string): boolean {
    return SessionUtil.checkHasRole(code);
  }
  // 初始化表格配置
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
          // 序号
          type: 'serial-number',
          width: 62,
          title: this.language.frequentlyUsed.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '0px' } },
        },
        {
          // 名称
          title: this.language.strategyList.alarmDeviceName,
          key: 'equipmentName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
        },
        // 资产编号
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
          // 类型
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
          // 状态
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
          //  型号
          title: this.equipmentLanguage.model,
          key: 'equipmentModel',
          width: 124,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 所属设施
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
          // 安装时间日期
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
          // 供应商
          title: this.equipmentLanguage.supplierName,
          key: 'supplier',
          width: 125,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 报废时间
          title: this.equipmentLanguage.scrapTime,
          key: 'scrapTime',
          width: 100,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 权属公司
          title: this.equipmentLanguage.company,
          key: 'company',
          searchable: true,
          width: 150,
          configurable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 业务状态
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
          // 区域名称
          title: this.equipmentLanguage.affiliatedArea,
          key: 'areaName',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 挂载位置
          title: this.equipmentLanguage.mountPosition,
          key: 'mountPosition',
          configurable: true,
          width: 100,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 所属网关
          title: this.equipmentLanguage.gatewayName,
          key: 'gatewayName',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        // 所属回路
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
          // 备注
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
      // 更多操作
      moreButtons: [],
      operation: [
        // 详情
        {
          text: this.language.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: '09-7-3',
          handle: (data: MonitorListModel) => {
            this.handEquipmentOperation(data);
          },
        },
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
  }
  // 表格分页
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
              // 设置状态样式
              const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
              item.statusIconClass = iconStyle.iconClass;
              item.statusColorClass = iconStyle.colorClass;
              // 获取设备类型的图标
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
  // 点击输入框弹出设施选择
  public onShowFacility(value: FilterCondition): void {
    this.filterValue = value;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    this.facilityVisible = true;
  }
  // 选择设施数据
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
  /** 设备详情 */
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
