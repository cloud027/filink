import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {FacilityListModel} from '../../../../../core-module/model/facility/facility-list.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';

/**
 * 选择设施名称弹窗组件
 */
@Component({
  selector: 'app-select-device-info',
  templateUrl: './select-device-info.component.html',
  styleUrls: ['./select-device-info.component.scss']
})
export class SelectDeviceInfoComponent implements OnInit {

  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }
  get xcVisible() {
    return this._xcVisible;
  }
  // 所选数据
  @Input() selectDataList = [];
  // 设施多选或者单选
  @Input() multiple: boolean = true;
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<any>();
  // 设施图标
  @ViewChild('deviceTemp') public deviceTemp: TemplateRef<any>;
  // 设施状态
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<HTMLDocument>;
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  public isFormDisabled: boolean = false;
  public inspectionLanguage: InspectionLanguageInterface;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 列表数据
  public dataSet = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 设施状态枚举
  public deviceStatusEnum = DeviceStatusEnum;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 设施id
  public deviceId: string;
  // 显示隐藏
  private _xcVisible: boolean = false;
  // 设施状态
  private resultDeviceStatus: SelectModel[];
  // 已选设施的id
  private selectDeviceIds: string[] = [];
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $facilityCommonService: FacilityForCommonService,
  ) { }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    // 过滤已拆除状态
    this.resultDeviceStatus = CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, null) as SelectModel[];
    // this.resultDeviceStatus = this.resultDeviceStatus.filter(item => item.code !== this.deviceStatusEnum.dismantled);
    // 加载表格配置
    this.initTableConfig();
    // 查询列表数据
    this.refreshData();
    if (this.selectDataList) {
      if (!this.multiple && this.selectDataList.length === 1) {
        this.deviceId = this.selectDataList[0].deviceId;
      }
      this.selectDataList.forEach(v => {
        this.selectDeviceIds.push(v.deviceId);
      });
    }
  }

  /**
   * 关闭
   */
  public handleClose(): void {
    this.xcVisible = false;
  }

  /**
   * 确定  回传
   */
  public commitDeviceData(): void {
    this.selectDataChange.emit(this.selectDataList);
    this.xcVisible = false;
  }

  /**
   * 单选
   */
  public onDataChange(event: string, data: any): void {
    this.deviceId = event;
    this.selectDataList = [data];
  }

  /**
   * 分页查询
   * @param event PageModel
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 刷新表格数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    const value = ['D002', 'D003'];
    const obj = this.queryCondition.filterConditions.find(v => v.filterField === 'deviceType');
    if (!obj) {
      this.queryCondition.filterConditions.push({filterField: 'deviceType', filterValue: value, operator: OperatorEnum.in});
    }
    this.$facilityCommonService.deviceListByPageForListPage(this.queryCondition).subscribe((result: ResultModel<FacilityListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        const list = result.data || [];
        list.forEach(item => {
          item.iconClass = CommonUtil.getFacilityIConClass(item.deviceType);
          // 处理设施状态icon图标
          const statusStyle = CommonUtil.getDeviceStatusIconClass(item.deviceStatus);
          item.deviceStatusIconClass = statusStyle.iconClass;
          item.deviceStatusColorClass = statusStyle.colorClass;
          // 回显
          if (this.selectDeviceIds.includes(item.deviceId)) {
            item.checked = true;
          }
        });
        this.dataSet = list;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    const typeList = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // 过滤电子锁相关
    const deviceTypes = [];
    const result = [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel];
    typeList.forEach(item => {
      if (result.includes(item.code as any)) {
        deviceTypes.push(item);
      }
    });
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      outHeight: 108,
      keepSelected: true,
      selectedIdKey: 'deviceId',
      showSizeChanger: true,
      notShowPrint: true,
      showSearchSwitch: true,
      scroll: {x: '1200px', y: '340px'},
      noIndex: true,
      columnConfig: [
        // 选择
        {
          type: this.multiple ? 'select' : 'render',
          title: '',
          renderTemplate: this.multiple ? null : this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 62
        },
        {
          type: 'serial-number', key: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 名称
          title: this.language.deviceName, key: 'deviceName', width: 150,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 型号
          title: this.language.deviceModel,
          key: 'deviceModel',
          width: 120,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 类型
          title: this.language.deviceType, key: 'deviceType', width: 150,
          configurable: false,
          type: 'render',
          renderTemplate: this.deviceTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: deviceTypes,
            label: 'label', value: 'code'
          }
        },
        { // 状态
          title: this.language.deviceStatus, key: 'deviceStatus', width: 120,
          type: 'render',
          renderTemplate: this.deviceStatusTemp,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.resultDeviceStatus,
            label: 'label',
            value: 'code'
          }
        },
        { // 资产编号
          title: this.language.deviceCode, key: 'deviceCode', width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 供应商
          title: this.language.supplierName,
          key: 'supplier', width: 120,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 所属区域
          title: this.language.parentId, key: 'areaName', width: 120,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {  // 详细地址
          title: this.language.address, key: 'address', width: 150,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remarks, key: 'remarks',
          configurable: false,
          searchable: true,
          isShowSort: true,
          width: 150,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      moreButtons: [],
      rightTopButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleSelect: (event) => {
        this.selectDataList = [];
        this.selectDataList = event;
      }
    };
  }
}
