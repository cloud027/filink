import {ALARM_CURRENT_SERVER, DEVICE_SERVER, TROUBLE_SERVER, WORK_ORDER_SERVER} from '../../../../core-module/api-service/api-common.config';
export const TopNUrl = {
  // topN统计相关
  // 设施传感值Top统计
  queryDeviceSensorTopNum: `${DEVICE_SERVER}/statistics/queryDeviceSensorTopNum`,
  // 根据Id查询设施详情
  getDeviceByIds: `${DEVICE_SERVER}/deviceInfo/getDeviceByIds`,
  // 工单Top统计
  queryTopListDeviceCountGroupByDevice: `${WORK_ORDER_SERVER}/procStatistical/queryTopListDeviceCountGroupByDevice`,
  // 工单topN统计列表导出
  procClearTopListStatisticalExport: `${WORK_ORDER_SERVER}/procStatistical/procClearTopListStatisticalExport`,
  // 告警top统计
  queryAlarmTop: `${ALARM_CURRENT_SERVER}/alarmStatistics/queryAlarmNameGroup`,
  // 告警列表导出
  exportDeviceTop: `${ALARM_CURRENT_SERVER}/alarmCurrent/exportDeviceTop`,
  // 开锁次数TopN统计
  queryUnlockingTopNum: `${DEVICE_SERVER}/statistics/queryUnlockingTopNum`,
  // 开锁次数topn统计列表导出
  exportUnlockingTopNum: `${DEVICE_SERVER}/statistics/exportUnlockingTopNum`,
  // 传感器值列表导出
  exportDeviceSensorTopNum: `${DEVICE_SERVER}/statistics/exportDeviceSensorTopNum`,
  // odn设施TopN统计
  queryPortTopN: `${DEVICE_SERVER}/portStatistics/queryPortTopN`,
  // odn topN导出
  exportPortTopNumber: `filink-rfid-server/odnFacilityResources/exportPortTopNumber`,
  // // odn设施资源统计
  // // 查询区域下的Odn设施
  // queryDeviceDtoForPageSelection: `${DEVICE_SERVER}/deviceInfo/queryDeviceDtoForPageSelection`,
  // // 跳纤侧端口统计
  // jumpFiberPortStatistics: `filink-rfid-server/odnFacilityResources/jumpFiberPortStatistics`,
  // exportJumpFiberPortStatistics: `filink-rfid-server/odnFacilityResources/exportJumpFiberPortStatistics`,
  // // 单设备端口状态统计
  // devicePortStatistics: `filink-rfid-server/odnFacilityResources/devicePortStatistics`,
  // // 熔接统计
  // meltFiberPortStatistics: `filink-rfid-server/odnFacilityResources/meltFiberPortStatistics`,
  // exportMeltFiberPortStatistics: `filink-rfid-server/odnFacilityResources/exportMeltFiberPortStatistics`,
  // // 盘统计
  // discPortStatistics: `filink-rfid-server/odnFacilityResources/discPortStatistics`,
  // exportDiscPortStatistics: `filink-rfid-server/odnFacilityResources/exportDiscPortStatistics`,
  // // 框统计
  // framePortStatistics: `filink-rfid-server/odnFacilityResources/framePortStatistics`,
  // exportFramePortStatistics: `filink-rfid-server/odnFacilityResources/exportFramePortStatistics`,
  // // 查询设施的盘、框信息
  // queryTemplateTop: `filink-rfid-server/template/queryTemplateTop`,
  // // 柜内调接关系统计
  // jumpConnectionInCabinet: `filink-rfid-server/jumpConnection/jumpConnectionInCabinet`,
  // exportJumpConnectionInCabinet: `filink-rfid-server/jumpConnection/exportJumpConnectionInCabinet`,
  // // 柜间调接关系统计
  // jumpConnectionOutCabinet: `filink-rfid-server/jumpConnection/jumpConnectionOutCabinet`,
  // exportJumpConnectionOutCabinet: `filink-rfid-server/jumpConnection/exportJumpConnectionOutCabinet`,
  // // 光缆统计
  // opticalFiber: `filink-rfid-server/fiberOpticsAndCore/opticalFiber`,
  // exportOpticalFiber: `filink-rfid-server/fiberOpticsAndCore/exportOpticalFiber`,
  // opticalFiberSection: `filink-rfid-server/fiberOpticsAndCore/opticalFiberSection`,
  // exportOpticalFiberSection: `filink-rfid-server/fiberOpticsAndCore/exportOpticalFiberSection`,
  // coreStatistics: `filink-rfid-server/fiberOpticsAndCore/coreStatistics`,
  // exportCoreStatistics: `filink-rfid-server/fiberOpticsAndCore/exportCoreStatistics`,
  // 故障类型
   queryTroubleType: `${TROUBLE_SERVER}/trouble/queryTroubleTypeList`,
  // TopN 故障次数统计
  queryTroubleTimes: `${TROUBLE_SERVER}/trouble/queryTopListDeviceOrEquipmentCount`,
  // 使用设备 id获取设备
  queryEquipById: `${DEVICE_SERVER}/equipmentInfo/getEquipmentByIds`,
  // 故障次数导出设施
  exportTroubleDevice: `${TROUBLE_SERVER}/troubleStatistics/topDeviceListStatisticalExport`,
  // 故障次数导出设备
  exportTroubleEquipment: `${TROUBLE_SERVER}/troubleStatistics/topEquipmentDeviceListStatisticalExport`,
  // 工单设备导出
  exportOrderEquipment: `${WORK_ORDER_SERVER}/procStatistical/procClearTopListStatisticalEquipmentExport`,
};
