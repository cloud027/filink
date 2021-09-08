import {SortCondition} from '../../../../shared-module/model/query-condition.model';
import {InspectionTaskModel} from '../../share/model/inspection-model/inspection-task.model';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';

/**
 * 详情页表单
 */

export class InspectionOrderDetailUtil {
  /**
   * 巡检任务详情工单列表
   */
  public static initTaskOrderTable(that): void {
    that.deviceTableConfig = {
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      notShowPrint: true,
      primaryKey: '06-1-2-8-1',
      scroll: {x: '1000px', y: '305px'},
      columnConfig: [
        { // 工单名称
          title: that.InspectionLanguage.workOrderName, key: 'title',
          configurable: true, width: 160,
          isShowSort: true, searchable: true,
          searchKey: 'title',
          searchConfig: {type: 'input'}
        },
        { // 工单状态
          title: that.InspectionLanguage.workOrderStatus, key: 'status',
          configurable: true, width: 160,
          isShowSort: true, searchable: true,
          searchKey: 'status',
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: that.InspectionLanguage.assigned, value: WorkOrderStatusEnum.assigned},
              {label: that.InspectionLanguage.pending, value: WorkOrderStatusEnum.pending},
              {label: that.InspectionLanguage.processing, value: WorkOrderStatusEnum.processing},
              {label: that.InspectionLanguage.turnProcess, value: WorkOrderStatusEnum.turnProcess},
              {label: that.InspectionLanguage.singleBack, value: WorkOrderStatusEnum.singleBack},
            ]
          },
          type: 'render',
          renderTemplate: that.statusTemp,
        },
        { // 巡检起始时间
          title: that.InspectionLanguage.inspectionStartTime, key: 'inspectionStartTime',
          configurable: true, width: 160,
          pipe: 'date', isShowSort: true, searchable: true,
          searchKey: 'inspectionStartTime',
          searchConfig: {type: 'dateRang'}
        },
        { // 期望完工时间
          title: that.InspectionLanguage.inspectionEndTime, key: 'expectedCompletedTime',
          pipe: 'date', width: 160,
          configurable: true, isShowSort: true, searchable: true,
          searchKey: 'expectedCompletedTime',
          searchConfig: {type: 'dateRang'}
        },
        { // 设施类型
          title: that.InspectionLanguage.facilityType, key: 'deviceType',
          configurable: true, width: 160,
          isShowSort: true, searchable: true,
          searchKey: 'deviceType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(that.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: that.deviceTypeTemp,
        },
        { // 设备类型
          title: that.InspectionLanguage.equipmentType, key: 'equipmentType',
          configurable: true, width: 160,
          isShowSort: true, searchable: true,
          searchKey: 'equipmentType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(that.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: that.equipTemp,
        },
        { // 责任单位
          title: that.InspectionLanguage.responsibleUnit, key: 'accountabilityDeptName',
          configurable: true, width: 160,
          isShowSort: true, searchable: true,
          searchKey: 'accountabilityDept',
          searchConfig: {type: 'render', renderTemplate: that.UnitNameSearch}
        },
        { // 责任人
          title: that.InspectionLanguage.responsible, key: 'assignName', width: 160,
          searchKey: 'assign',
          configurable: true, searchable: true,
          /*searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: that.roleArray,
          }*/
          searchConfig: {type: 'render', renderTemplate: that.userSearchTemp},
        },
        { // 进度
          title: that.InspectionLanguage.speedOfProgress, key: 'progressSpeed',
          configurable: true, width: 160,
          isShowSort: true, searchable: false,
          type: 'render',
          renderTemplate: that.schedule,
        },
        { // 备注
          title: that.InspectionLanguage.remark, key: 'remark',
          configurable: true, width: 160,
          isShowSort: true, searchable: true,
          searchKey: 'remark',
          searchConfig: {type: 'input'}
        },
        {// 操作
          title: that.InspectionLanguage.operate, key: '', width: 80,
          configurable: true, searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        {
          text: that.InspectionLanguage.relatedPictures,
          className: 'fiLink-view-photo',
          /*permissionCode: '06-2-2-1',*/
          handle: (data) => {
            that.getPicUrlByAlarmIdAndDeviceId(data);
          }
        },
      ],
      sort: (event) => {
        if (event.sortField === 'deviceType') {
          event.sortField = 'procRelatedDevices.deviceType';
        }
        if (event.sortField === 'equipmentType') {
          event.sortField = 'procRelatedEquipment.equipmentType';
        }
        that.queryCondition.sortCondition.sortField = event.sortField;
        that.queryCondition.sortCondition.sortRule = event.sortRule;
        that.refreshData();
      },
      handleSearch: (event) => {
        if (event.length === 0) {
          that.selectUnitName = '';
          that.selectUserList = [];
        }
        that.queryCondition.filterConditions = event;
        that.queryCondition.pageCondition.pageNum = 1;
        that.refreshData();
      }
    };
  }


  /**
   *  设施弹窗表格
   * */
  public static initInspectDeviceTable(that): void {
    that.inspectDeviceTableConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: false,
      showRowSelection: false,
      notShowPrint: true,
      scroll: {x: '480px', y: '305px'},
      columnConfig: [
        {// 名称
          title: that.InspectionLanguage.devicesName,
          key: 'deviceName', width: 120,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceName',
          searchConfig: {type: 'input'}
        },
        {// 地址
          title: that.InspectionLanguage.address,
          key: 'address', width: 200,
          isShowSort: true,
          searchable: true,
          searchKey: 'address',
          searchConfig: {type: 'input'}
        },
        {// 操作
          title: that.InspectionLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      showEsPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      sort: (event: SortCondition) => {
        that.deviceQueryCondition.sortCondition.sortField = event.sortField;
        that.deviceQueryCondition.sortCondition.sortRule = event.sortRule;
        that.getDeviceTabListData();
      },
      openTableSearch: (event) => {},
      handleSearch: (event) => {
        that.deviceQueryCondition.filterConditions = event;
        that.deviceQueryCondition.pageCondition.pageNum = 1;
        that.getDeviceTabListData();
      }
    };
  }

  /**
   * 设备列表
   */
  public static initEquipmentTable(that): void {
    that.equipTableConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: false,
      showSearchExport: false,
      notShowPrint: false,
      simplePage: false,
      scroll: {x: '400px', y: '305px'},
      columnConfig: [
        {
          // 设备类型
          title: that.InspectionLanguage.equipmentType,
          key: 'equipmentType', width: 200,
          type: 'render',
          renderTemplate: that.equipTaskTemp,
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      sort: (event) => {},
      openTableSearch: (event) => {},
      handleSearch: (event) => {}
    };
  }

  /**
   * 巡检报告表格
   */
  public static initReportTable(that): void {
    that.reportTableConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: false,
      showSearchExport: false,
      notShowPrint: false,
      primaryKey: '06-1-1-9-1',
      scroll: {x: '1000px', y: '305px'},
      columnConfig: [
        {// 巡检项名称
          title: that.InspectionLanguage.inspectionItem,
          key: 'inspectionItemName', width: 100,
        },
        {// 是否通过
          title: that.InspectionLanguage.isPass,
          key: 'statusName', width: 80,
          type: 'render',
          renderTemplate: that.resultTemp,
        },
        {// 备注
          title: that.InspectionLanguage.remark,
          key: 'remark', width: 190,
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      sort: (event) => {},
      openTableSearch: (event) => {},
      handleSearch: (event) => {}
    };
  }

  /**
   * 工单详情中工单列表
   */
  public static initOrderTable(that): void {
    that.orderTableConfig = {
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      notShowPrint: true,
      primaryKey: '06-1-1-8-1',
      scroll: {x: '1000px', y: '305px'},
      columnConfig: [
        {
          // 巡检设施
          title: that.InspectionLanguage.setDevice, key: 'deviceName',
          configurable: true, width: 170,
          isShowSort: true, searchable: true,
          searchKey: 'procRelatedDevices.deviceName',
          searchConfig: {type: 'input'}
        },
        {
          // 巡检结果
          title: that.InspectionLanguage.inspectionResults, key: 'result',
          configurable: true, width: 170,
          isShowSort: true, searchable: true,
          searchKey: 'procRelatedDevices.result',
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: that.InspectionLanguage.normal, value: '0'},  // 正常
              {label: that.InspectionLanguage.abnormal, value: '1'},   // 异常
            ]
          }
        },
        { // 异常详细
          title: that.InspectionLanguage.exceptionallyDetailed, key: 'remark',
          configurable: true, width: 170,
          isShowSort: true, searchable: true,
          searchKey: 'procRelatedDevices.remark',
          searchConfig: {type: 'input'}
        },
        { // 巡检时间
          title: that.InspectionLanguage.inspectionTime, key: 'inspectionTime',
          pipe: 'date', width: 170,
          configurable: true, isShowSort: true, searchable: true,
          searchKey: 'procRelatedDevices.inspectionTime',
          searchConfig: {type: 'dateRang'}
        },
        { // 责任人
          title: that.InspectionLanguage.responsible, key: 'assignName',
          configurable: true, width: 170, searchable: true,
          searchKey: 'procRelatedDevices.assign',
          searchConfig: {type: 'render', renderTemplate: that.userSearchTemp},
        },
        { // 资源匹配情况
          title: that.InspectionLanguage.matchingOfResources, key: 'resourceMatching',
          configurable: true, searchable: true,
          searchKey: 'resourceMatching',
          searchConfig: {type: 'input'}
        },
        {// 操作
          title: that.InspectionLanguage.operate, key: '', width: 80,
          configurable: true, searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        {
          text: that.InspectionLanguage.relatedPictures,
          className: 'fiLink-view-photo',
          handle: (currentIndex: InspectionTaskModel) => {
            that.getPicUrlByAlarmIdAndDeviceId(currentIndex);
          }
        },
      ],
      sort: (event: SortCondition) => {
        if (event.sortField !== 'resourceMatching') {
          that.queryCondition.sortCondition.sortField = `procRelatedDevices.${event.sortField}`;
        } else {
          that.queryCondition.sortCondition.sortField = event.sortField;
        }
        that.queryCondition.sortCondition.sortRule = event.sortRule;
        that.refreshOrderData();
      },
      handleSearch: (event) => {
        if (!event || event.length === 0) {
          that.selectUserList = [];
        }
        that.queryCondition.pageCondition.pageNum = 1;
        that.queryCondition.filterConditions = event;
        that.refreshOrderData();
      }
    };
  }
}
