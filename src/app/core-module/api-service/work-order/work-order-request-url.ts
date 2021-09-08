import {DEVICE_SERVER, USER_SERVER, WORK_ORDER_SERVER, ALARM_SET_SERVER} from '../api-common.config';

/**
 * 巡检工单接口
 */
export const WorkOrderUrl = {
  // 查询责任单位下是否有工单
  existsWorkOrderForDeptIds: `${WORK_ORDER_SERVER}/repairOrder/existsProcForDeptIdsAndAreaId`,
  // 工单数据校验
  checkDataRoles: `${WORK_ORDER_SERVER}/order/orderPermission`,
  // 新增销障工单
  addClearBarrierWorkOrder: `${WORK_ORDER_SERVER}/repairOrder/addClearFailureProc`,
  // 销账工单名称唯一性校验
  checkClearName: `${WORK_ORDER_SERVER}/repairOrder/queryTitleIsExists`,
  // 新增告警转工单名称唯一性校验
  orderNameIsExist: `${ALARM_SET_SERVER}/alarmOrderRule/orderNameIsExist`,
  // 查询巡检工单
  queryInspectionList: `${WORK_ORDER_SERVER}/inspectionOrder/queryInspectionListByIdForDevice`,
  // 查询销障列表
  queryClearList: `${WORK_ORDER_SERVER}/repairOrder/queryClearListByEquipmentIdForDevice`,
  // 查询设施拆除工单列表
  queryDeviceRemoveList: `${WORK_ORDER_SERVER}/removeOrder/queryRemoveListByDeviceId`,
  // 查询设备拆除工单列表
  queryEquipmentRemoveList: `${WORK_ORDER_SERVER}/removeOrder/queryRemoveListByEquipmentId`,

  // 告警转工单责任单位查询
  alarmQueryResponsibilityUnit: `${DEVICE_SERVER}/areaInfo/getCommonDeptByAreaId`,

  // 查询所有角色(无分页)
  queryUserAllRoles: `${USER_SERVER}/role/queryAllRoles`,
  // 获取当前单位下责任人
  getUserListByDepart: `${USER_SERVER}/user/queryUserByField`,
  // 未完工安装工单列表
  unfinishedInstallOrderList: `${WORK_ORDER_SERVER}/procInstall/queryListInstallProcessByPage`,
  // 未完工告警确认工单列表
  unfinishedAlarmConfirm: `${WORK_ORDER_SERVER}/procConfirm/listUnfinishedConfirmProcessByPage`,
  // 安装工单未完工及历史一通查询
  installListData: `${WORK_ORDER_SERVER}/procInstall/queryInstallListForHome`,
  // 告警确认工单未完工及历史一通查询
  alarmListData: `${WORK_ORDER_SERVER}/procConfirm/queryProcConfirmListForHome`,
};
