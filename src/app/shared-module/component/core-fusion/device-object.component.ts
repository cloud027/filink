import {Component, OnInit, Input, ViewChild, TemplateRef} from '@angular/core';
import {PageModel} from '../../model/page.model';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityApiService} from '../../../business-module/facility/share/service/facility/facility-api.service';
import {AlarmSelectorConfigModel} from '../../model/alarm-selector-config.model';
import {AlarmLanguageInterface} from 'src/assets/i18n/alarm/alarm-language.interface';
import {TableComponent} from 'src/app/shared-module/component/table/table.component';
import {TableConfigModel} from '../../model/table-config.model';
import {QueryConditionModel, SortCondition} from '../../model/query-condition.model';
import {CommonUtil} from '../../util/common-util';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../model/result.model';
import {DeployStatusEnum, DeviceStatusEnum, DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';
import {FacilityListModel} from '../../../core-module/model/facility/facility-list.model';

/**
 * 选择设施或接头盒弹框组件
 */
@Component({
  selector: 'app-device-object',
  templateUrl: './device-object.component.html',
  styleUrls: ['./device-object.component.scss']
})
export class DeviceObjectComponent implements OnInit {
  @Input()
  set alarmObjectConfig(alarmObjectConfig: AlarmSelectorConfigModel) {
    if (alarmObjectConfig) {
      this._alarmObjectConfig = alarmObjectConfig;
      this.setData();
    }
  }

  @Input() filterValue; // 过滤value

  @Input() deviceName; // 设施名称

  @Input() deviceId;  // 设施id
  @Input() terminationNode;
  @Input() startNode;
  public language: AlarmLanguageInterface;
  public facilityLanguage: FacilityLanguageInterface; // 国际化
  // 勾选的设施对象
  checkAlarmObject = {
    name: '',
    ids: []
  };
  // 备注
  checkAlarmObjectBackups = {
    name: '',
    ids: []
  };
  display = {
    objTable: false,
  };
  pageBeanObject: PageModel = new PageModel(10, 1, 1); // 分页
  _dataSetObject = []; // 列表存放对象
  _type: 'form' | 'table' = 'table'; // 表单或列表筛选使用
  _alarmObjectConfig: AlarmSelectorConfigModel;
  tableConfigObject: TableConfigModel;
  title; // 弹框标题
  disabled: boolean = false;
  queryConditionObj: QueryConditionModel = new QueryConditionModel();

  @ViewChild('xCTableComp') private xCTableComp: TableComponent; // 表格
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;  // 设施类型
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<any>; // 设施状态

  constructor(
    public $nzI18n: NzI18nService,
    public $facilityApiService: FacilityApiService,
    private $modalService: FiLinkModalService,
  ) {
    this.language = this.$nzI18n.getLocaleData('alarm');
    this.facilityLanguage = this.$nzI18n.getLocaleData('facility');
  }

  ngOnInit() {
    this.refreshObjectData();
    this.initTableConfig();
    if (this.deviceName) {
      this.checkAlarmObject.name = this.deviceName;
      this.disabled = true;
    }
    this.checkAlarmObject.ids[0] = this.deviceId;
    this.title = this.facilityLanguage.chooseAFacilityOrConnectorBox;
  }

  /**
   * 勾选列表数据处理
   */
  setData() {
    if (this._alarmObjectConfig.type) {
      this._type = this._alarmObjectConfig.type;
    }
    if (this._alarmObjectConfig.initialValue && this._alarmObjectConfig.initialValue.ids
      && this._alarmObjectConfig.initialValue.ids.length) {
      this.checkAlarmObject = this.clone(this._alarmObjectConfig.initialValue);
      this.checkAlarmObjectBackups = this.clone(this._alarmObjectConfig.initialValue);
    }
    if (this._alarmObjectConfig.clear) {
      this.checkAlarmObject = {
        name: '',
        ids: []
      };
      this.checkAlarmObjectBackups = {
        name: '',
        ids: []
      };
    }
  }

  /**
   * 获取设施列表数据
   */
  refreshObjectData(body?) {
    const filterData = {
      filterField: 'deviceType',
      filterValue: ['090', '001'],
      operator: 'in'
    };
    if (!body) {
      this.queryConditionObj.filterConditions = [filterData];
    }
    this.$facilityApiService.deviceListByPage(body || this.queryConditionObj).subscribe((res: ResultModel<FacilityListModel[]>) => {
      const nodeData = [];
      res.data.forEach(item => {
        if (item.deviceId === this.terminationNode || item.deviceId === this.startNode) {
          nodeData.push(item);
        }
      });
      this._dataSetObject = nodeData || [];
      this._dataSetObject.forEach(item => {
        item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
        item['_deviceType'] = item.deviceType;
        item.deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.deviceType);
        item['_deviceStatus'] = item.deviceStatus;
        item.deviceStatus = CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, item.deviceStatus);
        item.deployStatus = CommonUtil.codeTranslate(DeployStatusEnum, this.$nzI18n, item.deployStatus);
        item['iconClass'] = CommonUtil.getFacilityIConClass(item._deviceType);
        this.checkAlarmObjectBackups.ids.forEach(_item => {
          if (item.deviceId === _item) {
            item.checked = true;
          }
        });
      });
    });
  }

  /**
   * 设施弹框
   */
  private initTableConfig() {
    this.tableConfigObject = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '1200px', y: '340px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
        },
        {
          title: this.language.type, key: 'deviceType', width: 120,
          configurable: true,
          minWidth: 90,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            // selectType: 'multiple',
            selectInfo: [
              {label: this.language.junctionBox, value: '090'},
              // { label: '分纤箱', value: '150'},
              {label: this.language.opticalBox, value: '001'},
            ]
          },
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
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, null),
            label: 'label', value: 'code'
          }
        },
        {
          title: this.language.assetCode, key: 'deviceCode', width: 200,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.address, key: 'address', width: 170,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.deployStatus, key: 'deployStatus', configurable: true, width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: CommonUtil.codeTranslate(DeployStatusEnum, this.$nzI18n), label: 'label', value: 'code'}
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
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryConditionObj.sortCondition.sortField = event.sortField;
        this.queryConditionObj.sortCondition.sortRule = event.sortRule;
        this.refreshObjectData();
      },
      // 选择
      handleSelect: (data, currentItem) => {
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
            this._dataSetObject.forEach(item => {
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
      // 筛选
      handleSearch: (event) => {
        if (event.length > 0) {
          if (event[0].filterField === 'deviceType') {
            const type = event[0].filterValue;
            event[0].filterValue = [type];
            event[0].operator = 'in';
            this.queryConditionObj.filterConditions = event;
          } else {
            const filterData = {
              filterField: 'deviceType',
              filterValue: ['090', '001'],
              operator: 'in'
            };
            this.queryConditionObj.filterConditions[0] = filterData;
            event.forEach(item => {
              this.queryConditionObj.filterConditions.push(item);
            });
          }
        } else {
          const filterData = {
            filterField: 'deviceType',
            filterValue: ['090', '001'],
            operator: 'in'
          };
          this.queryConditionObj.filterConditions = [filterData];
        }
        this.queryConditionObj.pageCondition.pageNum = 1;
        this.refreshObjectData(this.queryConditionObj);
      }
    };
  }

  /**
   * 勾选数据时
   */
  checkData(currentItem) {
    // 勾选
    this.checkAlarmObjectBackups.ids.push(currentItem.deviceId);
    const names = this.checkAlarmObjectBackups.name + ',' + currentItem.deviceName;
    this.checkAlarmObjectBackups.name = this.checkAlarmObjectBackups.name === '' ? currentItem.deviceName : names;
  }

  /**
   * 取消勾选
   */
  cancelCheck(currentItem) {
    // 取消勾选
    this.checkAlarmObjectBackups.ids = this.checkAlarmObjectBackups.ids.filter(id => {
      return currentItem.deviceId !== id && id;
    });
    const names = this.checkAlarmObjectBackups.name.split(',');
    this.checkAlarmObjectBackups.name = names.filter(name => currentItem.deviceName !== name && name).join(',');
  }

  /**
   * 设施列表弹框分页
   */
  pageObjectChange(event) {
    this.queryConditionObj.pageCondition.pageNum = event.pageIndex;
    this.queryConditionObj.pageCondition.pageSize = event.pageSize;
    this.refreshObjectData(this.queryConditionObj);
  }

  /**
   * 取消关闭弹框
   */
  closeObj() {
    this.checkAlarmObjectBackups = this.clone(this.checkAlarmObject);
    this.display.objTable = false;
    this.pageBeanObject = new PageModel(10, 1, 1);
  }

  /**
   * 确定选择对象
   */
  objConfirm() {
    if (this.checkAlarmObjectBackups.ids.length !== 1) {
      this.$modalService.info(`${this.language.pleaseSelectAFacility}`);
      this.refreshObjectData(this.queryConditionObj);
      this.checkAlarmObjectBackups.name = '';
      this.checkAlarmObjectBackups.ids = [];
    } else {
      this.checkAlarmObject = this.clone(this.checkAlarmObjectBackups);
      this.display.objTable = false;
      this._alarmObjectConfig.handledCheckedFun(this.checkAlarmObject);
    }
    if (this._type === 'table') {
      this.filterValue['filterValue'] = this.checkAlarmObject.ids;
    }
    this.pageBeanObject = new PageModel(10, 1, 1);
  }

  /**
   * 克隆数据
   */
  clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

}
