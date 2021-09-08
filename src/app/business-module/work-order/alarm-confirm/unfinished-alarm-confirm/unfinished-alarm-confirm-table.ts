import {FilterCondition, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {AlarmConfirmWorkOrderModel} from '../../../../core-module/model/work-order/alarm-confirm.model';
import {SelectOrderEquipmentModel} from '../../share/model/select-order-equipment.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';

/**
 * 未完工告警确认工单列表配置
 */
export class UnfinishedAlarmConfirmTable {
  // 已选择工单id
  private static selectDataId: string[] = [];

  // 未完工告警工单列表
  public static initUnfinishedAlarmConfig(that): void {
    that.alarmTableConfig = {
      outHeight: 108,
      isDraggable: true,
      isLoading: false,
      primaryKey: '06-5-1',
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      searchReturnType: 'array',
      noIndex: false,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          // 工单名称
          title: that.workOrderLanguage.name, key: 'title', width: 150,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          configurable: false, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        {
          // 工单状态
          title: that.workOrderLanguage.status,  key: 'status', width: 120,
          configurable: true, isShowSort: true,
          searchable: true, searchKey: 'status',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: that.workOrderList
          },
          type: 'render',
          renderTemplate: that.statusTemp
        },
        {
          // 设施类型
          title: that.workOrderLanguage.deviceType,  key: 'deviceTypeName', width: 120,
          isShowSort: true, configurable: true,
          searchable: true, searchKey: 'deviceType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(that.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: that.deviceTemp
        },
        {
          // 设施名称
          title: that.workOrderLanguage.deviceName, key: 'deviceName', width: 160,
          configurable: true, searchable: true, isShowSort: true,
          searchKey: 'deviceId',
          searchConfig: {type: 'render', renderTemplate: that.deviceNameSearch}
        },
        {
          // 设备类型
          title: that.workOrderLanguage.equipmentType, key: 'equipmentTypeName', width: 190,
          configurable: true,
          searchable: true, isShowSort: true,
          searchKey: 'equipmentType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(that.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: that.equipTemp
        },
        {
          // 设备名称
          title: that.workOrderLanguage.equipmentName, key: 'equipmentName', width: 150,
          configurable: true, searchable: true, isShowSort: true,
          searchKey: 'equipment.equipmentId',
          searchConfig: {type: 'render', renderTemplate: that.equipmentSearch}
        },
        {
          // 设施区域
          title: that.workOrderLanguage.deviceArea, key: 'deviceAreaName',
          configurable: true, isShowSort: true, searchKey: 'deviceAreaCode',
          searchable: true, width: 150,
          searchConfig: {
            type: 'render',
            renderTemplate: that.areaSearch
          }
        },
        {
          // 期望完工时间
          title: that.workOrderLanguage.expectedCompleteTime, key: 'expectedCompletedTime',
          configurable: true, isShowSort: true,
          searchable: true, width: 170,
          pipe: 'date', searchConfig: {type: 'dateRang'}
        },
        {
          // 关联告警
          title: that.workOrderLanguage.relevancyAlarm, key: 'refAlarmName',
          configurable: true, isShowSort: true, searchKey: 'refAlarmName',
          searchable: true, width: 150,
          searchConfig: {type: 'input'},
          type: 'render',
          renderTemplate: that.refAlarmTemp,
        },
        {
          // 待确认原因
          title: that.inspectionLanguage.confirmReason, key: 'uncertainReason',
          configurable: true, width: 150, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        {
          // 实际告警原因
          title: that.inspectionLanguage.realAlarmReason, key: 'realityAlarmReason',
          configurable: true, width: 150, isShowSort: true,
          searchable: true, searchConfig: {type: 'input'}
        },
        {
          // 责任单位
          title: that.inspectionLanguage.responsibleUnit, key: 'accountabilityDeptName',
          configurable: true, isShowSort: true, searchKey: 'accountabilityDept',
          searchable: true,  width: 150,
          searchConfig: {
            type: 'render',
            renderTemplate: that.unitNameSearch
          }
        },
        {// 责任人
          title: that.inspectionLanguage.responsible, key: 'assignName', width: 140,
          configurable: true, searchKey: 'assign',
          searchable: true, isShowSort: true,
          searchConfig: {type: 'render', renderTemplate: that.userSearchTemp},
        },
        {
          title: that.inspectionLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      showEsPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          // 新增
          text: that.workOrderLanguage.addWorkOrder,
          permissionCode: '06-5-1-1',
          iconClassName: 'fiLink-add-no-circle',
          handle: () => {
            that.$router.navigate([`/business/work-order/alarm-confirm/alarm-confirm-detail/add`],
              {queryParams: {type: WorkOrderPageTypeEnum.add}});
          }
        },
        {
          text: that.inspectionLanguage.delete,
          permissionCode: '06-5-1-4',
          btnType: 'danger',
          canDisabled: true,
          needConfirm: true,
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          handle: (data: AlarmConfirmWorkOrderModel[]) => {
            that.deleteProc(data);
          }
        }
      ],
      operation: [
        {
          // 退单确认
          text: that.inspectionLanguage.turnBackConfirm,
          permissionCode: '06-5-1-8',
          key: 'isShowTurnBackConfirmIcon',
          className: 'fiLink-turn-back-confirm',
          handle: (data) => {
            that.currentProcId = data.procId;
            that.isChargeback = true;
          }
        },
        { // 编辑
          text: that.inspectionLanguage.edit,
          permissionCode: '06-5-1-2',
          className: 'fiLink-edit',
          key: 'isShowEditIcon',
          handle: (data: AlarmConfirmWorkOrderModel) => {
            that.$router.navigate([`/business/work-order/alarm-confirm/alarm-confirm-detail/update`],
              {queryParams: {type: WorkOrderPageTypeEnum.update, procId: data.procId, operateFrom: WorkOrderPageTypeEnum.unfinished}});
          },
        },
        {
          // 待指派可以指派
          text: that.inspectionLanguage.assign,
          permissionCode: '06-5-1-5',
          key: 'isShowAssignIcon',
          className: 'fiLink-assigned',
          disabledClassName: 'fiLink-assigned disabled-icon',
          handle: (data: AlarmConfirmWorkOrderModel) => {
            that.currentProcId = data.procId;
            that.getAssignData(data.deviceAreaCode);
          }
        },
        { // 撤回
          text: that.inspectionLanguage.withdraw,
          key: 'isShowRevertIcon',
          permissionCode: '06-5-1-6',
          className: 'fiLink-revert',
          needConfirm: true,
          confirmContent: that.workOrderLanguage.isRevertWorkOrder,
          disabledClassName: 'fiLink-revert disabled-icon',
          handle: (data: AlarmConfirmWorkOrderModel) => {
            that.currentProcId = data.procId;
            that.backAlarmOrder();
          }
        },
        {
          // 转派
          text: that.workOrderLanguage.transferOrder,
          key: 'isShowTransfer',
          permissionCode: '06-5-1-7',
          className: 'fiLink-turnProcess-icon',
          handle: (data: AlarmConfirmWorkOrderModel) => {
            that.workOrderTransfer(data);
          }
        },
        { // 删除
          text: that.inspectionLanguage.delete,
          permissionCode: '06-5-1-4',
          key: 'isShowDeleteIcon',
          className: 'fiLink-delete red-icon',
          disabledClassName: 'fiLink-delete disabled-red-icon',
          needConfirm: true,
          handle: (data: AlarmConfirmWorkOrderModel) => {
            that.deleteProc([data]);
          }
        },
        { // 详情
          text: that.inspectionLanguage.inspectionDetail,
          permissionCode: '06-5-1-9',
          className: 'fiLink-view-detail',
          handle: (data: AlarmConfirmWorkOrderModel) => {
            that.$router.navigate(['business/work-order/alarm-confirm/alarm-confirm-detail'],
              {queryParams: {id: data.procId, type: WorkOrderPageTypeEnum.unfinished}}).then();
          }
        }
      ],
      sort: (event: SortCondition) => {
        if (event.sortField === 'deviceTypeName') {
          event.sortField = 'deviceType';
        }
        if (event.sortField === 'equipmentTypeName') {
          event.sortField = 'equipmentType';
        }
        that.queryCondition.sortCondition = event;
        that.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        if (event.length === 0) {
          that.isResetParam = true;
          // 设施
          that.filterObj.deviceName = '';
          that.filterObj.deviceIds = [];
          that.initDeviceObjectConfig();
          // 设备
          that.selectEquipments = [];
          that.checkEquipmentObject = new SelectOrderEquipmentModel();
          // 责任人
          that.selectUserList = [];
        }
        that.queryCondition.pageCondition.pageNum = 1;
        that.queryCondition.filterConditions = event;
        that.refreshData();
      },
      handleSelect: (event) => {
        UnfinishedAlarmConfirmTable.selectDataId = event.map(v => v.procId);
      },
      handleExport: (event: ListExportModel<any[]>) => {
        that.exportParams.columnInfoList = event.columnInfoList;
        const params = ['status', 'expectedCompletedTime', 'equipmentTypeName', 'deviceTypeName'];
        that.exportParams.columnInfoList.forEach(item => {
          if (params.indexOf(item.propertyName) > -1) {
            item.isTranslation = 1;
          }
          if (item.propertyName === 'deviceTypeName') {
            item.propertyName = 'deviceType';
          }
          if (item.propertyName === 'equipmentTypeName') {
            item.propertyName = 'equipmentType';
          }
        });
        that.exportParams.queryCondition = that.queryCondition;
        const index = that.exportParams.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
        if (UnfinishedAlarmConfirmTable.selectDataId.length) {
          if (index > -1) {
            that.exportParams.queryCondition.filterConditions[index].filterValue = UnfinishedAlarmConfirmTable.selectDataId;
            that.exportParams.queryCondition.filterConditions[index].operator = OperatorEnum.in;
          } else {
            that.exportParams.queryCondition.filterConditions.push({filterField: '_id', filterValue: UnfinishedAlarmConfirmTable.selectDataId, operator: OperatorEnum.in});
          }
        } else {
          const i = that.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
          if (i > -1) {
            that.queryCondition.filterConditions.splice(i, 1);
            that.exportParams.queryCondition = that.queryCondition;
          }
        }
        that.exportParams.excelType = event.excelType;
        that.$alarmWorkOrderService.alarmOrderExport(that.exportParams).subscribe((result: ResultModel<string>) => {
          if (result.code === ResultCodeEnum.success) {
            that.$message.success(that.inspectionLanguage.operateMsg.exportSuccess);
          } else {
            that.$message.error(result.msg);
          }
        });
      }
    };
  }
}
