import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {SelectDeviceModel} from '../../../../../core-module/model/facility/select-device.model';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility/facility-for-common.service';
import {FacilityListModel} from '../../../../../core-module/model/facility/facility-list.model';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../../../util/common-util';
import {PageModel} from '../../../../model/page.model';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../model/alarm-selector-config.model';
import {TableConfigModel} from '../../../../model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../model/query-condition.model';
import {ResultModel} from '../../../../model/result.model';
import {SelectModel} from '../../../../model/select.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {OperatorEnum} from '../../../../enum/operator.enum';
import {AlarmSelectorConfigTypeEnum} from '../../../../enum/alarm-selector-config-type.enum';
import {LanguageEnum} from '../../../../enum/language.enum';
import {TroubleUtil} from '../../../../../core-module/business-util/trouble/trouble-util';
import {TableComponent} from '../../../table/table.component';

/**
 * 告警对象选择器组件
 */
@Component({
  selector: 'app-alarm-object',
  templateUrl: './alarm-object.component.html',
  styleUrls: ['../alarm-name/alarm-name.component.scss']
})

export class AlarmObjectComponent implements OnInit {
  /** 父组件传入的告警对象的配置项*/
  @Input() set alarmObjectConfig(alarmObjectConfig: AlarmSelectorConfigModel) {
    if (alarmObjectConfig) {
      // this.initTableConfig();
      this.alarmObjectConfigBackups = alarmObjectConfig;
      this.handleInputConfigData();
    }
  }
  /** 判断是否为单选*/
  @Input() isRadio: boolean = false;
  /** 判断是否为故障使用，故障使用时，有些字段需要做单独的处理*/
  @Input() isTrouble: boolean = false;
  /** 当为表单使用时，判断搜索按钮是否可点击*/
  @Input() isClick: boolean = false;
  /** 默认过滤条件*/
  @Input() filterValue: FilterCondition;
  /** 当为列表筛选时，输入框中的提示文字， 默认文字为'请点击选择'*/
  @Input() placeholder: string;
  /** 告警对象选择器弹框标题，默认标题文字为 '告警对象'*/
  @Input() title: string;
  /**传入设施类型*/
  @Input() deviceType: string = null;
  /**是否需要清除按钮*/
  @Input() isNeedClearBtn: boolean = true;
  /** 设施类型模板*/
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  /** 设施状态模板*/
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<any>;
  /** 单选列模板*/
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  /**列表模板*/
  @ViewChild('deviceTableComponent') deviceTableComponent: TableComponent;
  /** 告警国际化*/
  public language: AlarmLanguageInterface;
  /** 公共部分国际化*/
  public commonLanguage: CommonLanguageInterface;
  /** 勾选的告警对象*/
  public checkAlarmObject: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  /** 勾选的告警对象备份*/
  public checkAlarmObjectBackups: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  /** 控制是否展示告警对象列表弹框*/
  public isShowAlarmObjectModal: boolean = false;
  /** 告警对象表格分页参数*/
  public pageBeanObject: PageModel = new PageModel();
  /** 告警对象列表数据源*/
  public alarmObjectListData: FacilityListModel[] = [];
  /** 该组件被使用的类型 表单/表格*/
  public useType: AlarmSelectorConfigTypeEnum = AlarmSelectorConfigTypeEnum.table;
  /** 被使用的类型枚举*/
  public alarmSelectorConfigTypeEnum = AlarmSelectorConfigTypeEnum;
  /** 告警对象表格配置项信息*/
  public tableConfigObject: TableConfigModel;
  /** 设施类型枚举*/
  public deviceTypeEnum = DeviceTypeEnum;
  /** 设施状态枚举*/
  public deviceStatusEnum = DeviceStatusEnum;
  /** 过滤电子锁相关设施类型*/
  private deviceRoleTypes: SelectModel[];
  /** 登录有权限设施类型 */
  private resultDeviceType: SelectModel[];
  /** 有权限的设施类型的过滤条件*/
  private defaultFilterCondition: FilterCondition;
  /** 父组件传入的告警对象的配置项的备份*/
  private alarmObjectConfigBackups: AlarmSelectorConfigModel;
  /** 查询条件*/
  private queryConditionObj: QueryConditionModel = new QueryConditionModel();

  constructor(
    public $nzI18n: NzI18nService,
    public $facilityService: FacilityService,
    public $facilityForCommonService: FacilityForCommonService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  ngOnInit() {
    // 获取有权限的设施类型
    if (this.isTrouble) {
      // 登录有权限设施类型
      this.resultDeviceType = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
      // 所有电子锁相关的设施类型
      const filterDeviceType = TroubleUtil.filterDeviceType();
      // 设施权限过滤电子锁的相关类型
      this.deviceRoleTypes = this.resultDeviceType.filter( item => {
        return filterDeviceType.includes(item.code as string);
      });
    } else {
      this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    }
    // 根据有权限的设置类型设置默认的过滤条件
    this.getDefaultFilterCondition();
    // this.initTableConfig();
  }

  /**
   * 点击按钮，展示告警名称选择器
   */
  public showAlarmNameSelector(): void {
    this.isShowAlarmObjectModal = true;
    this.initTableConfig();
    this.refreshObjectData();

  }

  /**
   * 选择器里面清空已选数据
   * 只清空选择器数据
   */
  public clearSelectData(): void {
    this.checkAlarmObjectBackups = new AlarmSelectorInitialValueModel();
    this.refreshObjectData();
  }

  /**
   * 选择设施(单选时)
   * param event
   * param data
   */
  public selectedChange(data: FacilityListModel): void {
    this.checkAlarmObjectBackups = new AlarmSelectorInitialValueModel();
    this.checkData(data);
  }

  /**
   * 告警名称列表 弹框分页
   * param event
   */
  public pageObjectChange(event: PageModel): void {
    this.queryConditionObj.pageCondition.pageNum = event.pageIndex;
    this.queryConditionObj.pageCondition.pageSize = event.pageSize;
    this.refreshObjectData();
  }

  /**
   * 关闭弹框事件
   */
  public closeAlarmObjSelector(): void {
    this.checkAlarmObjectBackups = _.cloneDeep(this.checkAlarmObject);
    this.isShowAlarmObjectModal = false;
    this.pageBeanObject = new PageModel();
    this.resetParam();
  }

  /**
   * 点击弹框中的确定按钮事件
   */
  public handleConfirm(): void {
    this.checkAlarmObject = _.cloneDeep(this.checkAlarmObjectBackups);
    if (this.useType === AlarmSelectorConfigTypeEnum.table) {
      if (this.filterValue) {
        this.filterValue.filterValue = this.checkAlarmObject.ids.length === 0 ? null : this.checkAlarmObject.ids;
        this.filterValue.filterName = this.checkAlarmObject.ids.length === 0 ? null : this.checkAlarmObject.name;
      }
    }
    this.isShowAlarmObjectModal = false;
    this.pageBeanObject = new PageModel();
    if (this.isTrouble) {
      // 当故障使用时，还需其他字段的数据，所以单独处理
      let tempObj: any = null;
      if (this.checkAlarmObject.ids && this.checkAlarmObject.ids.length) {
        tempObj = this.alarmObjectListData.filter(item => item.deviceId === this.checkAlarmObject.ids[0]).map(item => {
          return {
            deviceName: item.deviceName,
            deviceId: item.deviceId,
            deviceType: item.deviceType,
            areaId: item.areaInfo.areaId,
            area: item.areaInfo.areaName,
            areaCode: item.areaInfo.areaCode,
            productId: item.productId,
            projectId: item.projectId
          };
        })[0];
      }
      this.alarmObjectConfigBackups.handledCheckedFun(tempObj);
    } else {
      this.alarmObjectConfigBackups.handledCheckedFun(this.checkAlarmObject);
    }
    this.resetParam();
  }

  /**
   * 对传入的配置项做相应的处理
   */
  private handleInputConfigData(): void {
    // 获取使用类型
    if (this.alarmObjectConfigBackups.type) {
      this.useType = this.alarmObjectConfigBackups.type;
    }
    // 对初始值(需要回显的数据)做备份
    if (this.alarmObjectConfigBackups.initialValue && this.alarmObjectConfigBackups.initialValue.ids
      && this.alarmObjectConfigBackups.initialValue.ids.length) {
      this.checkAlarmObject = _.cloneDeep(this.alarmObjectConfigBackups.initialValue);
      this.checkAlarmObjectBackups = _.cloneDeep(this.alarmObjectConfigBackups.initialValue);
    }
    // 外面清空清空所有数据
    if (this.alarmObjectConfigBackups.clear) {
      this.queryConditionObj.pageCondition.pageNum = 1;
      this.checkAlarmObject = new AlarmSelectorInitialValueModel();
      this.checkAlarmObjectBackups = new AlarmSelectorInitialValueModel();
    }
  }

  /**
   * 查询告警对象选择器列表数据
   */
  private refreshObjectData(): void {
    this.tableConfigObject.isLoading = true;
    // 判断过滤条件中是否存在对deviceType的过滤，若不存在则添加
    if (!this.queryConditionObj.filterConditions.some(item => item.filterField === 'deviceType')) {
      this.queryConditionObj.filterConditions.push(this.defaultFilterCondition);
    }
    if (this.deviceType) {
      const hasType = this.queryConditionObj.filterConditions.find(v => v.filterField === 'deviceType');
      if (!hasType) {
        this.queryConditionObj.filterConditions.push(new FilterCondition('deviceType', OperatorEnum.in, [this.deviceType]));
      } else {
        this.queryConditionObj.filterConditions.forEach(v => {
          if (v.filterField === 'deviceType') {
            v.filterValue = [this.deviceType];
          }
        });
      }
    }
    // 判断组件使用位置来源是否为故障
    let request = this.$facilityForCommonService.deviceListByPage(this.queryConditionObj);
    if (this.isTrouble) {
      request = this.$facilityForCommonService.queryDeviceListForComp(this.queryConditionObj);
    }
    // 调用查询接口，获取告警对象列表数据
    request.subscribe((res: ResultModel<FacilityListModel[]>) => {
      this.tableConfigObject.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.pageBeanObject.Total = res.totalCount;
        this.pageBeanObject.pageIndex = res.pageNum;
        this.pageBeanObject.pageSize = res.size;
        this.alarmObjectListData = res.data || [];
        this.alarmObjectListData.forEach(item => {
          item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
          // 处理设施状态图标和样式
          item.deviceStatusIconClass = CommonUtil.getDeviceStatusIconClass(item.deviceStatus).iconClass;
          item.deviceStatusColorClass = CommonUtil.getDeviceStatusIconClass(item.deviceStatus).colorClass;
          item.iconClass = CommonUtil.getFacilityIconClassName(item.deviceType);
          item.checked = this.checkAlarmObjectBackups.ids.includes(item.deviceId);
            // this.checkAlarmObjectBackups.ids.forEach(_item => {
            //   if (item.deviceId === _item) {
            //     item.checked = true;
            //   }
            // });
        });
      }
      this.tableConfigObject.isLoading = false;
    }, () => {
      this.tableConfigObject.isLoading = false;
    });
  }

  /**
   * 初始化告警对象表格配置项
   */
  private initTableConfig(): void {
    this.tableConfigObject = {
      isDraggable: true,
      isLoading: false,
      primaryKey: null,
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      noAutoHeight: true,
      closeCacheQueryConditions: true,
      scroll: {x: '1200px', y: '450px'},
      columnConfig: [
        // isRaido为true时，使用单选框，否则为复选框
        /**
        this.isRadio ? {type: 'render', key: 'selectedAlarmNameId', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42, renderTemplate: this.radioTemp} :
          {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42},
         */
        {
          type: this.isRadio ? 'render' : 'select',
          key: 'selectedAlarmNameId',
          width: 42, title: '',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          renderTemplate: this.isRadio ? this.radioTemp : null
        },
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
        },
        {
          // 类型
          title: this.language.type, key: 'deviceType',
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          width: 120,
          searchable: !!this.deviceType,
          isShowSort: !!this.deviceType,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo:  this.deviceRoleTypes, label: 'label', value: 'code'}
        },
        {
          // 名称
          title: this.language.name, key: 'deviceName', width: 170,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          // 状态
          title: this.language.status, key: 'deviceStatus',
          width: 200,
          type: 'render',
          renderTemplate: this.deviceStatusTemp,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: FacilityForCommonUtil.translateDeviceStatus(this.$nzI18n),
            label: 'label', value: 'code'
          }
        },
        {
          // 资产编号
          title: this.language.assetCode, key: 'deviceCode', width: 200,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          // 详细地址
          title: this.language.address, key: 'address', width: 170,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          // 备注
          title: this.language.remark,
          key: 'remarks', width: 200,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryConditionObj.sortCondition.sortField = event.sortField;
        this.queryConditionObj.sortCondition.sortRule = event.sortRule;
        this.refreshObjectData();
      },
      handleSelect: (data: FacilityListModel[], currentItem: FacilityListModel) => {
        if (!currentItem) {
          // 当前页面全选 获取全部取消时
          if (data && data.length) {
            data.forEach(checkData => {
              if (this.checkAlarmObjectBackups.ids.indexOf(checkData.deviceId) === -1) {
                // 不存在时 添加进去
                this.checkData(checkData);
              }
            });
          } else {
            // 取消当前页面的全部勾选
            this.alarmObjectListData.forEach(item => {
              if (this.checkAlarmObjectBackups.ids.indexOf(item.deviceId) !== -1) {
                // 当该条数据存在于 勾选信息中时 将其移除
                this.cancelCheck(item);
              }
            });
          }
        } else {
          if (currentItem.checked) {
            this.checkData(currentItem);
          } else {
            this.cancelCheck(currentItem);
          }
        }
      },
      handleSearch: (event: FilterCondition[]) => {
        if (event.length) {
          const obj = {};
          event.forEach((item, index) => {
            obj[item.filterField] = item.filterValue;
            if (item.filterField === 'deviceNames') {
              item.filterField = 'deviceType';
            }
            // 对于类型里面的 可能为空数组的情况作出特殊处理
            if (item.filterField === 'deviceStatus' && !item.filterValue.length) {
              event.splice(index, 1);
            }
          });
        }
        this.queryConditionObj.pageCondition.pageNum = 1;
        this.queryConditionObj.filterConditions = event;
        this.refreshObjectData();
      }
    };
  }

  /**
   * 勾选表格中的数据时，对该条勾选的数据的名称做拼接，并记录该条数据的id
   * param currentItem
   */
  private checkData(currentItem: FacilityListModel): void {
    // 勾选
    this.checkAlarmObjectBackups.ids.push(currentItem.deviceId);
    const names = this.checkAlarmObjectBackups.name + ',' + currentItem.deviceName;
    this.checkAlarmObjectBackups.name = this.checkAlarmObjectBackups.name === '' ? currentItem.deviceName : names;
  }

  /**
   * 取消勾选事件
   * param currentItem
   */
  private cancelCheck(currentItem: FacilityListModel): void {
    // 取消勾选
    this.checkAlarmObjectBackups.ids = this.checkAlarmObjectBackups.ids.filter(id => {
      return currentItem.deviceId !== id && id;
    });
    const names = this.checkAlarmObjectBackups.name.split(',');
    this.checkAlarmObjectBackups.name = names.filter(name => currentItem.deviceName !== name && name).join(',');
  }

  /**
   * 设置默认过滤条件
   */
  private getDefaultFilterCondition(): void {
    if (!_.isEmpty(this.deviceRoleTypes)) {
      const labelValue = [];
      this.deviceRoleTypes.forEach(item => {
        labelValue.push(item.code);
      });
      this.defaultFilterCondition = new FilterCondition('deviceType', OperatorEnum.in, labelValue);
    }
  }

  /**
   * 重置查询条件
   */
  private resetParam(): void {
    this.deviceTableComponent.handleRest();
    this.alarmObjectListData = [];
    this.deviceTableComponent.queryTerm = null;
    this.deviceTableComponent.tableQueryTermStoreService.clearQueryTerm();
  }
}
