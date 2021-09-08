import { FacilityForCommonUtil } from '../../../../core-module/business-util/facility/facility-for-common.util';
import { SortCondition } from '../../../../shared-module/model/query-condition.model';
import { SelectDeviceModel } from '../../../../core-module/model/facility/select-device.model';

/**
 * 关联告警选择table配置
 */
export function initAlarmTableConfig(that) {
  that.tableConfig = {
    isDraggable: true,
    isLoading: false,
    showSearchSwitch: true,
    showRowSelection: false,
    showSizeChanger: false,
    notShowPrint: true,
    noIndex: true,
    simplePage: true,
    primaryKey: '06-2-1-11',
    scroll: { x: '1900px', y: '600px' },
    columnConfig: [
      {
        title: '',
        type: 'render',
        key: 'selectedAlarmId',
        renderTemplate: that.radioTemp,
        fixedStyle: { fixedLeft: true, style: { left: '0px' } },
        width: 42,
      },
      {
        // 告警名称
        title: that.alarmLanguage.alarmName,
        key: 'alarmName',
        width: 150,
        searchable: true,
        isShowSort: true,
        searchKey: 'alarmName',
        searchConfig: { type: 'input' },
      },
      {
        // 告警级别
        title: that.alarmLanguage.alarmDefaultLevel,
        key: 'alarmFixedLevel',
        width: 120,
        searchable: true,
        isShowSort: true,
        searchKey: 'alarmFixedLevel',
        searchConfig: {
          type: 'select',
          selectType: 'multiple',
          selectInfo: that.alarmLevelList,
          label: 'label',
          value: 'code',
        },
        type: 'render',
        renderTemplate: that.alarmLevelTemp,
      },
      {
        // 告警对象
        title: that.alarmLanguage.alarmobject,
        key: 'alarmObject',
        width: 150,
        searchable: true,
        isShowSort: true,
        searchKey: 'alarmSource',
        searchConfig: {
          type: 'render',
          renderTemplate: that.alarmEquipmentTemp,
        },
      },
      {
        // 告警类别
        title: that.alarmLanguage.AlarmType,
        key: 'alarmClassificationName',
        width: 150,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchKey: 'alarmClassification',
        searchConfig: {
          type: 'select',
          selectType: 'multiple',
          selectInfo: that.alarmTypeList,
          label: 'label',
          value: 'code',
        },
      },
      {
        // 区域
        title: that.alarmLanguage.areaName,
        key: 'areaName',
        width: 120,
        searchable: true,
        isShowSort: true,
        searchConfig: { type: 'input' },
      },
      {
        // 责任单位
        title: that.workOrderLanguage.accountabilityUnitName,
        key: 'responsibleDepartment',
        width: 120,
        searchable: true,
        searchConfig: { type: 'input' },
      },
      {
        // 设施类型
        title: that.alarmLanguage.alarmSourceType,
        key: 'deviceTypeName',
        width: 150,
        searchable: true,
        isShowSort: true,
        searchKey: 'alarmDeviceTypeId',
        searchConfig: {
          type: 'select',
          selectType: 'multiple',
          selectInfo: FacilityForCommonUtil.getRoleFacility(that.$nzI18n),
          label: 'label',
          value: 'code',
        },
        type: 'render',
        renderTemplate: that.deviceTemp,
      },
      {
        // 设施名称
        title: that.alarmLanguage.deviceName,
        key: 'alarmDeviceName',
        width: 150,
        isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: {
          type: 'render',
          renderTemplate: that.deviceNameTemp,
        },
      },
      {
        // 设备类型
        title: that.alarmLanguage.equipmentType,
        key: 'equipmentType',
        width: 160,
        configurable: true,
        searchable: true,
        isShowSort: true,
        searchKey: 'alarmSourceTypeId',
        searchConfig: {
          type: 'select',
          selectType: 'multiple',
          selectInfo: FacilityForCommonUtil.getRoleEquipmentType(that.$nzI18n),
          label: 'label',
          value: 'code',
        },
        type: 'render',
        renderTemplate: that.equipTemp,
      },
      {
        // 频次
        title: that.workOrderLanguage.frequency,
        key: 'alarmHappenCount',
        width: 100,
        searchable: true,
        isShowSort: true,
        searchKey: 'alarmHappenCount',
        searchConfig: { type: 'input' },
      },
      {
        // 清除状态
        title: that.language.alarmCleanStatus,
        key: 'alarmCleanStatusName',
        width: 150,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchKey: 'alarmCleanStatus',
        searchConfig: {
          type: 'select',
          selectType: 'multiple',
          selectInfo: [
            { label: that.language.noClean, value: 3 },
            { label: that.language.isClean, value: 1 },
            { label: that.language.deviceClean, value: 2 },
          ],
        },
      },
      {
        // 确认状态
        title: that.language.alarmConfirmStatus,
        key: 'alarmConfirmStatusName',
        width: 120,
        isShowSort: true,
        configurable: true,
        searchable: true,
        searchKey: 'alarmConfirmStatus',
        searchConfig: {
          type: 'select',
          selectType: 'multiple',
          selectInfo: [
            { label: that.language.isConfirm, value: 1 },
            { label: that.language.noConfirm, value: 2 },
          ],
        },
      },
      {
        // 首次发生时间
        title: that.language.alarmBeginTime,
        key: 'alarmBeginTime',
        width: 180,
        isShowSort: true,
        searchable: true,
        configurable: true,
        pipe: 'date',
        searchConfig: { type: 'dateRang' },
      },
      {
        // 备注
        title: that.language.remark,
        key: 'remark',
        width: 200,
        isShowSort: true,
        searchable: true,
        configurable: true,
        searchConfig: { type: 'input' },
      },
      {
        title: '',
        searchable: true,
        searchConfig: { type: 'operate' },
        key: '',
        width: 75,
        fixedStyle: { fixedRight: true, style: { right: '0px' } },
      },
    ],
    showPagination: true,
    bordered: false,
    showSearch: false,
    sort: (event: SortCondition) => {
      that.queryCondition.sortCondition.sortField = event.sortField;
      that.queryCondition.sortCondition.sortRule = event.sortRule;
      that.refreshData();
    },
    openTableSearch: (event) => {},
    handleSearch: (event) => {
      if (!event.length) {
        that.selectEquipments = [];
        that.checkEquipmentObject = {
          ids: [],
          name: '',
          type: '',
        };
        that.checkAlarmObject = new SelectDeviceModel();
        that.initAlarmObjectConfig();
        that.queryCondition.filterConditions = event;
        that.queryCondition.pageCondition = { pageSize: 10, pageNum: 1 };
        that.refreshData();
      } else {
        const filterEvent = that.handleFilter(event);
        that.queryCondition.filterConditions = filterEvent;
        that.queryCondition.pageCondition.pageNum = 1;
        that.refreshData();
      }
    },
  };
}

/**
 * 表单中单位选择
 */
export function initUnitTreeConfig(that) {
  that.treeUnitSelectorConfig = {
    title: that.InspectionLanguage.responsibleUnit,
    width: '460px',
    height: '330px',
    treeNodes: that.alarmUnitNode,
    treeSetting: {
      check: { enable: true, chkStyle: 'radio', radioType: 'all' },
      data: {
        simpleData: { enable: true, idKey: 'id', pIdKey: 'deptFatherId', rootPid: null },
        key: { name: 'deptName', children: 'childDepartmentList' },
      },
      view: { showIcon: false, showLine: false },
    },
    onlyLeaves: false,
    selectedColumn: [],
  };
}

/**
 * 关联告警中列表单位选择
 */
export function initUnitTreeSelectConfig(that) {
  that.unitTreeSelectorConfig = {
    title: that.InspectionLanguage.responsibleUnit,
    width: '400px',
    height: '300px',
    treeNodes: that.unitsTreeNode,
    treeSetting: {
      check: { enable: true, chkStyle: 'radio', radioType: 'all' },
      data: {
        simpleData: { enable: true, idKey: 'id', pIdKey: 'deptFatherId', rootPid: null },
        key: { name: 'deptName', children: 'childDepartmentList' },
      },
      view: { showIcon: false, showLine: false },
    },
    onlyLeaves: false,
    selectedColumn: [],
  };
}
