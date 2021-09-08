import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {TableConfigModel} from '../../../model/table-config.model';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {PageModel} from '../../../model/page.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../model/query-condition.model';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {TableComponent} from '../../table/table.component';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {CommonUtil} from '../../../util/common-util';
import {LanguageEnum} from '../../../enum/language.enum';
import {OperatorEnum} from '../../../enum/operator.enum';
import {SelectModel} from '../../../model/select.model';
import {AlarmSelectorConfigModel} from '../../../model/alarm-selector-config.model';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {TroubleUtil} from '../../../../core-module/business-util/trouble/trouble-util';


/**
 * 设施选择
 * created by PoHe
 */
@Component({
  selector: 'equipment-list-selector-component',
  templateUrl: './equipment-list-selector.component.html',
  styleUrls: ['./equipment-list-selector.component.scss']
})
export class EquipmentListSelectorComponent implements OnInit, OnDestroy {
  // 弹框显示状态
  @Input()
  set equipmentVisible(params) {
    this._equipmentVisible = params;
    this.equipmentVisibleChange.emit(this._equipmentVisible);
  }

  /** 能耗管理 传递的参数 */
  @Input() energyBizParams;
  // 是否需要过滤智能门禁锁设备类型
  @Input() public isFilterEquipmentType: boolean = false;
  // 是否隐藏表格操作列
  @Input() public isHideOperateItem: boolean = false;
  // 是否来自故障
  @Input() public isTrouble: boolean = false;
  // 是否请求针对网关配置已有设备的列表信息
  @Input() public isGatewayConfig: boolean = false;
  // 是否多选
  @Input() public multiple: boolean = false;
  // 是否显示选择的条数
  @Input() public showSelectedCount: boolean = false;
  // 设备过滤条件
  @Input() public filterConditions: FilterCondition[] = [];
  // 多选数据时的回显key数组
  @Input() public selectEquipments: EquipmentListModel[] = [];
  // 设备id
  @Input()
  public selectEquipmentId: string = '';
  // 弹窗表格标题
  @Input() public tableTitle: string;
  // 设备多选列表禁止选择
  @Input() public forbidSelect: boolean = false;
  // 是否显示清空按钮
  @Input() public showCleanBtn: boolean = false;
  // 是否需要校验确定按钮
  @Input() public isCheckOkBtn: boolean = true;
  // 过滤设备状态(安装工单下使用)
  @Input() public equipmentStatus: boolean = true;
  // 显示隐藏变化
  @Output() public equipmentVisibleChange = new EventEmitter<any>();
  // 选中的值变化
  @Output() public selectDataChange = new EventEmitter<EquipmentListModel[]>();
  // 设备类型
  @ViewChild('equipmentTypeTemp') private equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemp') private equipmentStatusTemp: TemplateRef<HTMLDocument>;
  // 区域选择
  @ViewChild('areaSelectorTemp') private areaSelectorTemp: TemplateRef<HTMLDocument>;
  // 表格实例
  @ViewChild('tableComponent') private tableComponent: TableComponent;
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  // 多选列表禁止选择模板
  @ViewChild('forbidSelectTemp') forbidSelectTemp: TemplateRef<HTMLDocument>;
  // 设施类型模版
  @ViewChild('refDeviceTemp') refDeviceTemp: TemplateRef<HTMLDocument>;
  // 设施选择器
  @ViewChild('deviceTemplate') deviceTemplate: TemplateRef<HTMLDocument>;
  // 显示隐藏
  public _equipmentVisible = false;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设备状态枚举
  public equipmentStatusObj;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 区域配置
  public areaConfig: AlarmSelectorConfigModel;
  // 区域
  areaList = {
    ids: [],
    name: ''
  };

  // 获取modal框显示状态
  get equipmentVisible() {
    return this._equipmentVisible;
  }

  // 设备列表结果集
  public dataSet: EquipmentListModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 设施国际化
  public language: FacilityLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 已选数据
  public selectedData: EquipmentListModel[] = [];
  // 设施选择器是否展示
  public showFacilitySelector: boolean = false;
  // 设施过滤数据
  public filterValue: FilterCondition;
  // 所选设施的名称
  public filterDeviceName: string;
  // 已选择设施数据
  public selectedFacility: FacilityListModel[] = [];
  // 过滤电子锁相关设施类型
  private deviceRoleTypes: SelectModel[];
  // 登录有权限设施类型
  private resultDeviceType: SelectModel[];
  // 设备类型数据
  private equipmentRoleTypes: SelectModel[];
  // 点击按钮是否可以点击
  private handleOkDisabled: boolean = false;

  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $facilityCommonService: FacilityForCommonService) {
    const obj = {};
    Object.keys(this.equipmentStatusEnum).forEach(item => {
      if (this.equipmentStatusEnum[item] !== this.equipmentStatusEnum.dismantled) {
        obj[item] = this.equipmentStatusEnum[item];
      }
    });
    this.equipmentStatusObj = obj;
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(this.languageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(this.languageEnum.common);
    this.selectedData = this.selectEquipments || [];
    if (this.isCheckOkBtn) {
      if (this.selectEquipments && this.selectEquipments.length > 0) {
        this.handleOkDisabled = false;
      }
    }
    this.tableTitle = this.tableTitle || this.language.equipmentList;
    // 获取有权限的设施类型
    if (this.isTrouble) {
      // 登录有权限设施类型
      this.resultDeviceType = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
      // 所有电子锁相关的设施类型
      const filterDeviceType = TroubleUtil.filterDeviceType();
      // 设施权限过滤电子锁的相关类型
      this.deviceRoleTypes = this.resultDeviceType.filter(item => {
        return filterDeviceType.includes(item.code as string);
      });
      // 获取设备类型
      this.equipmentRoleTypes = this.getEquipmentSelect().filter(item => item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock);
    } else {
      this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
      // 获取设备类型过滤电子锁的
      this.equipmentRoleTypes = this.getEquipmentSelect();
      if (this.isFilterEquipmentType) {
        this.equipmentRoleTypes = this.equipmentRoleTypes.filter(item => item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock);
      }
    }
    // 区域
    this.initAreaConfig();
    // 初始化表格
    this.initTableConfig();
    // 刷新列表数据
    this.refreshData();
    // 单选
    if (!this.multiple && this.selectEquipments && this.selectEquipments.length === 1) {
      this.selectEquipmentId = this.selectEquipments[0].equipmentId;
    }
  }


  /**
   * 清空操作
   */
  public onClickCleanUp(): void {
    this.tableComponent.keepSelectedData.clear();
    this.tableComponent.checkStatus();
    this.selectedData = [];
    this.selectEquipments = [];
    this.selectEquipmentId = null;
    this.refreshData();
    this.handleOkDisabled = false;
  }

  /**
   * 销毁组件
   */
  public ngOnDestroy(): void {
    this.equipmentTypeTemp = null;
    this.equipmentStatusTemp = null;
    this.tableComponent = null;
  }

  /**
   * 单选设备
   */
  public onEquipmentChange(event: string, data: EquipmentListModel): void {
    this.selectEquipmentId = event;
    this.selectedData = [data];
    if (this.isCheckOkBtn) {
      this.handleOkDisabled = !this.selectedData.length;
    }
  }

  /**
   *  打开设施选择器
   */
  public onShowDevice(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    this.showFacilitySelector = true;
  }

  /**
   * 切换分页触发事件
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 选择设施之后触发事件
   */
  public onDeviceChange(data: FacilityListModel[]): void {
    this.selectedFacility = data;
    this.filterValue.filterValue = data.map(item => {
      return item.deviceId;
    }) || [];
    // 拼接设施的名称
    if (!_.isEmpty(data)) {
      this.filterDeviceName = data.map(item => {
        return item.deviceName;
      }).join(',');
    } else {
      this.filterDeviceName = '';
    }
  }

  /**
   * 确定选择设备
   */
  public handleOk(): void {
    const data = this.selectedData;
    this.selectDataChange.emit(data);
    this.equipmentVisible = false;
  }

  /**
   * 区域配置
   */
  initAreaConfig() {
    this.areaConfig = {
      clear: !this.areaList.ids.length,
      handledCheckedFun: (event) => {
        this.areaList = event;
      }
    };
  }

  /**
   *  初始化表格
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      noAutoHeight: true,
      scroll: {x: '600px', y: '450px'},
      noIndex: true,
      showSearchExport: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      keepSelected: true,
      selectedIdKey: 'equipmentId',
      topButtons: [],
      operation: [],
      columnConfig: [
        { // 单选
          title: this.language.select,
          type: (this.multiple && !this.forbidSelect) ? 'select' : 'render',
          // 设备单选时radioTemp模板，多选时允许选择 null，多选列表不允许选择forbidSelectTemp模板
          renderTemplate: this.multiple ? (this.forbidSelect ? this.forbidSelectTemp : null) : this.radioTemp,
          fixedStyle: {
            fixedLeft: true,
            style: {left: '0px'}
          },
          width: 62
        },
        { //  序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 名称
          title: this.language.equipmentName,
          key: 'equipmentName',
          width: 130,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 类型
          title: this.language.equipmentType,
          key: 'equipmentType',
          isShowSort: true,
          type: 'render',
          width: 150,
          searchable: true,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.equipmentRoleTypes,
            label: 'label',
            value: 'code'
          }
        },
        { // 状态
          title: this.language.equipmentStatus,
          key: 'equipmentStatus',
          width: 110,
          type: 'render',
          renderTemplate: this.equipmentStatusTemp,
          searchable: this.equipmentStatus,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(this.equipmentStatusObj, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label',
            value: 'code'
          }
        },
        { // 所属设施
          title: this.language.affiliatedDevice,
          key: 'deviceName',
          searchKey: 'deviceId',
          width: 150,
          configurable: false,
          searchable: !(this.filterConditions.find(v => v.filterField === 'deviceId')),
          isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceTemplate
          },
        },
        { // 挂载位置
          title: this.language.mountPosition,
          key: 'mountPosition',
          searchKey: 'mountPosition',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 设施类型
          title: this.language.deviceType_a,
          key: 'deviceType',
          type: 'render',
          renderTemplate: this.refDeviceTemp,
          width: 150,
          configurable: false,
          searchable: this.equipmentStatus,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.deviceRoleTypes,
            label: 'label',
            value: 'code'
          }
        },
        {
          // 区域
          title: this.language.area, key: 'areaName', width: 120, isShowSort: true,
          configurable: false,
          searchKey: 'areaId',
          searchable: !(this.filterConditions.find(v => v.filterField === 'areaId')),
          searchConfig: {
            type: 'render',
            renderTemplate: this.areaSelectorTemp
          },
        },
        {  // 详细地址
          title: this.language.address,
          key: 'address',
          searchable: true,
          width: 150,
          configurable: false,
          searchConfig: {type: 'input'}
        },
        {
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}},
          hidden: this.isHideOperateItem
        }
      ],
      // 勾选事件
      handleSelect: (event: EquipmentListModel[]) => {
        this.selectedData = event;
        this.selectEquipments = event;
        if (this.isCheckOkBtn) {
          this.handleOkDisabled = !this.selectedData.length;
        }
      },
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 过滤查询
      handleSearch: (data: FilterCondition[]) => {
        // 判断过滤条件是否包含设施的过滤
        const index = data.findIndex(row => row.filterField === 'deviceId');
        // 判断过滤条件是否包含设施的过滤
        const areaIndex = data.findIndex(row => row.filterField === 'areaId');
        // 使用设施选择器的设施之后对设施ID过滤进行处理
        if (index >= 0 && !_.isEmpty(data[index].filterValue)) {
          data[index].operator = OperatorEnum.in;
        } else {
          this.filterValue = null;
          this.selectedFacility = [];
          this.filterDeviceName = '';
          data = data.filter(item => item.filterField !== 'deviceId');
        }
        /*// 对区域过滤
        if (areaIndex >= 0 && !_.isEmpty(data[areaIndex].filterValue)) {
          data[areaIndex].filterField = 'areaId';
          data[areaIndex].operator = OperatorEnum.in;
        } else {
          this.areaList = {
            ids: [],
            name: '',
          };
          this.initAreaConfig();
          data = data.filter(item => item.filterField !== 'areaId');
        }*/
        if (_.isEmpty(data)) {
          this.areaList = {
            ids: [],
            name: '',
          };
          this.initAreaConfig();
        }
        if (areaIndex > -1) {
          data[areaIndex].operator = OperatorEnum.in;
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = data;
        this.refreshData();
      }
    };
  }

  /**
   * 查询列表
   */
  private refreshData(): void {
    let requestUrl;
    this.handelFilterCondition();
    // this._queryCondition.filterConditions = this._queryCondition.filterConditions.concat(this.filterConditions);
    if (this.isTrouble) {
      requestUrl = 'queryEquipmentListForComp';
    } else {
      if (!this.isGatewayConfig) {
        requestUrl = 'equipmentListByPage';
      } else {
        requestUrl = 'queryConfigureEquipmentInfo';
      }
    }
    this.tableConfig.isLoading = true;
    const ids = this.selectEquipments.map(v => v.equipmentId);
    /*if (!this.isTrouble) {
    this.queryCondition.filterConditions = this.queryCondition.filterConditions.filter(item => item.filterField !== 'mountPosition');
    }*/
    this.$facilityCommonService[requestUrl](this.queryCondition).subscribe(
      (result: ResultModel<EquipmentListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet = result.data;
          // 处理各种状态的显示情况
          this.dataSet.forEach(row => {
            row.deviceName = row.deviceInfo ? row.deviceInfo.deviceName : '';
            row.areaName = row.areaInfo.areaName || '';
            // 设置设备类型的图标
            row.iconClass = CommonUtil.getEquipmentTypeIcon(row);
            // 设置设备的状态和图标
            const iconStyle = CommonUtil.getEquipmentStatusIconClass(row.equipmentStatus, 'list');
            row.statusIconClass = iconStyle.iconClass;
            row.statusColorClass = iconStyle.colorClass;
            // 处理设施类型图标
            row.deviceIcon = CommonUtil.getFacilityIConClass(row.deviceType);
            row.checked = ids.includes(row.equipmentId);
          });
        } else {
          this.tableConfig.isLoading = false;
          this.$message.error(result.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * 处理过滤条件
   */
  private handelFilterCondition(): void {
    if (!_.isEmpty(this.equipmentRoleTypes)) {
      const labelValue = [];
      this.equipmentRoleTypes.forEach(item => {
        labelValue.push(item.code);
      });
      this.filterConditions.push(new FilterCondition('equipmentType', OperatorEnum.in, labelValue));
    }
    if (!_.isEmpty(this.filterConditions)) {
      this.filterConditions.forEach(item => {
        const index = this.queryCondition.filterConditions.findIndex(v => v.filterField === item.filterField);
        if (index < 0) {
          this.queryCondition.filterConditions.push(item);
        } else {
          // 如果filterValue是数组才进入, _.intersection 是lodash操作数组的方法，此处可能值为字符串导致返回为空数组
          if (this.queryCondition.filterConditions[index].filterValue instanceof  Array) {
            this.queryCondition.filterConditions[index].filterValue = _.intersection(this.queryCondition.filterConditions[index].filterValue, item.filterValue);
          }
        }
      });
    }
    if (!_.isEmpty(this.energyBizParams)) {
      for (const key in this.energyBizParams) {
        if (Object.prototype.hasOwnProperty.call(this.energyBizParams, key)) {
          const element = this.energyBizParams[key];
          this.queryCondition.bizCondition[key] = element;
        }
      }
    }
  }

  /**
   * 获取设备下拉选的数据
   */
  private getEquipmentSelect(): SelectModel[] {
    let selectList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    if (!_.isEmpty(this.filterConditions)) {
      const filterValue = this.filterConditions.find(item => item.filterField === 'equipmentType');
      if (filterValue) {
        selectList = selectList.filter(row => filterValue.filterValue.includes(row.code));
      }
    }
    return selectList;
  }
}
