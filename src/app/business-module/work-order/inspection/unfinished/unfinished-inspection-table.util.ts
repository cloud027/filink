import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {InspectionWorkOrderModel} from '../../../../core-module/model/work-order/inspection-work-order.model';
import {ClearBarrierOrInspectEnum, IsSelectAllEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {Result} from '../../../../shared-module/entity/result';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {AreaDeviceParamModel} from '../../../../core-module/model/work-order/area-device-param.model';
import {FilterCondition, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {InspectionTaskModel} from '../../share/model/inspection-model/inspection-task.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';

/**
 * 未完工列表配置
 */
export class UnfinishedInspectionTableUtil {
    private static selectDataId: string[] = [];
    /**
     * 未完工列表
     */
    public static initUnfinishedTable(that): void {
        that.tableConfig = {
            isDraggable: true,
            isLoading: false,
            primaryKey: '06-1-1',
            showSearchSwitch: true,
            showRowSelection: false,
            showSizeChanger: true,
            showSearchExport: true,
            scroll: {x: '2000px', y: '600px'},
            columnConfig: [
                {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
                {
                    title: that.InspectionLanguage.workOrderName, key: 'title', width: 150,
                    fixedStyle: {fixedLeft: true, style: {left: '124px'}},
                    configurable: false, isShowSort: true,
                    searchable: true, searchConfig: {type: 'input'}
                },
                {
                    title: that.InspectionLanguage.workOrderStatus, key: 'status', width: 150,
                    configurable: true, isShowSort: true,
                    searchable: true, searchKey: 'status',
                    searchConfig: {
                        type: 'select', selectType: 'multiple',
                        selectInfo: that.workOrderList
                    },
                    type: 'render',
                    renderTemplate: that.statusTemp,
                },
                {
                    title: that.InspectionLanguage.inspectionEndTime, key: 'expectedCompletedTime', width: 180,
                    pipe: 'date', configurable: true,
                    isShowSort: true, searchable: true,
                    searchKey: 'expectedCompletedTime',
                    searchConfig: {type: 'dateRang'}
                },
                {// 巡检区域
                    title: that.InspectionLanguage.inspectionArea, key: 'inspectionAreaName', width: 150,
                    configurable: true, isShowSort: true,
                    searchable: true, searchKey: 'deviceAreaCode',
                    searchConfig: {type: 'render', renderTemplate: that.areaSearch},
                },
                {// 设施类型
                    title: that.InspectionLanguage.facilityType, key: 'deviceType', width: 130,
                    isShowSort: true, configurable: true,
                    searchable: true, searchKey: 'deviceType',
                    searchConfig: {
                        type: 'select', selectType: 'multiple',
                        selectInfo: FacilityForCommonUtil.getRoleFacility(that.$nzI18n),
                        label: 'label', value: 'code'
                    },
                    type: 'render',
                    renderTemplate: that.deviceTemp,
                },
                {// 设备类型
                    title: that.InspectionLanguage.equipmentType, key: 'equipmentType', width: 190,
                    configurable: true,
                    searchable: true, isShowSort: true,
                    searchKey: 'equipmentType',
                    searchConfig: {
                        type: 'select', selectType: 'multiple',
                        selectInfo: FacilityForCommonUtil.getRoleEquipmentType(that.$nzI18n),
                        label: 'label', value: 'code'
                    },
                    type: 'render',
                    renderTemplate: that.equipTemp,
                },
                {// 责任单位
                    title: that.InspectionLanguage.responsibleUnit, key: 'accountabilityDeptName', width: 150,
                    configurable: true, searchKey: 'accountabilityDept',
                    searchable: true, isShowSort: true,
                    searchConfig: {type: 'render', renderTemplate: that.UnitNameSearch}
                },
                {// 责任人
                    title: that.InspectionLanguage.responsible, key: 'assignName', width: 140,
                    configurable: true, searchKey: 'assign',
                    searchable: true, isShowSort: true,
                    /*searchConfig: {type: 'select', selectType: 'multiple', selectInfo: that.roleArray, renderTemplate: that.roleTemp}*/
                    searchConfig: {type: 'render', renderTemplate: that.userSearchTemp},
                },
                {// 进度
                    title: that.InspectionLanguage.speedOfProgress, key: 'progressSpeed', width: 200,
                    configurable: true, isShowFilter: false,
                    searchable: false, isShowSort: true,
                    type: 'render',
                    renderTemplate: that.schedule,
                },
                {// 操作
                    title: that.InspectionLanguage.operate, key: '', width: 200,
                    configurable: false, searchable: true,
                    searchConfig: {type: 'operate'},
                    fixedStyle: {fixedRight: true, style: {right: '0px'}}
                },
            ],
            showPagination: false,
            showEsPagination: false,
            bordered: false,
            showSearch: false,
            topButtons: [
                {
                    text: that.InspectionLanguage.addArea,
                    iconClassName: 'fiLink-add-no-circle',
                    permissionCode: '06-1-1-1',
                    handle: () => {
                        that.$router.navigate([`/business/work-order/inspection/unfinished-detail/add`],
                            {queryParams: {type: WorkOrderPageTypeEnum.add}});
                    }
                },
                {
                    text: that.InspectionLanguage.delete,
                    permissionCode: '06-1-1-3',
                    btnType: 'danger',
                    canDisabled: true,
                    needConfirm: true,
                    className: 'table-top-delete-btn',
                    iconClassName: 'fiLink-delete',
                    handle: (currentIndex: InspectionWorkOrderModel[]) => {
                        const arr = [];
                        currentIndex.forEach(item => {
                            arr.push(item.procId);
                        });
                        const data = {
                            procIdList: arr,
                            procType: ClearBarrierOrInspectEnum.inspection
                        };
                        that.$inspectionWorkOrderService.deleteUnfinishedOrderByIds(data).subscribe((result: ResultModel<string>) => {
                            if (result.code === ResultCodeEnum.success) {
                                that.$message.success(that.InspectionLanguage.operateMsg.deleteSuccess);
                                that.queryCondition.pageCondition.pageNum = 1;
                                that.refreshData();
                                that.getCardStatistics();
                            } else {
                                that.$message.error(result.msg);
                            }
                        });
                    }
                },
            ],
            operation: [
                {
                    // 退单确认
                    text: that.InspectionLanguage.turnBackConfirm,
                    permissionCode: '06-1-1-6',
                    key: 'isShowTurnBackConfirmIcon',
                    className: 'fiLink-turn-back-confirm',
                    handle: (currentIndex: InspectionWorkOrderModel) => {
                        that.returnID = currentIndex.procId;
                        that.$workOrderCommonUtil.queryDataRole(currentIndex.procId, ClearBarrierOrInspectEnum.inspection).then(flag => {
                            if (flag) {
                                that.openSingleBackConfirmModal();
                            }
                        });
                    }
                },
                {
                    // 编辑
                    text: that.InspectionLanguage.edit,
                    permissionCode: '06-1-1-2',
                    key: 'isShowEditIcon',
                    className: 'fiLink-edit',
                    disabledClassName: 'fiLink-edit disabled-icon',
                    handle: (currentIndex: InspectionWorkOrderModel) => {
                        that.$workOrderCommonUtil.queryDataRole(currentIndex.procId, ClearBarrierOrInspectEnum.inspection).then(flag => {
                            if (flag) {
                                that.$router.navigate([`/business/work-order/inspection/unfinished-detail/update`],
                                    {queryParams: {procId: currentIndex.procId, type: WorkOrderPageTypeEnum.update, status: currentIndex.status}}).then();
                            }
                        });
                    }
                },
                {
                    // 撤回
                    text: that.InspectionLanguage.withdraw,
                    permissionCode: '06-1-1-4',
                    key: 'isShowRevertIcon',
                    className: 'fiLink-revert',
                    needConfirm: true,
                    confirmContent: that.InspectionLanguage.isRevertWorkOrder,
                    disabledClassName: 'fiLink-revert disabled-icon',
                    handle: (currentIndex: InspectionWorkOrderModel) => {
                        that.withdrawID = currentIndex.procId;
                        that.$workOrderCommonUtil.queryDataRole(currentIndex.procId, ClearBarrierOrInspectEnum.inspection).then(flag => {
                            if (flag) {
                                that.withdrawWorkOrder();
                            }
                        });
                    }
                },
                {
                    // 待指派
                    text: that.InspectionLanguage.assign,
                    permissionCode: '06-1-1-5',
                    key: 'isShowAssignIcon',
                    className: 'fiLink-assigned',
                    disabledClassName: 'fiLink-assigned disabled-icon',
                    handle: (currentIndex: InspectionWorkOrderModel) => {
                        that.procId = currentIndex.procId;
                        that.$workOrderCommonUtil.queryDataRole(currentIndex.procId, ClearBarrierOrInspectEnum.inspection).then(flag => {
                            if (flag) {
                                that.getAssignData(currentIndex.deviceAreaCode ? currentIndex.deviceAreaCode : '');
                            }
                        });
                    }
                },
                {
                    // 查看巡检报告
                    text: that.InspectionLanguage.inspectReport,
                    permissionCode: '06-1-1-9',
                    className: 'fiLink-reports',
                    handle: (currentIndex: InspectionWorkOrderModel) => {
                        const id = currentIndex.procId;
                        that.$router.navigate([`/business/work-order/inspection/unfinished-detail/unfinished-inspectReport`],
                            {queryParams: {procId: id, status: WorkOrderPageTypeEnum.checkList}}).then();
                    }
                },
                { // 查看详情
                    text: that.InspectionLanguage.inspectionDetail,
                    permissionCode: '06-1-1-8',
                    className: 'fiLink-view-detail',
                    handle: (currentIndex: InspectionWorkOrderModel) => {
                        const id = currentIndex.procId;
                        that.$router.navigate([`/business/work-order/inspection/unfinished-detail/unfinishedView`],
                            {queryParams: {procId: id, status: WorkOrderPageTypeEnum.unfinishedView}}).then();
                    }
                },
                {
                    // 查看已完成巡检信息
                    text: that.InspectionLanguage.viewDetail,
                    permissionCode: '06-1-1-7',
                    className: 'fiLink-ref-order',
                    handle: (currentIndex: InspectionWorkOrderModel) => {
                        that.completedWorkOrderID = currentIndex.procId;
                        that.showCompleted(currentIndex);
                    }
                },
                {
                    // 转派
                    text: that.workOrderLanguage.transferOrder,
                    permissionCode: '06-1-1-12',
                    key: 'isShowTransfer',
                    className: 'fiLink-turnProcess-icon',
                    handle: (currentIndex: InspectionWorkOrderModel) => {
                        that.$workOrderCommonUtil.queryDataRole(currentIndex.procId, ClearBarrierOrInspectEnum.inspection).then(flag => {
                            if (flag) {
                                that.showInspectTransForm(currentIndex);
                            }
                        });
                    }
                },
                {  // 删除
                    text: that.InspectionLanguage.delete,
                    permissionCode: '06-1-1-3',
                    key: 'isShowDeleteIcon',
                    canDisabled: true,
                    needConfirm: true,
                    className: 'fiLink-delete red-icon',
                    disabledClassName: 'fiLink-delete disabled-red-icon',
                    handle: (currentIndex: InspectionWorkOrderModel) => {
                        const arr = [currentIndex.procId];
                        const data = new AreaDeviceParamModel();
                        data.procIdList = arr;
                        data.procType = ClearBarrierOrInspectEnum.inspection;
                        that.$inspectionWorkOrderService.deleteUnfinishedOrderByIds(data).subscribe((res: Result) => {
                            if (res.code === ResultCodeEnum.success) {
                                that.$message.success(that.InspectionLanguage.operateMsg.deleteSuccess);
                                // 删除跳第一页
                                that.queryCondition.pageCondition.pageNum = 1;
                                that.refreshData();
                                that.getCardStatistics();
                            } else {
                                that.$message.error(res.msg);
                            }
                        });
                    }
                },
            ],
            sort: (event: SortCondition) => {
                if (event.sortField === 'equipmentType') {
                    event.sortField = 'procRelatedEquipment.equipmentType';
                }
                if (event.sortField === 'deviceType') {
                    event.sortField = 'procRelatedDevices.deviceType';
                }
                that.queryCondition.sortCondition.sortField = event.sortField;
                that.queryCondition.sortCondition.sortRule = event.sortRule;
                that.refreshData();
            },
            handleSearch: (event: FilterCondition[]) => {
                if (event.length === 0) {
                    that.isReset = true;
                    that.filterObj.areaName = '';
                    FacilityForCommonUtil.setAreaNodesStatus(that.areaNodes || [], null);
                    that.selectUnitName = '';
                    FacilityForCommonUtil.setTreeNodesStatus(that.unitTreeNodes, []);
                    that.selectUserList = [];
                }
                that.queryCondition.pageCondition.pageNum = 1;
                that.queryCondition.filterConditions = event;
                that.refreshData();
            },
            handleSelect: (event) => {
              UnfinishedInspectionTableUtil.selectDataId = event.map(v => v.procId);
            },
            handleExport: (event: ListExportModel<InspectionWorkOrderModel[]>) => {
                that.exportParams.columnInfoList = event.columnInfoList;
                const params = ['status', 'inspectionStartTime', 'inspectionEndTime', 'cTime', 'expectedCompletedTime', 'equipmentType', 'deviceType'];
                that.exportParams.columnInfoList.forEach(item => {
                    if (params.indexOf(item.propertyName) > -1) {
                        item.isTranslation = 1;
                    }
                });
                that.exportParams.queryCondition = that.queryCondition;
                that.exportParams.excelType = event.excelType;
                if (UnfinishedInspectionTableUtil.selectDataId.length) {
                  const index = that.exportParams.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
                  if (index > -1) {
                    that.exportParams.queryCondition.filterConditions[index].filterValue = UnfinishedInspectionTableUtil.selectDataId;
                    that.exportParams.queryCondition.filterConditions[index].operator = OperatorEnum.in;
                  } else {
                    that.exportParams.queryCondition.filterConditions.push({filterField: '_id', filterValue: UnfinishedInspectionTableUtil.selectDataId, operator: OperatorEnum.in});
                  }
                } else {
                  const i = that.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
                  if (i > -1) {
                    that.queryCondition.filterConditions.splice(i, 1);
                    that.exportParams.queryCondition = that.queryCondition;
                  }
                }
                that.$inspectionWorkOrderService.unfinishedExport(that.exportParams).subscribe((result: ResultModel<string>) => {
                    if (result.code === ResultCodeEnum.success) {
                        that.$message.success(that.InspectionLanguage.operateMsg.exportSuccess);
                    } else {
                        that.$message.error(result.msg);
                    }
                });
            }
        };
        that.isShowTable = true;
    }

    /**
     * 初始化已完成巡检信息列表配置
     */
    public static seeInitTableConfig(that): void {
        that.seeTableConfig = {
            isDraggable: false,
            primaryKey: '06-1-1-1',
            isLoading: false,
            showSearchSwitch: true,
            showRowSelection: false,
            showSizeChanger: true,
            showSearchExport: false,
            notShowPrint: true,
            scroll: {x: '1600px', y: '600px'},
            columnConfig: [
                {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
                {// 巡检设施
                    title: that.InspectionLanguage.inspectionFacility, key: 'deviceName', width: 200,
                    searchable: true, configurable: true,
                    isShowSort: true, searchConfig: {type: 'input'}
                },
                {// 巡检结果
                    title: that.InspectionLanguage.inspectionResults, key: 'result', width: 200,
                    searchable: true, configurable: true, isShowSort: true,
                    searchConfig: {
                        type: 'select',
                        selectInfo: [
                            {label: that.InspectionLanguage.normal, value: IsSelectAllEnum.deny},  // 正常
                            {label: that.InspectionLanguage.abnormal, value: IsSelectAllEnum.right},   // 异常
                        ]
                    },
                },
                {// 异常详情
                    title: that.InspectionLanguage.exceptionallyDetailed, key: 'remark', width: 200,
                    searchable: true, configurable: true,
                    isShowSort: true, searchConfig: {type: 'input'}
                },
                {// 巡检时间
                    title: that.InspectionLanguage.inspectionTime, key: 'inspectionTime', width: 200,
                    pipe: 'date', searchConfig: {type: 'dateRang'},
                    searchable: true, configurable: true, isShowSort: true,
                },
                {// 责任人
                    title: that.InspectionLanguage.responsible, key: 'assignName', width: 200,
                    configurable: true, searchable: true, searchKey: 'assign',
                    searchConfig: {type: 'select', selectType: 'multiple', selectInfo: that.roleArray, renderTemplate: that.roleTemp}
                },
                {// 资源匹配情况
                    title: that.InspectionLanguage.matchingOfResources, key: 'resourceMatching', width: 200,
                    searchable: true, configurable: true,
                    searchConfig: {type: 'input'}
                },
                {// 关联图片
                    title: that.InspectionLanguage.relatedPictures, searchable: true,
                    searchConfig: {type: 'operate'}, width: 200, fixedStyle: {fixedRight: true, style: {right: '0px'}}
                },
            ],
            showPagination: true,
            bordered: false,
            showSearch: false,
            operation: [
                {
                    text: that.InspectionLanguage.viewDetail,
                    className: 'fiLink-view-photo',
                    handle: (currentIndex) => {
                        that.getPicUrlByAlarmIdAndDeviceId(currentIndex);
                    }
                },
            ],
            sort: (event: SortCondition) => {
                UnfinishedInspectionTableUtil.tableSortData(that, event);
            },
            handleSearch: (event: FilterCondition[]) => {
                that.finishQueryCondition.pageCondition.pageNum = 1;
                that.finishQueryCondition.filterConditions = event;
                that.refreshCompleteData();
            },
            openTableSearch: () => {
                that.getAllUser();
            },
        };
    }

    /**
     * 初始化进度已完成巡检信息列表配置
     */
    public static scheduleInitTableConfig(that): void {
        that.scheduleTableConfig = {
            isDraggable: false,
            primaryKey: '06-1-1-2',
            isLoading: false,
            showSearchSwitch: true,
            showRowSelection: false,
            showSizeChanger: true,
            showSearchExport: false,
            notShowPrint: true,
            scroll: {x: '1600px', y: '600px'},
            columnConfig: [
                {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
                {// 巡检设施
                    title: that.InspectionLanguage.inspectionFacility, key: 'deviceName', width: 200,
                    searchable: true, configurable: true,
                    isShowSort: true, searchConfig: {type: 'input'}
                },
                {// 巡检结果
                    title: that.InspectionLanguage.inspectionResults, key: 'result', width: 200,
                    searchable: true, configurable: true, isShowSort: true,
                    searchConfig: {
                        type: 'select',
                        selectInfo: [
                            {label: that.InspectionLanguage.normal, value: '0'},  // 正常
                            {label: that.InspectionLanguage.abnormal, value: '1'},   // 异常
                        ]
                    },
                },
                {// 异常详情
                    title: that.InspectionLanguage.exceptionallyDetailed, key: 'remark', width: 200,
                    searchable: true, configurable: true, isShowSort: true,
                    searchConfig: {type: 'input'}
                },
                {// 巡检时间
                    title: that.InspectionLanguage.inspectionTime, key: 'inspectionTime', width: 200,
                    pipe: 'date',
                    searchable: true, configurable: true, isShowSort: true,
                    searchConfig: {type: 'dateRang'}
                },
                {// 责任人refUserSearchTemp
                    title: that.InspectionLanguage.responsible, key: 'assignName', width: 200,
                    configurable: true, searchable: true, searchKey: 'assign',
                    /*searchConfig: {type: 'select', selectType: 'multiple', selectInfo: that.roleArray, renderTemplate: that.roleTemp}*/
                    searchConfig: {type: 'render', renderTemplate: that.refUserSearchTemp},
                },
                {// 资源匹配情况
                    title: that.InspectionLanguage.matchingOfResources, key: 'resourceMatching', width: 200,
                    searchable: true, configurable: true,
                    searchConfig: {type: 'input'}
                },
                {// 关联图片
                    title: that.InspectionLanguage.relatedPictures, searchable: true,
                    searchConfig: {type: 'operate'}, width: 200, fixedStyle: {fixedRight: true, style: {right: '0px'}}
                },
            ],
            showPagination: true,
            bordered: false,
            showSearch: false,
            operation: [
                {
                    text: that.InspectionLanguage.viewDetail,
                    className: 'fiLink-view-photo',
                    handle: (currentIndex: InspectionTaskModel) => {
                        that.getPicUrlByAlarmIdAndDeviceId(currentIndex);
                    }
                },
            ],
            sort: (event: SortCondition) => {
                UnfinishedInspectionTableUtil.tableSortData(that, event);
            },
            handleSearch: (event: FilterCondition[]) => {
                that.finishQueryCondition.pageCondition.pageNum = 1;
                that.finishQueryCondition.filterConditions = event;
                if (event.length === 0) {
                  that.selectRefUserList = [];
                }
                that.refreshCompleteData();
            }
        };
    }

  /**
   * 排序
   */
  public static tableSortData(that, event: SortCondition): void {
    if (event.sortField !== 'resourceMatching') {
      that.finishQueryCondition.sortCondition.sortField = `procRelatedDevices.${event.sortField}`;
    } else {
      that.finishQueryCondition.sortCondition.sortField = event.sortField;
    }
    that.finishQueryCondition.sortCondition.sortRule = event.sortRule;
    that.refreshCompleteData();
  }
}

