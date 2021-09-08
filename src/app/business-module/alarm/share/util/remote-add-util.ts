
import {TroubleUtil} from '../../../../core-module/business-util/trouble/trouble-util';
import {PageModel} from '../../../../shared-module/model/page.model';
import { FacilityForCommonUtil } from '../../../../core-module/business-util/facility/facility-for-common.util';
import {FilterCondition, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';

/**
 * 初始化设施列表配置
 */
export function deviceInitTableConfig(that) {
  that.deviceTableConfig = {
    isDraggable: true,
    primaryKey: '06-1-1-1',
    isLoading: false,
    showSearchSwitch: true,
    showRowSelection: false,
    showSizeChanger: true,
    showSearchExport: false,
    keepSelected: true,
    selectedIdKey: 'deviceId',
    notShowPrint: true,
    scroll: {x: '1600px', y: '600px'},
    columnConfig: [
      {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
      {// 资产编号
        title: that.facilityLanguage.deviceCode, key: 'deviceCode',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 名称
        title: that.facilityLanguage.name, key: 'deviceName',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 类型
        title: that.facilityLanguage.type, key: 'deviceType',
        searchable: true,
        configurable: true,
        isShowSort: true,
        type: 'render',
        width: 170,
        renderTemplate: that.deviceType,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: TroubleUtil.getDeviceType(that.deviceTypeListValue, that.$nzI18n), label: 'label', value: 'code'
        },
      },
      {// 状态
        title: that.facilityLanguage.status, key: 'deviceStatus',
        searchable: true,
        configurable: true,
        isShowSort: true,
        type: 'render',
        width: 170,
        renderTemplate: that.deviceStatus,
        searchConfig: {
          type: 'select',
          selectType: 'multiple',
          selectInfo: FacilityForCommonUtil.translateDeviceStatus(that.$nzI18n),
          label: 'label',
          value: 'code'
        }
      },
      {// 型号
        title: that.facilityLanguage.model, key: 'deviceModel',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 供应商
        title: that.facilityLanguage.supplierName, key: 'supplier',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 报废年限
        title: that.facilityLanguage.scrapTime, key: 'scrapTime',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 设备数量
        title: that.facilityLanguage.equipmentQuantity, key: 'equipmentQuantity',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 业务状态
        title: that.facilityLanguage.businessStatus, key: 'businessStatus',
        searchable: true,
        configurable: true,
        isShowSort: true,
        type: 'render',
        renderTemplate: that.businessStatusTemplate,
        searchConfig: {type: 'input'}
      },
      {// 详细地址
        title: that.facilityLanguage.address, key: 'address',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 所属区域
        title: that.facilityLanguage.areaId, key: 'areaName',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 安装日期
        title: that.facilityLanguage.installTime, key: 'installationDate',
        searchable: true,
        configurable: true,
        isShowSort: true,
        pipe: 'date',
        searchConfig: {type: 'dateRang'}
      },
      {// 备注
        title: that.facilityLanguage.remarks, key: 'remarks',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {
        title: '', searchable: true,
        searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ],
    showPagination: true,
    bordered: false,
    showSearch: false,
    operation: [],
    sort: (event: SortCondition) => {
      that.deviceQueryCondition.sortCondition.sortField = event.sortField;
      that.deviceQueryCondition.sortCondition.sortRule = event.sortRule;
      that.getDeviceData();
    },
    handleSearch: (event: FilterCondition[]) => {
      // 点击表格里的重置或查询，清掉存在的deviceId或alarmId等条件
      that.deviceQueryCondition.filterConditions = [];
      if (!event.length) {
        that.deviceQueryCondition.pageCondition = {pageSize: that.devicePageBean.pageSize, pageNum: 1};
        that.getDeviceData();
      } else {
        const filterEvent = [];
        event.forEach(item => {
          filterEvent.push(item);
        });
        that.devicePageBean = new PageModel(that.deviceQueryCondition.pageCondition.pageSize, 1, 1);
        that.deviceQueryCondition.pageCondition = {pageSize: that.devicePageBean.pageSize, pageNum: that.devicePageBean.pageIndex};
        that.deviceQueryCondition.filterConditions = filterEvent;
        that.getDeviceData();
      }
    },
    handleSelect: (data: FacilityListModel[]) => {
      that.checkDeviceData = [];
      if (data && data.length > 0) {
        that.checkDeviceData = data.map(item => ({
          deviceId: item.deviceId,
          deviceName: item.deviceName,
        }));
      }
      that.selectedDeviceData = that.checkDeviceData;
    },
  };
}
/**
 * 初始化设备列表配置
 */
export function equipmentInitTableConfig(that) {
  that.equipmentTableConfig = {
    isDraggable: true,
    primaryKey: '06-1-1-1',
    isLoading: false,
    showSearchSwitch: true,
    showRowSelection: false,
    showSizeChanger: true,
    keepSelected: true,
    selectedIdKey: 'equipmentId',
    showSearchExport: false,
    notShowPrint: true,
    scroll: {x: '1600px', y: '600px'},
    columnConfig: [
      {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
      {// 资产编号
        title: that.facilityLanguage.deviceCode, key: 'equipmentCode',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 名称
        title: that.facilityLanguage.name, key: 'equipmentName',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 类型
        title: that.facilityLanguage.type, key: 'equipmentType',
        searchable: true,
        configurable: true,
        isShowSort: true,
        type: 'render',
        width: 170,
        renderTemplate: that.equipmentType,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: TroubleUtil.getEquipmentType(that.equipmentTypeListValue, that.$nzI18n), label: 'label', value: 'code'
        },
      },
      {// 状态
        title: that.facilityLanguage.status, key: 'equipmentStatus',
        searchable: true,
        configurable: true,
        isShowSort: true,
        type: 'render',
        renderTemplate: that.equipmentStatus,
        searchConfig: {
          type: 'select', selectType: 'multiple',
          selectInfo: FacilityForCommonUtil.translateEquipmentStatus(that.$nzI18n),
          label: 'label',
          value: 'code'
        }
      },
      {// 型号
        title: that.facilityLanguage.model, key: 'equipmentModel',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 供应商
        title: that.facilityLanguage.supplierName, key: 'supplier',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 报废年限
        title: that.facilityLanguage.scrapTime, key: 'scrapTime',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 所属设施
        title: that.facilityLanguage.affiliatedDevice, key: 'deviceName',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 挂载位置
        title: that.facilityLanguage.mountPosition, key: 'mountPosition',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 安装时间
        title: that.facilityLanguage.installationDate, key: 'installationDate',
        searchable: true,
        configurable: true,
        isShowSort: true,
        pipe: 'date',
        searchConfig: {type: 'dateRang'}
      },
      {// 所属区域
        title: that.facilityLanguage.areaId, key: 'areaName',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 所属网关
        title: that.facilityLanguage.gatewayName, key: 'gatewayId',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {// 备注
        title: that.facilityLanguage.remarks, key: 'remarks',
        searchable: true,
        configurable: true,
        isShowSort: true,
        searchConfig: {type: 'input'}
      },
      {
        title: '', searchable: true,
        searchConfig: {type: 'operate'}, key: '', width: 75, fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ],
    showPagination: true,
    bordered: false,
    showSearch: false,
    operation: [],
    sort: (event: SortCondition) => {
      that.equipmentQueryCondition.sortCondition.sortField = event.sortField;
      that.equipmentQueryCondition.sortCondition.sortRule = event.sortRule;
      that.getEquipmentData();
    },
    handleSelect: (data: EquipmentListModel[]) => {
      that.checkEquipmentData = [];
      if (data && data.length > 0) {
        that.checkEquipmentData = data.map(item => ({
          equipmentId: item.equipmentId,
          equipmentName: item.equipmentName
        }));
      }
      that.selectedEquipmentData = that.checkEquipmentData;
    },
    handleSearch: (event: FilterCondition[]) => {
      // 点击表格里的重置或查询，清掉存在的deviceId或alarmId等条件
      that.equipmentQueryCondition.filterConditions = [];
      if (!event.length) {
        that.equipmentQueryCondition.pageCondition = {pageSize: that.equipmentPageBean.pageSize, pageNum: 1};
        that.getEquipmentData();
      } else {
        const filterEvent = [];
        event.forEach(item => {
          filterEvent.push(item);
        });
        that.equipmentPageBean = new PageModel(that.equipmentQueryCondition.pageCondition.pageSize, 1, 1);
        that.equipmentQueryCondition.pageCondition = {pageSize: that.equipmentPageBean.pageSize, pageNum: that.equipmentPageBean.pageIndex};
        that.equipmentQueryCondition.filterConditions = filterEvent;
        that.getEquipmentData();
      }
    },
  };
}

