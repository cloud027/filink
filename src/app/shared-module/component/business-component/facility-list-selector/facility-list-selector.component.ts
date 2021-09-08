import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../util/common-util';
import {TableComponent} from '../../table/table.component';
import {PageModel} from '../../../model/page.model';
import {TableConfigModel} from '../../../model/table-config.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../model/query-condition.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {ResultModel} from '../../../model/result.model';
import {LanguageEnum} from '../../../enum/language.enum';
import {SelectModel} from '../../../model/select.model';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {LoopLineModel} from '../../../../core-module/model/loop/LoopLine.model';
import {TroubleUtil} from '../../../../core-module/business-util/trouble/trouble-util';
import {OperatorEnum} from '../../../enum/operator.enum';

/**
 * 设施列表选择器组件
 * created by PoHe
 */
@Component({
  selector: 'facility-list-selector-component',
  templateUrl: './facility-list-selector.component.html',
  styleUrls: ['./facility-list-selector.component.scss',
    '../../../../business-module/facility/facility-common.scss']
})
export class FacilityListSelectorComponent implements OnInit, OnDestroy {
  @Input()
  set facilityVisible(params) {
    this._facilityVisible = params;
    this.facilityVisibleChange.emit(this._facilityVisible);
  }

  // 获取modal框显示状态
  get facilityVisible() {
    return this._facilityVisible;
  }

  /** 能耗管理 传递的参数 */
  @Input() energyBizParams;
  // 是否来自故障
  @Input() isTrouble: boolean = false;
  // 弹框title
  @Input() title: string;
  // 设施过滤条件
  @Input() filterConditions: FilterCondition[] = [];
  // 是否多选
  @Input()
  public multiple: boolean = false;
  @Input()
  public selectFacilityId: string;
  @Input()
  public selectFacilityIds: FacilityListModel[] = [];
  // 是否显示下一步地图展示
  @Input() public showNext: boolean;
  // 关联的线路
  @Input() public associatedLine: [];
  // 确定按钮是否可编辑
  @Input() saveBtn: boolean = true;
  // 确定按钮是否显示
  @Input() isSaveBtn: boolean = true;
  // 显示隐藏变化
  @Output() facilityVisibleChange = new EventEmitter<any>();
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<any>();
  // 设施状态
  @ViewChild('deviceStatusTemp') private _deviceStatusTemp: TemplateRef<HTMLDocument>;
  // 设施类型模板
  @ViewChild('deviceTypeTemp') private _deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 表格实例
  @ViewChild('tableComponent') private _tableComponent: TableComponent;
  // 列表单选
  @ViewChild('radioTemp') private _radioTemp: TableComponent;
  // 是否显示
  private _facilityVisible: boolean = false;
  // 列表数据
  public _dataSet: FacilityListModel[] = [];
  // 分页参数
  public _pageBean: PageModel = new PageModel();
  // 表格配置
  public _tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询条件
  public _queryCondition: QueryConditionModel = new QueryConditionModel();
  // 设施国际化
  public _language: FacilityLanguageInterface;
  // 设施枚举
  public _deviceStatusEnum = DeviceStatusEnum;
  // 设施类型枚举
  public _deviceTypeEnum = DeviceTypeEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 公共国际化
  public _commonLanguage: CommonLanguageInterface;
  //  已选设施数据集
  public _selectedFacilityData: FacilityListModel[] = [];
  // 显示表格还是显示地图
  public showTable: boolean = true;
  // 设施状态
  public deviceStatusList;
  // 画线对象
  public lineData: LoopLineModel[] = [];
  // 过滤电子锁相关设施类型
  private deviceRoleTypes: SelectModel[];
  // 登录有权限设施类型
  private resultDeviceType: SelectModel[];

  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $facilityForCommon: FacilityForCommonService) {
  }

  /**
   * 初始化钩子
   */
  public ngOnInit(): void {
    this._language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this._commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.deviceStatusList = CommonUtil.codeTranslate(this._deviceStatusEnum, this.$nzI18n, null);
    // this.deviceStatusList =  this.deviceStatusList.filter(item => item.code !== this._deviceStatusEnum.dismantled)
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
    } else {
      this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    }
    // 初始化表格
    this.initTableConfig();
    //  查询列表数据
    this.refreshData();
  }

  /**
   * 销毁钩子 将模型设置成空
   */
  public ngOnDestroy(): void {
    this._tableComponent = null;
  }

  /**
   * 切换分页事件
   */
  public pageChange(event: PageModel): void {
    this._queryCondition.pageCondition.pageNum = event.pageIndex;
    this._queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 获取选择的数据
   */
  public onCompleteDraw(event): void {
    this.saveBtn = event.saveBtn;
    this.lineData = event.lineData;
    this.lineData = event.lineData;
    this.associatedLine = event.lineData;
  }

  /**
   * 单选设施
   */
  public onFacilityChange(event: string, data: FacilityListModel): void {
    this.selectFacilityId = event || null;
    this._selectedFacilityData = [data] || [];
  }

  /**
   * 确定选择设施
   */
  public handleOk(): void {
    if (!_.isEmpty(this.lineData)) {
      const data = {
        selectFacilityId: this.selectFacilityId ? this._selectedFacilityData : this.selectFacilityIds,
        lineData: this.lineData
      };
      this.selectDataChange.emit(data);
    } else {
      this.selectDataChange.emit(this.selectFacilityId ? this._selectedFacilityData : this.selectFacilityIds);
    }
    this.facilityVisible = false;
  }


  /**
   *  初始化表格参数
   */
  private initTableConfig(): void {
    this._tableConfig = {
      isDraggable: true,
      isLoading: true,
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      showSearchSwitch: true,
      keepSelected: true,
      selectedIdKey: 'deviceId',
      showSizeChanger: true,
      notShowPrint: true,
      noAutoHeight: true,
      scroll: {x: '600px', y: '450px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: this.multiple ? 'select' : 'render',
          renderTemplate: this.multiple ? null : this._radioTemp,
          title: '',
          fixedStyle: {
            fixedLeft: true,
            style: {left: '0px'}
          },
          width: 62
        },
        { //  序号
          type: 'serial-number',
          width: 62,
          title: this._language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 设施名称
          title: this._language.deviceName_a,
          key: 'deviceName',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // 类型
          title: this._language.deviceType_a,
          key: 'deviceType',
          width: 150,
          configurable: false,
          type: 'render',
          renderTemplate: this._deviceTypeTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.deviceRoleTypes,
            label: 'label',
            value: 'code'
          }
        },
        { // 型号
          title: this._language.model,
          key: 'deviceModel',
          width: 100,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // 设备数量
          title: this._language.equipmentQuantity,
          key: 'equipmentQuantity',
          width: 100,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 状态
          title: this._language.deviceStatus_a,
          key: 'deviceStatus',
          width: 120,
          type: 'render',
          renderTemplate: this._deviceStatusTemp,
          configurable: false,
          isShowSort: true,
          searchable: true,
          minWidth: 90,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.deviceStatusList,
            label: 'label',
            value: 'code'
          }
        },
        {  // 详细地址
          title: this._language.address,
          key: 'address',
          width: 150,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this._commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      handleSelect: (data: FacilityListModel[]) => {
        this.selectFacilityIds = data;
        this._selectedFacilityData = data;
      },
      sort: (event: SortCondition) => {
        this._queryCondition.sortCondition.sortField = event.sortField;
        this._queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this._queryCondition.pageCondition.pageNum = 1;
        this._queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
  }

  /**
   * 查询数据
   */
  private refreshData(): void {
    this.handelFacilityFilterCondition();
    this._tableConfig.isLoading = true;
    this.$facilityForCommon.deviceListByPage(this._queryCondition).subscribe((result: ResultModel<FacilityListModel[]>) => {
      this._tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this._pageBean.Total = result.totalCount;
        this._pageBean.pageIndex = result.pageNum;
        this._pageBean.pageSize = result.size;
        this._dataSet = result.data || [];
        this._selectedFacilityData = [];
        this._dataSet.forEach(_row => {
          _row.areaName = _row.areaInfo ? _row.areaInfo.areaName : '';
          _row.iconClass = CommonUtil.getFacilityIConClass(_row.deviceType);
          const deviceStatusClass = CommonUtil.getDeviceStatusIconClass(_row.deviceStatus);
          _row.deviceStatusIconClass = deviceStatusClass.iconClass;
          _row.deviceStatusColorClass = deviceStatusClass.colorClass;
          const ids = this.selectFacilityIds.map((item => item.deviceId));
          _row.checked = ids.includes(_row.deviceId);
          if (_row.checked) {
            this._selectedFacilityData.push(_row);
          }
        });
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this._tableConfig.isLoading = false;
    });
  }

  /**
   * 获取设施的下拉选
   */
  private getFacilitySelect(): SelectModel[] {
    let facilityList = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    if (!_.isEmpty(facilityList)) {
      const facility = this.filterConditions.find(e => e.filterField === 'deviceType');
      if (facility) {
        facilityList = facilityList.filter(v => facility.filterValue.includes(v.code));
      }
    }
    return facilityList;
  }

  /**
   * 处理过滤条件
   */
  private handelFacilityFilterCondition(): void {
    if (!_.isEmpty(this.deviceRoleTypes)) {
      const labelValue = [];
      this.deviceRoleTypes.forEach(item => {
        labelValue.push(item.code);
      });
      this.filterConditions.push(new FilterCondition('deviceType', OperatorEnum.in, labelValue));
    }
    if (!_.isEmpty(this.filterConditions)) {
      this.filterConditions.forEach(item => {
        const index = this._queryCondition.filterConditions.findIndex(v => v.filterField === item.filterField);
        if (index >= 0) {
          const filterValue = _.intersection(this._queryCondition.filterConditions[index].filterValue, item.filterValue);
          this._queryCondition.filterConditions[index].filterValue = filterValue;
        } else {
          this._queryCondition.filterConditions.push(item);
        }
      });
    }
    if (!_.isEmpty(this.energyBizParams)) {
      for (const key in this.energyBizParams) {
        if (Object.prototype.hasOwnProperty.call(this.energyBizParams, key)) {
          const element = this.energyBizParams[key];
          this._queryCondition.bizCondition[key] = element;
        }
      }
    }
  }

  /**
   * 下一步
   */
  public nextStep(): void {
    // 已选设施数据传给地图用来回显
    this._selectedFacilityData = _.cloneDeep(this.selectFacilityIds);
    // if (this._selectedFacilityData.length === 1) {
    //   this.saveBtn = true;
    // }
    // 未选择设施可以不画线确定，选中设施必须划线才允许点确定
    this.saveBtn = _.isEmpty(this._selectedFacilityData);
    this.showTable = false;
  }
}



