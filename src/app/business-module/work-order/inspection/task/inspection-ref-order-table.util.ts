import {FilterCondition, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {InspectionTaskModel} from '../../share/model/inspection-model/inspection-task.model';
import {DeleteInspectionTaskModel} from '../../share/model/inspection-model/delete-inspection-task.model';
import {IsDeleteEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {ListExportModel} from '../../../../core-module/model/list-export.model';

/**
 * 巡检任务列表配置
 */
export class InspectionTaskOrder {
  /**
   * 关联工单列表
   */
  public static initTableConfigAssociatedWorkOrder(that): void {
    that.associatedWorkOrderTableConfig = {
      isDraggable: true,
      primaryKey: '06-1-2-3',
      showSearchSwitch: true,
      isLoading: false,
      showSizeChanger: true,
      notShowPrint: true,
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          title: that.language.workOrderName, key: 'title', width: 200,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          searchable: true, isShowSort: true, searchConfig: {type: 'input'}
        },
        {
          title: that.language.workOrderStatus, key: 'status', width: 160,
          searchable: true, type: 'render', isShowSort: true, configurable: true,
          searchKey: 'status', renderTemplate: that.statusTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: WorkOrderBusinessCommonUtil.workOrderStatus(that.$nzI18n), label: 'label', value: 'code'
          },
        },
        {
          title: that.language.inspectionStartTime, key: 'inspectionStartTime', width: 160, pipe: 'date',
          searchable: true, isShowSort: true, configurable: true,
          searchKey: 'inspectionStartTime', searchConfig: {type: 'dateRang'}
        },
        {
          title: that.language.inspectionEndTime, key: 'expectedCompletedTime', width: 160, pipe: 'date',
          searchable: true, isShowSort: true, configurable: true,
          searchKey: 'expectedCompletedTime',
          searchConfig: {type: 'dateRang'}
        },
        { // 设施类型
          title: that.language.facilityType, key: 'deviceType',
          configurable: true, width: 160,
          isShowSort: true,
          searchable: true,
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
          title: that.language.equipmentType, key: 'equipmentType',
          configurable: true, width: 160,
          isShowSort: true,
          searchable: true,
          searchKey: 'equipmentType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(that.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: that.equipTemp,
        },
        {
          title: that.language.responsibleUnit, key: 'accountabilityDeptName', width: 160,
          searchable: true, configurable: true,
          searchKey: 'accountabilityDept',
          searchConfig: {type: 'render', renderTemplate: that.orderUnitNameSearch}
        },
        { // 责任人
          title: that.language.responsible, key: 'assignName', width: 160,
          searchKey: 'assign',
          configurable: true, searchable: true,
          searchConfig: {type: 'render', renderTemplate: that.userSearchTemp},
        },
        { // 进度
          title: that.language.speedOfProgress, key: 'processing',
          configurable: true, width: 160,
          isShowSort: true,
          searchable: false,
          type: 'render',
          renderTemplate: that.schedule,
        },
        { // 备注
          title: that.language.remark, key: 'remark',
          configurable: true, width: 160,
          isShowSort: true,
          searchable: true,
          searchKey: 'remark',
          searchConfig: {type: 'input'}
        },
        {// 操作
          title: that.language.operate, key: '', width: 90,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'operate'},
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      // 排序
      sort: (event: SortCondition) => {
        if (event.sortField === 'deviceType') {
          event.sortField = 'procRelatedDevices.deviceType';
        }
        if (event.sortField === 'equipmentType') {
          event.sortField = 'procRelatedEquipment.equipmentType';
        }
        that.associatedWorkOrderQueryCondition.sortCondition.sortField = event.sortField;
        that.associatedWorkOrderQueryCondition.sortCondition.sortRule = event.sortRule;
        that.refreshAssociatedWorkOrderData();
      },
      // 筛选
      handleSearch: (event: FilterCondition[]) => {
        that.associatedWorkOrderQueryCondition.filterConditions = event;
        // 没有值的时候重置已选数据
        if (event.length === 0) {
          that.selectOrderUnitName = '';
          FacilityForCommonUtil.setTreeNodesStatus(that.unitTreeNodes, []);
          that.selectUserList = [];
        }
        that.associatedWorkOrderQueryCondition.pageCondition.pageNum = 1;
        that.refreshAssociatedWorkOrderData();
      }
    };
  }

  /**
   * 巡检任务列表
   */
  public static initTableConfig(that): void {
    that.tableConfig = {
      primaryKey: '06-1-2',
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      searchReturnType: 'object',
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        { // 巡检任务名称
          title: that.language.inspectionTaskName, key: 'inspectionTaskName',
          fixedStyle: {fixedRight: true, style: {left: '124px'}}, width: 150,
          isShowSort: true, searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 巡检任务状态
          title: that.language.patrolTaskStatus, key: 'inspectionTaskStatus', width: 150,
          isShowSort: true, configurable: true, searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: WorkOrderBusinessCommonUtil.taskStatus(that.$nzI18n), label: 'label', value: 'code'
          },
        },
        { // 启用状态
          title: that.language.enabledState, key: 'opened', width: 150,
          isShowSort: true, configurable: true, searchable: true,
          type: 'render', renderTemplate: that.templateStatusTemp,
          searchConfig: {
            type: 'select',
            selectInfo: WorkOrderBusinessCommonUtil.getEnableStatus(that.$nzI18n), label: 'label', value: 'code'
          },
        },
        { // 巡检工单期望用时
          title: that.language.taskExpectedTime, key: 'procPlanDate', width: 150,
          isShowSort: true, configurable: true, searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: that.procPlanDateTemp,
          }
        },
        { // 巡检任务类型
          title: that.language.inspectionTaskType, key: 'inspectionTaskType', width: 150,
          configurable: true, searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: WorkOrderBusinessCommonUtil.taskType(that.$nzI18n), label: 'label', value: 'code'
          },
        },
        { // 巡检周期
          title: that.language.inspectionCycle, key: 'taskPeriod', width: 150,
          isShowSort: true, searchKey: 'taskPeriod',
          configurable: true, searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: that.taskPeriodPeTemp,
          }
        },
        { //  起始时间
          title: that.language.startTime, key: 'startTime', width: 180,
          pipe: 'date', isShowSort: true, configurable: true,
          searchable: true, searchConfig: {type: 'dateRang'},
        },
        { // 结束时间
          title: that.language.endTime, key: 'endTime', width: 180,
          pipe: 'date', isShowSort: true, configurable: true,
          searchable: true, searchConfig: {type: 'dateRang'},
        },
        { // 巡检区域
          title: that.language.inspectionArea, key: 'inspectionAreaName', width: 150,
          configurable: true, searchable: true,
          searchKey: 'inspectionAreaIds',
          searchConfig: {type: 'render', renderTemplate: that.areaSearch},
        },
        { // 巡检设施总数
          title: that.language.totalInspectionFacilities, key: 'inspectionDeviceCount', width: 150,
          configurable: true, isShowSort: true, searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: that.deviceCountTemp,
          }
        },
        { // 责任单位
          title: that.language.responsibleUnit, key: 'accountabilityDeptName', width: 190,
          configurable: true, isShowSort: true, searchable: true, searchKey: 'deptIds',
          searchConfig: {type: 'render', renderTemplate: that.unitNameSearch}
        },
        { // 操作
          title: that.language.operate,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}, width: 150,
          searchable: true, searchConfig: {type: 'operate'},
        },
      ],
      showPagination: true, bordered: false, showSearch: false,
      topButtons: [
        {
          text: that.language.addArea,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '06-1-2-1',
          handle: () => {
            that.inspectionTaskDetail(WorkOrderPageTypeEnum.add, null, null, WorkOrderPageTypeEnum.add).then();
          }
        },
        { // 批量删除
          text: that.language.delete, permissionCode: '06-1-2-5', btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          canDisabled: true, needConfirm: true,
          handle: (data: InspectionTaskModel[]) => {
            const ids = data.map(item => item.inspectionTaskId);
            that.checkData(ids).then((bool) => {
              if (bool) {
                const inspectionTask = new DeleteInspectionTaskModel();
                inspectionTask.deleted = IsDeleteEnum.deleted;
                inspectionTask.inspectionTaskIds = ids;
                that.deleteTemplate(inspectionTask);
              } else {
                that.$message.error(that.language.hasDeletedInspectionTask);
                that.refreshData();
              }
            });
          }
        },
      ],
      operation: [
        { // 查看详情
          text: that.language.checkDetail,
          permissionCode: '06-1-2-8',
          className: 'fiLink-view-detail',
          handle: (currentIndex: InspectionTaskModel) => {
            const id = currentIndex.inspectionTaskId;
            that.$router.navigate([`/business/work-order/inspection/unfinished-detail/taskView`],
              {queryParams: {inspectionTaskId: id, status: WorkOrderPageTypeEnum.taskView}});
          }
        },
        { // 编辑
          text: that.language.edit, permissionCode: '06-1-2-2', canDisabled: true,
          className: 'fiLink-edit',
          disabledClassName: 'fiLink-edit disabled-icon',
          handle: (currentIndex: InspectionTaskModel) => {
            const id = currentIndex.inspectionTaskId;
            that.checkDataRole(id).then(flag => {
              if (flag) {
                that.inspectionTaskDetail(WorkOrderPageTypeEnum.update, id, currentIndex.opened, WorkOrderPageTypeEnum.update).then();
              }
            });
          }
        },
        { // 关联工单
          text: that.language.associatedWorkOrder, className: 'fiLink-work-order-m',
          permissionCode: '06-1-2-3',
          handle: (currentIndex: InspectionTaskModel) => {
            // 打开关联工单弹框
            that.inspectionTaskTitle = that.language.associatedInspectionWorkOrder;
            that.isAssociatedWorkOrderVisible = true;
            that.id = currentIndex.inspectionTaskId;
            that.refreshAssociatedWorkOrderData();
          }
        },
        { // 巡检对象
          text: that.language.inspectObject, className: 'fiLink-inspection',
          permissionCode: '06-1-2-4',
          handle: (currentIndex: InspectionTaskModel) => {
            that.inspectObjectId = currentIndex.inspectionTaskId;
            that.inspectionObjectVisible = true;
          }
        },
        { // 单行删除
          text: that.language.delete,
          permissionCode: '06-1-2-5',
          className: 'fiLink-delete red-icon',
          canDisabled: true,
          needConfirm: true,
          handle: (data: InspectionTaskModel) => {
            const id = [data.inspectionTaskId];
            that.checkData(id).then((bool) => {
              if (bool) {
                const inspectionTask = new DeleteInspectionTaskModel();
                inspectionTask.deleted = IsDeleteEnum.deleted;
                inspectionTask.inspectionTaskIds = [data.inspectionTaskId];
                that.deleteTemplate(inspectionTask);
              } else {
                that.$message.error(`${that.language.theInspectionTaskNoLongerExistsTip}`);
              }
            });
          }
        },
      ],
      moreButtons: [
        { // 批量开启巡检任务状态
          text: that.language.enable,
          permissionCode: '06-1-2-6',
          btnType: 'danger',
          iconClassName: 'fiLink-enable',
          canDisabled: true,
          handle: (data: InspectionTaskModel[]) => {
            if (data.length > 0) {
              const arrId = data.map(item => item.inspectionTaskId);
              that.checkData(arrId).then((bool) => {
                if (bool) {
                  const ids = [];
                  const newArray = data.filter(item => item.opened === '0');
                  newArray.forEach(item => {
                    ids.push(item.inspectionTaskId);
                  });
                  if (ids.length === 0) {
                    that.$message.info(`${that.language.enabledTip}`);
                  } else {
                    that.enableStatus({inspectionTaskIds: ids});
                  }
                } else {
                  that.$message.error(`${that.language.hasDeletedInspectionTask}`);
                }
              });
            } else {
              return;
            }
          }
        },
        { // 批量关闭巡检任务状态
          text: that.language.disable,
          permissionCode: '06-1-2-7',
          iconClassName: 'fiLink-disable-o',
          canDisabled: true,
          handle: (data: InspectionTaskModel[]) => {
            if (data.length > 0) {
              const allId = data.map(item => item.inspectionTaskId);
              that.checkData(allId).then((bool) => {
                if (bool) {
                  const ids = [];
                  const newArray = data.filter(item => item.opened === '1');
                  newArray.forEach(item => {
                    ids.push(item.inspectionTaskId);
                  });
                  if (ids.length === 0) {
                    that.$message.info(`${that.language.disableTip}`);
                  } else {
                    that.disableStatus({inspectionTaskIds: ids});
                  }
                } else {
                  that.$message.error(`${that.language.hasDeletedInspectionTask}`);
                }
              });
            } else {
              return;
            }
          }
        },
      ],
      // 排序
      sort: (event: SortCondition) => {
        that.handleSort(event);
        that.refreshData();
      },
      // 筛选
      handleSearch: (event: InspectionTaskModel) => {
        that.taskPeriodInputValue = event.taskPeriod;
        that.procPlanDateInputValue = event.procPlanDate;
        that.deviceCountInputValue = event.inspectionDeviceCount;
        // 没有值的时候重置已选数据
        if (!event.deptIds) {
          that.selectUnitName = '';
          FacilityForCommonUtil.setTreeNodesStatus(that.unitTreeNodes, []);
        }
        if (!event.inspectionAreaIds) {
          that.areaList = {
            ids: [],
            name: ''
          };
        } // 周期
        if (!event.taskPeriod) {
          that.taskPeriodInputValue = '';
          that.queryCondition.bizCondition.taskPeriod = '';
          that.taskPeriodSelectedValue = OperatorEnum.lte;
        }// 期望用时
        if (!event.procPlanDate) {
          that.procPlanDateInputValue = '';
          that.queryCondition.bizCondition.procPlanDate = '';
          that.procPlanDateSelectedValue = OperatorEnum.lte;
        } // 设施总数
        if (!event.inspectionDeviceCount) {
          that.deviceCountInputValue = '';
          that.queryCondition.bizCondition.inspectionDeviceCount = '';
          that.deviceCountSelectedValue = OperatorEnum.lte;
        }
        that.handleSearch(event);
        that.refreshData();
      },
      // 导出
      handleExport: (event: ListExportModel<InspectionTaskModel[]>) => {
        // 设置导出列
        that.exportParams.columnInfoList = event.columnInfoList;
        that.exportParams.columnInfoList.forEach(item => {
          if (item.propertyName === 'inspectionTaskType' || item.propertyName === 'startTime' ||
            item.propertyName === 'endTime' || item.propertyName === 'inspectionTaskStatus' ||
            item.propertyName === 'opened') {
            item.isTranslation = 1;
          }
        });
        that.handleExport(event);
      }
    };
  }
}
