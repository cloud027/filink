import {ALARM_CURRENT_SERVER, DEVICE_SERVER, USER_SERVER, WORK_ORDER_SERVER} from '../../../../core-module/api-service/api-common.config';

export const WorkOrderRequestUrl  = {
  // 获取当前单位下责任人
  getUserListDepart: `${USER_SERVER}/user/queryHasUserInfo`,
  // 根据区域ID查询责任单位
  queryResponsibilityUnit: `${USER_SERVER}/department/queryAllDepartmentForPageSelection`,
  // 查询所有用户
  queryAllUserInfo: `${USER_SERVER}/user/queryAllUserInfo`,
  // 巡检模板列表
  getInspectTemplate: `${WORK_ORDER_SERVER}/inspectionTemplate/queryListTemplateByPage`,
  // 获取巡检项最大个数
  getInspectTotal: `${WORK_ORDER_SERVER}/inspectionTemplate/queryInspectionItemConfig`,
  // 新增巡检模板
  addInspectTemplate: `${WORK_ORDER_SERVER}/inspectionTemplate/insertTemplate`,
  // 获取模板信息
  getTemplateInfo: `${WORK_ORDER_SERVER}/inspectionTemplate/queryTemplateById`,
  // 编辑模板
  editInspectTemplate: `${WORK_ORDER_SERVER}/inspectionTemplate/updateInspectionTemplate`,
  // 校验模板名称唯一性
  checkInspectTemplate: `${WORK_ORDER_SERVER}/inspectionTemplate/queryTemplateExists`,
  // 删除模板
  deleteInspectTemplate: `${WORK_ORDER_SERVER}/inspectionTemplate/deleteInspectionTemplate`,
  // 选择模板
  selectInspectTemplate: `${WORK_ORDER_SERVER}/inspectionTemplate/queryInspectionTemplateForPageSelection`,
  // 导出巡检模板
  exportInspectionTemplate: `${WORK_ORDER_SERVER}/inspectionTemplate/exportInspectionTemplate`,
  // 获取历史销障工单列表
  getHistoryClearBarrierWorkOrderListAll: `${WORK_ORDER_SERVER}/repairOrder/queryListHistoryClearFailureByPage`,
  // 获取未完成销障工单列表
  getUnfinishedClearBarrierWorkOrderListAll: `${WORK_ORDER_SERVER}/repairOrder/queryListClearFailureProcessByPage`,
  // 获取未完成销障工单详情
  getUnfinishedClearBarrierWorkOrderDetail: `${WORK_ORDER_SERVER}/repairOrder/getClearFailureById`,
  // 获取未完成销障工单详情 2
  getUnfinishedWorkOrderDetail: `${WORK_ORDER_SERVER}/repairOrder/getClearFailureByIdForProcess`,
  // 历史详情
  getHistoryWorkOrderDetail: `${WORK_ORDER_SERVER}/repairOrder/getClearFailureByIdForComplete`,
  // 新增销障工单
  addClearBarrierWorkOrder: `${WORK_ORDER_SERVER}/repairOrder/addClearFailureProc`,
  // 修改销障工单
  updateClearBarrierWorkOrder: `${WORK_ORDER_SERVER}/repairOrder/updateClearFailureProcById`,
  // 销账工单列表待指派状态统计
  getAssignedClearBarrierWorkOrderStatistics: `${WORK_ORDER_SERVER}/repairOrder/queryCountClearFailureProcByAssigned`,
  // 销账工单列表待处理状态统计
  getPendingClearBarrierWorkOrderStatistics: `${WORK_ORDER_SERVER}/repairOrder/queryCountClearFailureProcByPending`,
  // 销账工单列表处理中状态统计
  getProcessingClearBarrierWorkOrderStatistics: `${WORK_ORDER_SERVER}/procStatistical/queryListProcOverviewGroupByProcStatus`,
  // 销账工单未完工列表状态总数统计
  getUnfinishedClearBarrierWorkOrderStatistics: `${WORK_ORDER_SERVER}/repairOrder/queryCountListprocConfirmProcStatus`,
  // 故障原因统计的销障工单信息
  getClearBarrierWorkOrderStatisticsByErrorReason: `${WORK_ORDER_SERVER}/repairOrder/queryRepairOrderCauseReasonCount`,
  // 处理方案统计的销障工单信息
  getClearBarrierWorkOrderStatisticsByProcessingScheme: `${WORK_ORDER_SERVER}/repairOrder/queryRepairOrderTreatmentPlanCount`,
  // 设施类型统计的销障工单信息
  getClearBarrierWorkOrderStatisticsByDeviceType: `${WORK_ORDER_SERVER}/repairOrder/queryRepairOrderDeviceCount`,
  // 工单状态统计的销障工单信息
  getClearBarrierWorkOrderStatisticsByStatus: `${WORK_ORDER_SERVER}/repairOrder/queryRepairOrderStatusPercentage`,
  // 销账工单历史列表总数统计
  getHistoryClearBarrierWorkOrderStatistics: `${WORK_ORDER_SERVER}/repairOrder/queryCountListProcHisProc`,
  // 获取销障工单详情
  getClearBarrierWorkOrderById: `${WORK_ORDER_SERVER}/repairOrder/getProcessByProcId`,
  // 删除销障工单
  deleteClearBarrierWorkOrder: `${WORK_ORDER_SERVER}/repairOrder/deleteProc`,
  // 退单
  sendBackClearBarrierWorkOrder: `${WORK_ORDER_SERVER}/repairOrder/chargeProc`,
  // 撤回工单
  revokeClearBarrierWorkOrder: `${WORK_ORDER_SERVER}/repairOperate/revokeProc`,
  // 指派工单
  assignClearBarrierWorkOrder: `${WORK_ORDER_SERVER}/repairOperate/assignProc`,
  // 退单确认
  singleBackConfirm: `${WORK_ORDER_SERVER}/repairOperate/checkSingleBack`,
  // 导出未完工销障工单
  exportUnfinishedClearBarrierWorkOrder: `${WORK_ORDER_SERVER}/repairOrder/exportClearFailureProcUnfinished`,
  // 导出历史销障工单
  exportHistoryClearBarrierWorkOrder: `${WORK_ORDER_SERVER}/repairOrder/exportClearFailureProcHistory`,
  // 退单重新生成
  refundGeneratedAgain: `${WORK_ORDER_SERVER}/repairOrder/regenerateClearFailureProc`,
  // 巡检工单 -------------------------------------------
  // 新增巡检任务列表
  getInspectionWorkOrderListAll: `${WORK_ORDER_SERVER}/inspectionTask/queryListInspectionTaskByPage`,
  // 新增巡检任务路径
  addInspectionWorkOrder: `${WORK_ORDER_SERVER}/inspectionTask/insertInspectionTask`,
  // 删除巡检任务
  deleteInspectionWorkOrder: `${WORK_ORDER_SERVER}/inspectionTask/deleteInspectionTaskByIds`,
  // 编辑巡检任务
  updateInspectionWorkOrder: `${WORK_ORDER_SERVER}/inspectionTask/updateInspectionTask`,
  // 查询巡检任务接口
  inquireInspectionWorkOrder: `${WORK_ORDER_SERVER}/inspectionTask/getInspectionTaskById`,
  // 启用巡检任务状态
  enableInspectionTasks: `${WORK_ORDER_SERVER}/inspectionTask/openInspectionTaskBatch`,
  // 停用巡检任务状态
  disableInspectionTasks: `${WORK_ORDER_SERVER}/inspectionTask/closeInspectionTaskBatch`,
  // 巡检任务关联工单
  associatedWorkOrder: `${WORK_ORDER_SERVER}/procInspection/queryListInspectionTaskRelationProcByPage`,
  // 巡检任务关联巡检设施
  inspectionFacility: `${WORK_ORDER_SERVER}/inspectionTask/inspectionTaskRelationDeviceList`,
  // 巡检任务导出接口
  exportInspectionTask: `${WORK_ORDER_SERVER}/inspectionTask/exportInspectionTask`,
  // 巡检任务名称校验接口
  queryInspectionTaskIsExists: `${WORK_ORDER_SERVER}/inspectionTask/queryInspectionTaskIsExists`,
  // 未完工巡检工单列表
  getInspectionWorkUnfinishedListAll: `${WORK_ORDER_SERVER}/inspectionOrder/queryListInspectionProcessByPage`,
  // 新增巡检工单
  addInspectionWorkUnfinished: `${WORK_ORDER_SERVER}/inspectionOrder/insertInspectionProc`,
  // 编辑巡检工单
  updateInspectionWorkUnfinished: `${WORK_ORDER_SERVER}/inspectionOrder/updateInspectionProc`,
  // 编辑巡检工单后台返回数据
  getUpdateInspectionWorkUnfinishedList: `${WORK_ORDER_SERVER}/inspectionOrder/getInspectionProcById`,
  // 删除未完成巡检工单
  deleteInspectionWorkUnfinished: `${WORK_ORDER_SERVER}/inspectionOrder/deleteProc`,
  // 已完成巡检信息列表
  getInspectionCompleteUnfinishedList: `${WORK_ORDER_SERVER}/inspectionOrder/queryListCompleteInspectionByPage`,
  // 巡检完工记录列表
  getInspectionWorkFinishedListAll: `${WORK_ORDER_SERVER}/inspectionOrder/queryListInspectionCompleteRecordByPage`,
  // 退单确认
  singleBackToConfirmUnfinished: `${WORK_ORDER_SERVER}/inspectionOperate/checkSingleBack`,
  // 指派
  assignedUnfinished: `${WORK_ORDER_SERVER}/inspectionOperate/assignProc`,
  // 重新生成
  inspectionWorkUnfinishedRegenerate: `${WORK_ORDER_SERVER}/inspectionOrder/regenerateInspectionProc`,
  // 未完工工单撤回
  unfinishedWorkOrderWithdrawal: `${WORK_ORDER_SERVER}/inspectionOperate/revokeProc`,
  // 未完工导出
  unfinishedExport: `${WORK_ORDER_SERVER}/inspectionOrder/exportListInspectionProcess`,
  // 完工记录导出接口
  completionRecordExport: `${WORK_ORDER_SERVER}/inspectionOrder/exportListInspectionComplete`,
  // 查询已巡检数量和未巡检数量
  queryProcInspectionByProcInspection: `${WORK_ORDER_SERVER}/inspectionOrder/queryListCompleteInspectionByPage`,
  // 获取任务详情内工单列表
  getTableList: `${WORK_ORDER_SERVER}/inspectionOrder/queryListInspectionTaskRelationProcByPage`,
  // 关联告警
  refAlarmInfo: `${ALARM_CURRENT_SERVER}/alarmCurrent/queryAlarmCurrentListByCondition`,
  // 详情
  getFinishedDetail: `${WORK_ORDER_SERVER}/inspectionOrder/getInspectionProcByIdForComplete`,
  // checklist 查询设施
  queryDeviceList: `${WORK_ORDER_SERVER}/inspectionOrder/queryInspectionCheckList`,
  // checklist 查询设备
  queryEquipmentList: `${WORK_ORDER_SERVER}/inspectionOrder/queryInspectionItemByProcId`,
  // 未完工详情
  getUnfinishedDetail: `${WORK_ORDER_SERVER}/inspectionOrder/getInspectionProcByIdForProcess`,
  // 巡检任务详情
  getInspectDetailDetail: `${WORK_ORDER_SERVER}/inspectionTask/getInspectionTaskDetailById`,
  // 巡检工单名称唯一性校验
  checkInspectionOrderName: `${WORK_ORDER_SERVER}/inspectionOrder/queryInspectionNameIsExists`,
  // 销账工单名称唯一性校验
  checkClearName: `${WORK_ORDER_SERVER}/repairOrder/queryTitleIsExists`,
  // 巡检任务详情设施列表
  inspectionDeviceList: `${WORK_ORDER_SERVER}/inspectionTask/queryInspectionTaskDeviceByCondition`,
  // 查询巡检工单设施列表
  inspectionDeviceObjectList: `${WORK_ORDER_SERVER}/inspectionTaskObject/findDeviceIdListByInspectionTaskId`,
  // 未完工销账工单表格卡片统计
  clearTableCardStatic: `${WORK_ORDER_SERVER}/repairOrder/queryRepairOrderStatusCount`,
  // 销账工单列表今日新增统计
  getIncreaseClearBarrierWorkOrderStatistics: `${WORK_ORDER_SERVER}/repairOrder/queryRepairOrderTodayCount`,
  // 巡检今日新增
  inspectToday: `${WORK_ORDER_SERVER}/inspectionOrder/queryInspectionTodayCount`,
  // 巡检状态统计
  inspectStatusTotal: `${WORK_ORDER_SERVER}/inspectionOrder/queryInspectionStatusCount`,
  // 巡检工单设施类型统计
  inspectDeviceType: `${WORK_ORDER_SERVER}/inspectionOrder/queryInspectionDeviceCount`,
  //  巡检工单状态百分比
  inspectStatusStatistics: `${WORK_ORDER_SERVER}/inspectionOrder/queryInspectionStatusPercentage`,
  // 销障工单获取转派用户
  getClearBarrierUserList: `${WORK_ORDER_SERVER}/repairOperate/getTurnUserList`,
  // 销障工单转派
  getClearBarrierTrans: `${WORK_ORDER_SERVER}/repairOperate/turnUser`,
  // 巡检工单获取转派用户
  getInspectUserList: `${WORK_ORDER_SERVER}/inspectionOperate/getTurnUserList`,
  // 巡检工单转派
  getInspectTrans: `${WORK_ORDER_SERVER}/inspectionOperate/turnUser`,
  // 现场处理列表
  siteHandleList: `${WORK_ORDER_SERVER}/repairOrder/queryHistoryRepairType`,
  // 任务数据校验
  checkTaskDataRoles: `${WORK_ORDER_SERVER}/inspectionTask/inspectionTaskPermission`,
  // 工单数据校验
  checkDataRoles: `${WORK_ORDER_SERVER}/order/orderPermission`,
  // 设施服务
  // 查询图片
  queryImage: `${DEVICE_SERVER}/picRelationInfo/getPicDetail`,
  // 查询区域下所有的设施列表
  queryDeviceByArea: `${DEVICE_SERVER}/deviceInfo/deviceListByPage`,
  // 查询巡检对象信息
  inspectionObjectInfo: `${DEVICE_SERVER}/equipmentInfo/queryDeviceAndEquipmentInfo`,
  // 查询设施下的设备列表
  queryEquipmentByDevice: `${DEVICE_SERVER}/equipmentInfo/equipmentListByPage`,
  // 根据设施id查询挂载位置
  findMountPositionById: `${DEVICE_SERVER}/poleInfo/findMountPositionById`,
  // 告警确认工单-----------------------
  // 未完工告警确认工单列表
  unfinishedAlarmConfirm: `${WORK_ORDER_SERVER}/procConfirm/listUnfinishedConfirmProcessByPage`,
  // 新增告警确认工单
  addAlarmConfirmOrder: `${WORK_ORDER_SERVER}/procConfirm/addUnfinishedConfirmProc`,
  // 编辑告警确认工单
  editAlarmConfirmOrder: `${WORK_ORDER_SERVER}/procConfirm/updateUnfinishedConfirmByProcId`,
  // 未完工告警确认工单根据id查询详情
  getDetailById: `${WORK_ORDER_SERVER}/procConfirm/getUnfinishedConfirmById`,
  // 删除告警确认工单
  deleteAlarmConfirmOrder: `${WORK_ORDER_SERVER}/procConfirm/deleteProc`,
  // 未完工告警确认工单导出
  exportAlarmOrder: `${WORK_ORDER_SERVER}/procConfirm/exportProcUnfinishedConfirm`,
  // 告警确认工单指派
  assignedAlarmOrder: `${WORK_ORDER_SERVER}/procConfirmOperate/assignProc`,
  // 告警确认工单撤回
  backOrder: `${WORK_ORDER_SERVER}/procConfirmOperate/revokeProc`,
  // 告警确认工单退单
  sendBackAlarmWorkOrder: `${WORK_ORDER_SERVER}/procConfirmOperate/checkSingleBack`,
  // 获取转派用户
  getTurnUser: `${WORK_ORDER_SERVER}/procConfirmOperate/getTurnUserList`,
  // 告警确认工单转派
  turnAlarmOrder: `${WORK_ORDER_SERVER}/procConfirmOperate/turnUser`,
  // 告警确认工单重新生成
  regenerateAlarmOrder: `${WORK_ORDER_SERVER}/procConfirm/regenerateProcConfirm`,
  // 历史告警确认工单列表查询
  finishedAlarmConfirmOrder: `${WORK_ORDER_SERVER}/procConfirm/queryListHistoryConfirmByPage`,
  // 历史告警工单根据id获取详情
  getHistoryDetailById: `${WORK_ORDER_SERVER}/procConfirm/getHistoryConfirmById`,
  // 告警工单名称唯一性校验
  checkAlarmOrderName: `${WORK_ORDER_SERVER}/procConfirm/queryTitleIsExists`,
  // 未完工告警确认工单卡片统计
  alarmOrderCardStatistics: `${WORK_ORDER_SERVER}/procConfirm/queryUnfinishedProcStatusCount`,
  // 告警卡片统计今日新增
  alarmOrderCardTodayAdd: `${WORK_ORDER_SERVER}/procConfirm/queryTotalUnfinishedProcCount`,
  // 历史告警工单告警类别统计
  historyAlarmOrderChart: `${WORK_ORDER_SERVER}/procConfirm/queryHistoryConfirmAlarmTypeCount`,
  // 历史告警工单工单状态统计
  historyOrderStatusChart: `${WORK_ORDER_SERVER}/procConfirm/queryHistoryConfirmProcStatusCount`,
  // 历史告警确认工单导出
  exportAlarmHistoryOrder: `${WORK_ORDER_SERVER}/procConfirm/exportHistoryProcConfirm`,
  // 历史告警确认工单设备类型统计
  alarmOrderEquipment: `${WORK_ORDER_SERVER}/procConfirm/queryHistoryProcConfirmEquipmentCount`,
  // 安装工单 --------------------------------------
  // 未完工安装工单列表
  unfinishedInstallOrderList: `${WORK_ORDER_SERVER}/procInstall/queryListInstallProcessByPage`,
  // 根据id查询详情
  queryInstallById: `${WORK_ORDER_SERVER}/procInstall/getInstallById`,
  // 新增安装工单
  addInstallOrder: `${WORK_ORDER_SERVER}/procInstall/addInstallProc`,
  // 编辑安装工单
  editInstallOrder: `${WORK_ORDER_SERVER}/procInstall/updateInstallByProcId`,
  // 删除安装工单
  deleteInstallOrder: `${WORK_ORDER_SERVER}/procInstall/deleteInstallByProcId`,
  // 安装工单指派
  assignInstallOrder: `${WORK_ORDER_SERVER}/procInstall/assignProc`,
  // 安装工单撤回
  backInstallOrder: `${WORK_ORDER_SERVER}/procInstall/revokeProc`,
  // 获取转派用户
  queryTurnUser: `${WORK_ORDER_SERVER}/procInstall/getTurnUserList`,
  // 安装工单转派
  turnInstallOrder: `${WORK_ORDER_SERVER}/procInstall/turnUser`,
  // 安装工单退单确认
  confirmChargeback: `${WORK_ORDER_SERVER}/procInstall/checkSingleBack`,
  // 安装工单重新生成
  regenerateInstallOrder: `${WORK_ORDER_SERVER}/procInstall/regenerateInstallProc`,
  // 安装工单名称唯一性校验
  checkInstallOrderName: `${WORK_ORDER_SERVER}/procInstall/queryTitleIsExists`,
  // 未完工安装工单状态统计
  unfinishedInstallOrder: `${WORK_ORDER_SERVER}/procInstall/queryInsatllOrderStatusCount`,
  // 未完工安装工单今日新增
  installOrder: `${WORK_ORDER_SERVER}/procInstall/queryInstallOrderTodayCount`,
  // 未完工安装工导出
  exportInstallOrder: `${WORK_ORDER_SERVER}/procInstall/exportProcInstall`,
  // 历史安装工单列表查询
  historyInstallOrder: `${WORK_ORDER_SERVER}/procInstallHistory/queryListInstallHistoryByPage`,
  // 根据id查询历史安装工单的信息
  historyOrderDetail: `${WORK_ORDER_SERVER}/procInstallHistory/getInstallHistoryById`,
  // 历史安装工单状态统计百分比
  historyOrderStatus: `${WORK_ORDER_SERVER}/procInstallHistory/queryInstallOrderStatusPercentage`,
  // 设备类型统计的安装工单信息统计
  historyEquipment: `${WORK_ORDER_SERVER}/procInstallHistory/queryInstallOrderEquipmentCount`,
  // 历史安装工导出
  exportHistoryInstallOrder: `${WORK_ORDER_SERVER}/procInstallHistory/exportProcInstallHistory`,
  // 安装工单查询设备名称是否已经存在
  equipmentNameIsExist: `${DEVICE_SERVER}/equipmentInfo/queryEquipmentNameIsExist`,
  // 安装工单查询资产编码是否存在
  equipmentCodeIsExist: `${DEVICE_SERVER}/equipmentInfo/queryEquipmentCodeIsExist`,
  // 增加设备
  addEquipment: `${DEVICE_SERVER}/equipmentInfo/addEquipmentForEquipmentParam`,
  // 修改设备
  updateEquipment: `${DEVICE_SERVER}/equipmentInfo/updateEquipment`,
  // 查询设备列表
  queryEquipList: `${DEVICE_SERVER}/equipmentInfo/equipmentListByPageForListPage`,

  // --------------------------------------------拆除工单------------------------------
  /** 获取拆除工单列表数据 */
  queryDismantleBarrierListURL: `${WORK_ORDER_SERVER}/removeOrder/queryUnfinishedRemoveProcByPage`,
  /** 拆除工单 导出 */
  exportDismantleWorkOrderURL: `${WORK_ORDER_SERVER}/removeOrder/exportRemoveProcUnfinished`,
  /** 获取 拆除工单 今日新增工单 */
  getInsertDismantleBarrierCountURL: `${WORK_ORDER_SERVER}/removeOrder/queryRemoveOrderTodayCount`,
  /** 获取 拆除工单 获取工单状态数量 */
  queryDismantleBarrierCountByStatusURL: `${WORK_ORDER_SERVER}/removeOrder/queryRemoveProcCountGroupByStatus`,
  /** 拆除工单名称唯一性校验 */
  checkDismantleBarrierNameURL: `${WORK_ORDER_SERVER}/removeOrder/queryTitleIsExists`,
  /** 根据设施名称 获取 拆除点位列表数据 */
  dismantlePointListURL: `${DEVICE_SERVER}/equipmentInfo/getMountedEquipmentInfoByPage`,
  /** 新增 拆除工单 */
  insertDismantleBarrierURL: `${WORK_ORDER_SERVER}/removeOrder/addRemoveProc`,
  /** 修改 拆除工单 */
  updateDismantleBarrierURL: `${WORK_ORDER_SERVER}/removeOrder/updateRemoveProcById`,
  /** 保存 选择的设备id */
  setSelectedEquipmentURL: `${DEVICE_SERVER}/equipmentInfo/updateEquipmentIsRemoveOrderByIds`,
  /** 重新生成历史工单 拆除工单 */
  refundDismantleGeneratedAgainURL: `${WORK_ORDER_SERVER}/removeOrder/regenerateRemoveProc`,
  /** 删除 拆除工单 */
  deleteDismantleWorkOrderURL: `${WORK_ORDER_SERVER}/removeOrder/deleteProc`,
  /** 查询 拆除工单 未完成详情 */
  getDismantleFailureByIdForProcessURL: `${WORK_ORDER_SERVER}/removeOrder/getRemoveProcById`,
  /** 查询 拆除工单 责任单位 */
  queryDismantleUnitURL: `${DEVICE_SERVER}/areaInfo/listDepartmentByUserId`,
  /** 拆除工单 指派 */
  assignDismantleBarrierURL: `${WORK_ORDER_SERVER}/removeOperate/assignProc`,
  /** 拆除工单 撤回 */
  revokeDismatleBarrierURL: `${WORK_ORDER_SERVER}/removeOperate/revokeProc`,
  /** 拆除工单 退单确认 */
  checkDismantleSingleBackURL: `${WORK_ORDER_SERVER}/removeOperate/checkSingleBack`,
  /** 历史拆除工单 列表 */
  removeHistoryWorkOrderListURL: `${WORK_ORDER_SERVER}/removeOrder/queryHistoryRemoveProcByPage`,
  /** 历史拆除工单 导出 */
  exportDismantleHistoryWorkOrderURL: `${WORK_ORDER_SERVER}/removeOrder/exportRemoveProcHistory`,
  // 拆除工单 获取转派用户
  getRemoveBarrierUserList: `${WORK_ORDER_SERVER}/removeOperate/getTurnUserList`,
  // 拆除工单 转派
  getRemoveBarrierTrans: `${WORK_ORDER_SERVER}/removeOperate/turnUser`,

  // new设施列表
  deviceListByPageForListPage: `${DEVICE_SERVER}/deviceInfo/deviceListByPageForListPage`,
  //设施列表 历史拆除工单详情
  deviceListByPageForListPageNew: `${DEVICE_SERVER}/deviceInfo/deviceListByPageForListPageNew`,
  // 获取设备列表
  equipmentListByPageForListPage: `${DEVICE_SERVER}/equipmentInfo/equipmentListByPageForListPage`,
  // 获取设备列表  历史拆除工单
  equipmentListByPageForListPageNew: `${DEVICE_SERVER}/equipmentInfo/equipmentListByPageForListPageNew`,
  // 获取未完成和历史拆除设备工单
  deviceListByPageForListPageNewWO: `${DEVICE_SERVER}/deviceInfo/deviceListByPageForListPageNewWO`,
  // 获取未完成和历史设施拆除工单
  listEquipmentForListPageNewWO: `${DEVICE_SERVER}/equipmentInfo/listEquipmentForListPageNewWO`,

  /** 历史拆除工单头部的echarts */
  queryRemoveOrderDeviceCountURL: `${WORK_ORDER_SERVER}/removeOrder/queryRemoveOrderDeviceCount`,
  queryRemoveOrderEquipmentCountURL: `${WORK_ORDER_SERVER}/removeOrder/queryRemoveOrderEquipmentCount`,
  queryRemoveOrderStatusPercentageURL: `${WORK_ORDER_SERVER}/removeOrder/queryRemoveOrderStatusPercentage`,
  // --------------------------------------------拆除工单------------------------------
};
