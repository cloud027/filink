import {WorkOrderPageTypeEnum} from '../../../share/enum/work-order-page-type.enum';
import {RefAlarmFaultEnum} from '../../../share/enum/refAlarm-faultt.enum';
import {ClearBarrierOrInspectEnum} from '../../../share/enum/clear-barrier-work-order.enum';
import {FilterCondition, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {ClearBarrierWorkOrderModel} from '../../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {ListExportModel} from '../../../../../core-module/model/list-export.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';

export class UnfinishedClearBarrierWorkOrderTableUtil {
  private static selectDataId: string[] = [];
  /**
   * 初始化未完工销障工单列表
   */
  public static initUnfinishedTable(that): void {
    that.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      primaryKey: '06-2-1',
      outHeight: 55,
      scroll: {x: '2100px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          // 工单名称
          title: that.workOrderLanguage.name, key: 'title', width: 150,
          configurable: false, searchable: true, isShowSort: true,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          searchConfig: {type: 'input'}
        },
        {
          // 工单状态
          title: that.workOrderLanguage.status, key: 'status', width: 150,
          configurable: true, isShowSort: true, searchable: true,
          searchKey: 'status', minWidth: 100,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: that.selectOption},
          type: 'render',
          renderTemplate: that.statusTemp,
        },
        {
          // 设施名称
          title: that.workOrderLanguage.deviceName, key: 'deviceName', width: 150,
          configurable: true, searchable: true, isShowSort: true,
          searchKey: 'deviceId',
          searchConfig: {type: 'render', renderTemplate: that.deviceNameSearch},
        },
        {
          // 设施类型
          title: that.workOrderLanguage.deviceType, key: 'deviceType', width: 150,
          configurable: true, searchable: true, isShowSort: true,
          searchKey: 'deviceType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(that.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: that.deviceTemp,
        },
        {
          // 设施区域
          title: that.workOrderLanguage.deviceArea, key: 'deviceAreaName', width: 150,
          configurable: true, isShowSort: true, searchable: true,
          searchKey: 'deviceAreaCode',
          searchConfig: {type: 'render', renderTemplate: that.areaSearch},
        },
        {// 设备名称
          title: that.workOrderLanguage.equipmentName, key: 'equipmentName', width: 150,
          configurable: true, searchable: true, isShowSort: true,
          searchKey: 'equipment.equipmentId',
          searchConfig: {type: 'render', renderTemplate: that.equipmentSearch},
        },
        { // 设备类型
          title: that.workOrderLanguage.equipmentType, key: 'equipmentType', width: 150,
          configurable: true, searchable: true, isShowSort: true,
          searchKey: 'equipment.equipmentType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(that.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: that.equipTemps,
        },
        { // 来源
          title: that.workOrderLanguage.resourceType, key: 'dataResourceType', width: 120,
          configurable: true, searchable: true, isShowSort: true,
          searchKey: 'dataResourceType',
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: that.workOrderLanguage.alarm, code: '1'},
              {label: that.workOrderLanguage.fault, code: '2'}
            ],
            label: 'label', value: 'code'
          }
        },
        {
          // 关联告警 故障
          title: `${that.workOrderLanguage.relevance}${that.workOrderLanguage.alarm}/${that.workOrderLanguage.fault}`,
          key: 'dataResourceName', width: 180, configurable: true,
          type: 'render', searchable: true,
          renderTemplate: that.refAlarmTemp,
          searchKey: 'dataResourceName',
          searchConfig: {type: 'input'}
        },
        {
          // 责任单位
          title: that.workOrderLanguage.accountabilityUnitName, key: 'accountabilityDeptName', width: 150,
          configurable: true, searchable: true,
          searchKey: 'accountabilityDept',
          searchConfig: {type: 'render', renderTemplate: that.UnitNameSearch}
        },
        {
          // 责任人
          title: that.workOrderLanguage.assignName, key: 'assignName', width: 140,
          configurable: true, searchable: true,
          /*searchKey: 'assign',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: that.roleArr},*/
          searchKey: 'assign',
          searchConfig: {type: 'render', renderTemplate: that.userSearchTemp},
        },
        {
          // 期望完工时间
          title: that.workOrderLanguage.expectedCompleteTime, key: 'expectedCompletedTime',
          configurable: true, width: 200,
          isShowSort: true, searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {// 操作
          title: that.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      showEsPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: that.workOrderLanguage.addWorkOrder,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '06-2-1-1',
          handle: () => {
            that.navigateToDetail('business/work-order/clear-barrier/unfinished-detail/add', {queryParams: {status: WorkOrderPageTypeEnum.add}});
          }
        },
        {
          text: that.commonLanguage.deleteBtn,
          btnType: 'danger',
          canDisabled: true,
          needConfirm: true,
          permissionCode: '06-2-1-5',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          handle: (data: ClearBarrierWorkOrderModel[]) => {
            const ids = data.filter(item => item.checked).map(item => item.procId);
            that.deleteWorkOrder(ids);
          }
        }
      ],
      operation: [
        { // 详情
          text: that.commonLanguage.writeOffOrderDetail,
          className: 'fiLink-view-detail',
          permissionCode: '06-2-1-7',
          handle: (currentIndex: ClearBarrierWorkOrderModel) => {
            that.navigateToDetail('business/work-order/clear-barrier/unfinished-detail/view', {queryParams: {id: currentIndex.procId, type: WorkOrderPageTypeEnum.unfinished}});
          }
        },
        { // 退单
          text: that.commonLanguage.turnBackConfirm,
          key: 'isShowTurnBackConfirmIcon',
          className: 'fiLink-turn-back-confirm',
          permissionCode: '06-2-1-6',
          handle: (currentIndex: ClearBarrierWorkOrderModel) => {
            that.selectedWorkOrderId = currentIndex.procId;
            if (currentIndex.refAlarm) {
              that.orderPageType = RefAlarmFaultEnum.alarm;
              that.isRebuild = true;
            } else if (currentIndex.troubleId) {
              that.orderPageType = RefAlarmFaultEnum.fault;
              that.isRebuild = false;
            }
            that.$workOrderCommonUtil.queryDataRole(currentIndex.procId, ClearBarrierOrInspectEnum.clearBarrier).then(flag => {
              if (flag) {
                that.openSingleBackConfirmModal();
              }
            });
          }
        },
        { // 编辑
          text: that.commonLanguage.edit,
          permissionCode: '06-2-1-2',
          className: 'fiLink-edit',
          key: 'isShowEditIcon',
          handle: (currentIndex: ClearBarrierWorkOrderModel) => {
            // 如果工单不存在，则不允许编辑
            that.$workOrderCommonUtil.queryDataRole(currentIndex.procId, ClearBarrierOrInspectEnum.clearBarrier).then(flag => {
              if (flag) {
                let type = '';
                if (currentIndex.refAlarm) {
                  type = RefAlarmFaultEnum.alarm;
                } else if (currentIndex.troubleId) {
                  type = RefAlarmFaultEnum.fault;
                }
                const url = 'business/work-order/clear-barrier/unfinished-detail/update';
                that.navigateToDetail(url, {queryParams: {id: currentIndex.procId, status: WorkOrderPageTypeEnum.update, type: type}});
              }
            });
          },
        },
        { // 撤回
          text: that.commonLanguage.revert,
          permissionCode: '06-2-1-3',
          key: 'isShowRevertIcon',
          className: 'fiLink-revert',
          needConfirm: true,
          confirmContent: that.workOrderLanguage.isRevertWorkOrder,
          disabledClassName: 'fiLink-revert disabled-icon',
          handle: (data: ClearBarrierWorkOrderModel) => {
            that.$workOrderCommonUtil.queryDataRole(data.procId, ClearBarrierOrInspectEnum.clearBarrier).then(flag => {
              if (flag) {
                that.revokeWorkOrder(data.procId);
              }
            });
          }
        },
        { // 指派
          text: that.commonLanguage.assign,
          key: 'isShowAssignIcon',
          className: 'fiLink-assigned',
          permissionCode: '06-2-1-4',
          disabledClassName: 'fiLink-assigned disabled-icon',
          handle: (currentIndex: ClearBarrierWorkOrderModel) => {
            that.selectedAlarmId = currentIndex.refAlarm;
            that.selectedWorkOrderId = currentIndex.procId;
            that.$workOrderCommonUtil.queryDataRole(currentIndex.procId, ClearBarrierOrInspectEnum.clearBarrier).then(flag => {
              if (flag) {
                that.getAssignDataList(currentIndex.deviceAreaCode ? currentIndex.deviceAreaCode : '');
              }
            });
          }
        },
        { // 转派
          text: that.workOrderLanguage.transferOrder,
          permissionCode: '06-2-1-10',
          key: 'isShowTransfer',
          className: 'fiLink-turnProcess-icon',
          handle: (data: ClearBarrierWorkOrderModel) => {
            that.$workOrderCommonUtil.queryDataRole(data.procId, ClearBarrierOrInspectEnum.clearBarrier).then(flag => {
              if (flag) {
                that.showTransForm(data);
              }
            });
          }
        },
        { // 删除
          text: that.commonLanguage.deleteBtn,
          key: 'isShowDeleteIcon',
          permissionCode: '06-2-1-5',
          className: 'fiLink-delete red-icon',
          disabledClassName: 'fiLink-delete disabled-red-icon',
          needConfirm: true,
          handle: (data: ClearBarrierWorkOrderModel) => {
            const ids = [];
            ids.push(data.procId);
            that.deleteWorkOrder(ids);
          }
        },
        { // 运维建议
          text: that.workOrderLanguage.suggest,
          className: 'fiLink-suggest',
          permissionCode: '06-2-1-8',
          handle: () => {
            that.showSuggestInfo();
          }
        },
      ],
      sort: (event: SortCondition) => {
        that.queryCondition.sortCondition.sortField = event.sortField;
        that.queryCondition.sortCondition.sortRule = event.sortRule;
        that.refreshData();
      },
      handleSelect: (event) => {
        UnfinishedClearBarrierWorkOrderTableUtil.selectDataId = event.map(v => v.procId);
      },
      handleSearch: (event: FilterCondition[]) => {
        if (event.length === 0) {
          that.isReset = true;
          that.selectEquipments = [];
          that.checkEquipmentObject = {
            ids: [], name: '', type: ''
          };
          // 单位
          that.selectUnitName = '';
          FacilityForCommonUtil.setTreeNodesStatus(that.unitTreeNodes, []);
          // 区域
          that.filterObj.areaName = '';
          FacilityForCommonUtil.setAreaNodesStatus(that.areaNodes || [], null);
          // 设施
          that.filterObj.deviceName = '';
          that.filterObj.deviceIds = [];
          that.initDeviceObjectConfig();
          // 设备
          that.filterObj.equipmentName = '';
          that.filterObj.equipmentIds = [];
          that.initAlarmEquipment();
          that.selectUserList = [];
        }
        that.queryCondition.pageCondition.pageNum = 1;
        that.queryCondition.filterConditions = event;
        that.refreshData();
      },
      handleExport: (event: ListExportModel<ClearBarrierWorkOrderModel[]>) => {
        that.exportParams.queryCondition = that.queryCondition;
        that.exportParams.columnInfoList = event.columnInfoList;
        const params = ['status', 'dataResourceType', 'equipmentType', 'realityCompletedTime', 'expectedCompletedTime', 'deviceType'];
        that.exportParams.columnInfoList.forEach(item => {
          if (params.indexOf(item.propertyName) > -1) {
            item.isTranslation = 1;
          }
        });
        if (UnfinishedClearBarrierWorkOrderTableUtil.selectDataId.length) {
          const index = that.exportParams.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
          if (index > -1) {
            that.exportParams.queryCondition.filterConditions[index].filterValue = UnfinishedClearBarrierWorkOrderTableUtil.selectDataId;
            that.exportParams.queryCondition.filterConditions[index].operator = OperatorEnum.in;
          } else {
            that.exportParams.queryCondition.filterConditions.push({filterField: '_id', filterValue: UnfinishedClearBarrierWorkOrderTableUtil.selectDataId, operator: OperatorEnum.in});
          }
        } else {
          const i = that.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
          if (i > -1) {
            that.queryCondition.filterConditions.splice(i, 1);
            that.exportParams.queryCondition = that.queryCondition;
          }
        }
        that.handleExport(event);
      }
    };
  }
}


