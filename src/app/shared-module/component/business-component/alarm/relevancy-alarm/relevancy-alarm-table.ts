import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {AlarmCleanStatusEnum} from '../../../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmConfirmStatusEnum} from '../../../../../core-module/enum/alarm/alarm-confirm-status.enum';
import {
  FilterCondition,
  PageCondition,
  SortCondition,
} from '../../../../model/query-condition.model';
import {PageModel} from '../../../../model/page.model';
import {AlarmListModel} from '../../../../../core-module/model/alarm/alarm-list.model';
import {AlarmSelectorInitialValueModel} from '../../../../model/alarm-selector-config.model';
import {OperatorEnum} from '../../../../enum/operator.enum';

/**
 * 关联告警
 */
export class RelevancyAlarmTable {
  public static initRelevancyAlarmTableConfig(that): void {
    that.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: false,
      notShowPrint: true,
      noIndex: true,
      searchReturnType: 'array',
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {
          type: 'expend',
          width: 30,
          title: '',
          expendDataKey: 'alarmCorrelationList',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        { // 单选
          title: '',
          type: that.multiple ? 'select' : 'render',
          // 设备单选时radioTemp模板，多选时允许选择 null，多选列表不允许选择forbidSelectTemp模板
          renderTemplate: that.multiple ?  null : that.radioTemp,
          fixedStyle: {
            fixedLeft: true,
            style: {left: '30px'}
          },
          width: 62
        },
        {
          key: 'serialNumber', width: 62, title: that.language.serialNumber,
        },
        {
          // 告警名称
          title: that.language.alarmName, key: 'alarmName', width: 180, isShowSort: true,
          searchable: true, searchKey: 'alarmName',
          searchConfig: {
            type: 'render',
            renderTemplate: that.alarmName
          },
        },
        {
          // 告警级别
          title: that.language.alarmFixedLevel, key: 'alarmFixedLevel', width: 120, isShowSort: true,
          type: 'render',
          configurable: false,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(that.$nzI18n), label: 'label', value: 'code'
          },
          renderTemplate: that.alarmFixedLevelTemp
        },
        {
          // 告警对象
          title: that.language.alarmobject, key: 'alarmObject', width: 180, isShowSort: true,
          searchKey: 'alarmSource',
          searchable: true,
          configurable: false,
          searchConfig: {
            type: 'render',
            renderTemplate: that.alarmEquipmentTemp
          },
        },
        {
          // 设备类型
          title: that.language.equipmentType, key: 'alarmSourceTypeId', width: 150, isShowSort: true,
          type: 'render',
          configurable: false,
          searchKey: 'alarm_source_type_id',
          searchable: true,
          renderTemplate: that.equipmentTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(that.$nzI18n), label: 'label', value: 'code'
          },
        },
        {
          // 设施名称
          title: that.language.deviceName, key: 'alarmDeviceName', width: 150, isShowSort: true,
          searchKey: 'alarmDeviceId',
          searchable: true,
          configurable: false,
          searchConfig: {
            type: 'render',
            renderTemplate: that.deviceNameTemp
          },
        },
        {
          // 设施类型
          title: that.language.alarmSourceType, key: 'alarmDeviceTypeId', width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchKey: 'alarm_device_type_id',
          type: 'render',
          renderTemplate: that.alarmSourceTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo:  FacilityForCommonUtil.getRoleFacility(that.$nzI18n),
            label: 'label', value: 'code'
          }
        },
        {
          // 区域
          title: that.language.area, key: 'areaName', width: 150, isShowSort: true,
          configurable: false,
          searchable: true,
          searchKey: 'area_id',
          searchConfig: {
            type: 'render',
            renderTemplate: that.areaSelectorTemp
          },
        },
        {
          // 告警类别
          title: that.language.AlarmType, key: 'alarmClassificationName', width: 150, isShowSort: true,
          configurable: false,
          searchable: true,
          searchKey: 'alarmClassification',
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: that.alarmTypeList
          },
        },
        {
          // 责任单位
          title: that.language.responsibleDepartment, key: 'responsibleDepartment', width: 150, isShowSort: true,
          configurable: false,
          searchable: true,
          searchConfig: {
            type: 'input',
          }
        },
        {
          // 频次
          title: that.language.alarmHappenCount, key: 'alarmHappenCount', width: 80, isShowSort: true,
          searchable: true,
          configurable: false,
          searchConfig: {
            type: 'render',
            renderTemplate: that.frequencyTemp,
          }
        },
        {
          // 清除状态
          title: that.language.alarmCleanStatus, key: 'alarmCleanStatus', width: 125, isShowSort: true,
          type: 'render',
          configurable: false,
          searchable: true,
          renderTemplate: that.isCleanTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: that.language.noClean, value: AlarmCleanStatusEnum.noClean},
              {label: that.language.isClean, value: AlarmCleanStatusEnum.isClean},
              {label: that.language.deviceClean, value: AlarmCleanStatusEnum.deviceClean}
            ]
          }
        },
        {
          // 确认状态
          title: that.language.alarmConfirmStatus, key: 'alarmConfirmStatus', width: 120, isShowSort: true,
          type: 'render',
          configurable: false,
          searchable: true,
          renderTemplate: that.isConfirmTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: that.language.isConfirm, value: AlarmConfirmStatusEnum.isConfirm},
              {label: that.language.noConfirm, value: AlarmConfirmStatusEnum.noConfirm}
            ]
          }
        },
        {
          // 首次发生时间
          title: that.language.alarmBeginTime, key: 'alarmBeginTime', width: 180, isShowSort: true,
          searchable: true,
          configurable: false,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          // 备注
          title: that.language.remark, key: 'remark', width: 200, isShowSort: true,
          searchable: true,
          configurable: false,
          searchConfig: {type: 'input'}
        },
        {
          title: that.language.operate, searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      showEsPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      moreButtons: [],
      operation: [],
      leftBottomButtons: [],
      // 勾选事件
      handleSelect: (event: AlarmListModel[]) => {
        that.selectedData = event;
        that.selectAlarms = event;
        that.handleOkDisabled = !that.selectedData.length;
      },
      // 排序
      sort: (event: SortCondition) => {
        if (event.sortField === 'alarmContinousTimeName') {
          // 当进行告警持续时间排序时 传给后台的是 alarmContinousTime 这个参数
          that.queryCondition.sortCondition.sortField = 'alarmContinousTime';
        } else {
          that.queryCondition.sortCondition.sortField = event.sortField;
        }
        that.queryCondition.sortCondition.sortRule = event.sortRule;
        that.refreshData();
      },
      // 打开表格搜索事件
      openTableSearch: () => {
        that.tableConfig.columnConfig.forEach(item => {
          if (item.searchKey === 'alarmClassification') {
            item.searchConfig.selectInfo = that.alarmTypeList;
          }
        });
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        that.queryCondition.filterConditions = [];
        if (!event.length) {
          RelevancyAlarmTable.clearData(that);
          that.queryCondition.pageCondition = new PageCondition(1, that.pageBean.pageSize);
          that.refreshData();
        } else {
          const filterEvent = RelevancyAlarmTable.handleFilter(event, that);
          that.pageBean = new PageModel(that.queryCondition.pageCondition.pageSize);
          that.queryCondition.filterConditions = filterEvent;
          that.queryCondition.pageCondition = new PageCondition(that.pageBean.pageIndex, that.pageBean.pageSize);
          that.refreshData();
        }
      },
    };
  }
  /**
   * 区域告警等模板数据清除
   */
  public static clearData(that) {
    //  告警名称 区域  告警对象 清空
    that.areaList = new AlarmSelectorInitialValueModel();
    that.checkAlarmName = new AlarmSelectorInitialValueModel();
    that.selectEquipments = [];
    that.selectUnitName = '';
    FacilityForCommonUtil.setTreeNodesStatus(that.treeNodes, []);
    that.checkAlarmObject = new AlarmSelectorInitialValueModel();
    that.checkAlarmEquipment = new AlarmSelectorInitialValueModel();
    // 区域
    that.initAreaConfig();
    // 告警名称
    that.initAlarmName();
    // 设施名称
    that.initAlarmObjectConfig();
  }

  /**
   * 过滤条件处理
   */
  public static handleFilter(filters: FilterCondition[], that) {
    filters.forEach(item => {
      const filterFieldArr = ['alarmNameId', 'alarmSource', 'alarmDeviceId', 'area_id'];
      if (filterFieldArr.includes(item.filterField)) {
        item.operator = OperatorEnum.in;
      }
      // 频次
      if (item.filterField === 'alarmHappenCount') {
        item.operator =  OperatorEnum.lte;
        item.filterValue = Number(item.filterValue) ? Number(item.filterValue) : 0;
      }
      // 责任单位
      if (item.filterField === 'responsibleDepartment') {
        item.operator =  OperatorEnum.like;
      }
    });
    return filters;
  }
}
