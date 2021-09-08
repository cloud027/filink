import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { NzI18nService, NzModalService, UploadFile } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { EquipmentApiService } from '../../../../facility/share/service/equipment/equipment-api.service';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { TableConfigModel } from '../../../../../shared-module/model/table-config.model';
import { TableComponent } from '../../../../../shared-module/component/table/table.component';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../../shared-module/model/query-condition.model';
import { PageModel } from '../../../../../shared-module/model/page.model';
import { CommonUtil } from '../../../../../shared-module/util/common-util';
import { FormItem } from '../../../../../shared-module/component/form/form-config';
import { FormOperate } from '../../../../../shared-module/component/form/form-operate.service';
import { CommonLanguageInterface } from '../../../../../../assets/i18n/common/common.language.interface';
import { FacilityLanguageInterface } from '../../../../../../assets/i18n/facility/facility.language.interface';
import { EquipmentListModel } from '../../../../../core-module/model/equipment/equipment-list.model';
import { ResultModel } from '../../../../../shared-module/model/result.model';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { EquipmentStatisticsModel } from '../../../../../core-module/model/equipment/equipment-statistics.model';
import { OperatorEnum } from '../../../../../shared-module/enum/operator.enum';
import {
  EquipmentStatusEnum,
  EquipmentTypeEnum,
  CommunicationEquipmentStatusEnum
} from '../../../../../core-module/enum/equipment/equipment.enum';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { IrregularData } from '../../../../../core-module/const/common.const';
import { BusinessStatusEnum } from '../../../../../core-module/enum/equipment/equipment.enum';
import { SliderConfigModel } from '../../../../../core-module/model/facility/slider-config.model';
import { ConfigDetailRequestModel } from '../../../../../core-module/model/equipment/config-detail-request.model';
import { FacilityForCommonUtil } from '../../../../../core-module/business-util/facility/facility-for-common.util';
import { AssetManagementLanguageInterface } from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import { ImportMissionService } from '../../../../../core-module/mission/import.mission.service';
import { FacilityListModel } from '../../../../../core-module/model/facility/facility-list.model';
import { EnergyOpearEquipmentTXEnum } from '../../../share/enum/energy-config.enum';
import { FacilityForCommonService } from '../../../../../core-module/api-service/facility';

@Component({
  selector: 'app-exist-equipment',
  templateUrl: './exist-equipment.component.html',
  styleUrls: ['./exist-equipment.component.scss'],
})
export class ExistEquipmentComponent implements OnInit, OnDestroy {
  // 表格实例
  @ViewChild('tableComponent') private _tableComponent: TableComponent;
  // 多选数据时的回显key数组
  @Input() public selectEquipments: EquipmentListModel[] = [];

  /** 弹窗表格标题 */
  @Input() public tableTitle: string;
  // 区分 已有设备  通信设备
  @Input() equipmentModalType: EnergyOpearEquipmentTXEnum = EnergyOpearEquipmentTXEnum.equipment;
  @Input() filterConditionsData: FilterCondition[] = [];

  /** 已有设备 只显示 集中控制器 */
  filterConditionsYYData: FilterCondition[] = [
    new FilterCondition('equipmentType', OperatorEnum.in, ['E003']),
  ];

  // 弹框显示状态
  @Input()
  set equipmentVisible(params) {
    this._equipmentVisible = params;
    this.equipmentVisibleChange.emit(this._equipmentVisible);
  }
  // 获取modal框显示状态
  get equipmentVisible() {
    return this._equipmentVisible;
  }
  // 设备id
  @Input()
  public selectEquipmentId: string = '';
  // 显示隐藏变化
  @Output() public equipmentVisibleChange = new EventEmitter<any>();
  // 选中的值变化
  @Output() public selectDataChange = new EventEmitter<any>();
  // 已选数据
  public _selectedData: EquipmentListModel[] = [];
  // 显示隐藏
  public _equipmentVisible = false;
  // 设备类型
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 业务状态
  @ViewChild('equipmentBusinessTemp') equipmentBusinessTemp: TemplateRef<HTMLDocument>;
  // 列表实例
  @ViewChild('tableComponent') tableRef: TableComponent;
  // 设施过滤模版
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // 设施列表展示模版
  @ViewChild('deviceNameTemplate') deviceNameTemplate: TemplateRef<HTMLDocument>;
  // 文件导入
  @ViewChild('importEquipmentTemp') importEquipmentTemp: TemplateRef<HTMLDocument>;
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  // 滑块配置
  public sliderConfig: SliderConfigModel[] = [];
  // 列表数据
  public dataSet: EquipmentListModel[] = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 首页语言包
  public commonLanguage: CommonLanguageInterface;
  // 资产管理语言包
  public assetsLanguage: AssetManagementLanguageInterface;
  // 列表配置
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 业务状态枚举
  public businessStatusEnum = BusinessStatusEnum;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  public communicationEquipmentStatusEnum = CommunicationEquipmentStatusEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 设施过滤
  public filterValue: FilterCondition;
  // 设备设置表单
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 设备配置弹框是否显示
  public equipmentDeployShow: boolean = false;
  // 设施过滤选择器
  public facilityVisible: boolean = false;
  // 过滤数据所选的设施
  public deviceInfo: FacilityListModel[] = [];
  // 过滤框显示设施名
  public filterDeviceName: string = '';
  //  设备配置型号
  public equipmentModel: string;
  // 设备配置类型
  public equipmentConfigType: EquipmentTypeEnum;
  // 设备配置id
  public equipmentConfigId: string;
  // 已选择设施数据
  public selectFacility: FacilityListModel[] = [];
  // 设备配置内容 此处为any是因为表单配置内容是不确定的
  public equipmentConfigContent: any;
  // 设备配置提交是否可以操作
  public configOkDisabled: boolean = true;
  // 设备配置详情参数
  public configValueParam: ConfigDetailRequestModel = new ConfigDetailRequestModel();
  // 配置设备id
  public configEquipmentId: string;
  // 文件集合
  public fileList: UploadFile[] = [];
  // 文件数组
  public fileArray: UploadFile[] = [];
  // 文件类型
  public fileType: string;
  // 设备配置弹框是否展开
  public isVisible: boolean = false;
  display = {
    objTable: false,
  };

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    public $nzModalService: NzModalService,
    private $equipmentAipService: EquipmentApiService,
    private $refresh: ImportMissionService,
    private $facilityCommonService: FacilityForCommonService,
  ) {}

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetsLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this._selectedData = this.selectEquipments || [];
    // 初始化表格参数
    this.initTableConfig();
    // 查询设备统计数据
    this.queryEquipmentCount();
    // 查询列表数据
    this.refreshData();
  }

  /**
   * 将实例化模版进行销毁
   */
  public ngOnDestroy(): void {
    this.equipmentTypeTemp = null;
    this.deviceNameTemplate = null;
    this.equipmentStatusFilterTemp = null;
    this.tableRef = null;
    this.deviceFilterTemplate = null;
  }

  /**
   * 获取参数配置项内容
   * 返回结果是any是因为配置项具有不确定性
   */
  public getPramsConfig(equipmentModel: { equipmentModel: string }): void {
    this.$equipmentAipService
      .getEquipmentConfigByModel(equipmentModel)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.equipmentConfigContent = result.data || [];
          // 判断是否有配置项 为空提示无配置项
          if (!_.isEmpty(this.equipmentConfigContent)) {
            this.configOkDisabled = true;
            // 打开设备配置弹框
            this.equipmentDeployShow = true;
            this.configEquipmentId = this.equipmentConfigId;
            this.configValueParam.equipmentId = this.equipmentConfigId;
            this.configValueParam.equipmentType = this.equipmentConfigType;
          } else {
            this.$message.info(this.assetsLanguage.noEquipmentConfigTip);
          }
        } else {
          // 关闭设备配置弹框
          this.equipmentDeployShow = false;
          this.$message.error(result.msg);
        }
      });
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

  /**
   * 查询各种类型设备总量
   */
  private queryEquipmentCount(): void {
    // 调用统计接口
    this.$facilityCommonService
      .equipmentCount()
      .subscribe((result: ResultModel<EquipmentStatisticsModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const roleEquip = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
          const equipCods = roleEquip.map((v) => v.code);
          // 获取所有的设备类型
          const equipmentTypeList: SliderConfigModel[] = [];
          const equipmentTypeData: EquipmentStatisticsModel[] = result.data || [];
          equipCods.forEach((row) => {
            const temp = equipmentTypeData.find((item) => item.equipmentType === row);
            equipmentTypeList.push({
              code: row as string,
              label: CommonUtil.codeTranslate(
                EquipmentTypeEnum,
                this.$nzI18n,
                row as string,
                LanguageEnum.facility,
              ) as string,
              sum: temp ? temp.equipmentNum : 0,
              textClass: CommonUtil.getEquipmentTextColor(row as string),
              iconClass:
                row === EquipmentTypeEnum.camera
                  ? 'fiLink-camera-statistics camera-color'
                  : CommonUtil.getEquipmentIconClassName(row as string),
            });
          });
          // 计算设备总数量
          const sum = _.sumBy(equipmentTypeData, 'equipmentNum') || 0;
          equipmentTypeList.unshift({
            // 设备总数
            label: this.language.equipmentTotal,
            iconClass: CommonUtil.getEquipmentIconClassName(null),
            textClass: CommonUtil.getEquipmentTextColor(null),
            code: null,
            sum: sum,
          });
          this.sliderConfig = equipmentTypeList;
        } else {
          this.$message.error(result.msg);
        }
      });
  }
  /**
   * 单选设备
   */
  public onEquipmentChange(event: string, data: EquipmentListModel): void {
    this.selectEquipmentId = event;
    this._selectedData = [data];
  }
  Confirm() {
    const data = this._selectedData;
    this.selectDataChange.emit({ data, type: this.equipmentModalType });
    this.equipmentVisible = false;
  }
  close() {}
  clearSelectData() {
    this._tableComponent.keepSelectedData.clear();
    this._tableComponent.checkStatus();
    this._selectedData = [];
    this.selectEquipments = [];
    this.selectEquipmentId = null;
    this.refreshData();
  }

  /**
   * 通信设备 处理过滤条件
   */
  private handelFilterCondition(): void {
    if (!_.isEmpty(this.filterConditionsData)) {
      this.filterConditionsData.forEach((item) => {
        const index = this.queryCondition.filterConditions.findIndex(
          (v) => v.filterField === item.filterField,
        );
        if (index < 0) {
          this.queryCondition.filterConditions.push(item);
        } else {
          this.queryCondition.filterConditions[index].filterValue = _.intersection(
            this.queryCondition.filterConditions[index].filterValue,
            item.filterValue,
          );
        }
      });
    }
  }

  /**
   * 已有设备 处理过滤条件
   */
  handelFilterConditionYY() {
    if (!_.isEmpty(this.filterConditionsYYData)) {
      this.filterConditionsYYData.forEach((item) => {
        const index = this.queryCondition.filterConditions.findIndex(
          (v) => v.filterField === item.filterField,
        );
        if (index < 0) {
          this.queryCondition.filterConditions.push(item);
        } else {
          this.queryCondition.filterConditions[index].filterValue = _.intersection(
            this.queryCondition.filterConditions[index].filterValue,
            item.filterValue,
          );
        }
      });
    }
  }
  /**
   *  刷新列表数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    if (this.equipmentModalType === EnergyOpearEquipmentTXEnum.communication) {
      this.handelFilterCondition();
    } else if (this.equipmentModalType === EnergyOpearEquipmentTXEnum.equipment) {
      this.handelFilterConditionYY();
         }

    this.$facilityCommonService.equipmentListByPage(this.queryCondition).subscribe(
      (result: ResultModel<EquipmentListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet = result.data || [];
          // 处理各种状态的显示情况co
          this.dataSet.forEach((item) => {
            const statusArr: string[] = [EquipmentStatusEnum.unSet, EquipmentStatusEnum.dismantled];
            item.deleteButtonShow = statusArr.includes(item.equipmentStatus);
            // 设置状态样式
            const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
            item.statusIconClass = iconStyle.iconClass;
            item.statusColorClass = iconStyle.colorClass;
            // 获取设备类型的图标
            item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
            item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
            item.deviceName = item.deviceInfo ? item.deviceInfo.deviceName : '';
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
  }

  /**
   * 初始化表格参数
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: { x: '1804px', y: '340px' },
      noIndex: true,
      showSearchExport: false,
      showImport: false,
      columnConfig: [
        {
          // 选择
          type: 'render',
          renderTemplate: this.radioTemp,
          fixedStyle: { fixedLeft: true, style: { left: '0px' } },
          width: 62,
        },
        {
          // 序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
        },
        {
          // 名称
          title: this.language.name,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '124px' } },
        },
        {
          // 资产编码
          title: this.language.deviceCode,
          key: 'equipmentCode',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 设备id
          title: this.language.sequenceId,
          key: 'sequenceId',
          width: 150,
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
          width: 160,
          searchable: false,
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
          //  型号
          title: this.language.model,
          key: 'equipmentModel',
          width: 124,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 供应商
          title: this.language.supplierName,
          key: 'supplier',
          width: 125,
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
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // 所属设施
          title: this.language.affiliatedDevice,
          key: 'deviceName',
          searchKey: 'deviceId',
          width: 150,
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
          width: 100,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 安装时间日期
          title: this.language.installationDate,
          width: 200,
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
          isShowSort: true,
          hidden: true,
          searchConfig: { type: 'input' },
        },
        {
          // 业务状态
          title: this.language.businessStatus,
          key: 'businessStatus',
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
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 详细地址
          title: this.language.address,
          key: 'address',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // 所属网关
          title: this.language.gatewayName,
          key: 'gatewayName',
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
          hidden: true,
          width: 200,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 160,
          fixedStyle: { fixedRight: false, style: { right: '0px' } },
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      notShowPrint: true,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      rightTopButtons: [],
      // 勾选事件
      handleSelect: (event: EquipmentListModel[]) => {
        this._selectedData = event;
        this.selectEquipments = event;
      },
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 过滤查询数据
      handleSearch: (event: FilterCondition[]) => {
        console.log(event, 'event');
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
}
