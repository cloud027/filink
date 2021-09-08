import {DEVICE_SERVER, WORK_ORDER_SERVER, ALARM_CURRENT_SERVER, LOCK_SERVER, LOG_SERVER, SMART_SERVER} from '../api-common.config';

const WORK_ORDER_STATISTICAL = `${WORK_ORDER_SERVER}/procStatistical`;
const LOG_STATISTICAL = `${LOG_SERVER}/log`;
const LOG_STATISTICAL_TEMPLATE = `${LOG_SERVER}/logTemplate`;

export const STATISTICAL_URL = {
  // 设施统计相关
  // 设施数量统计
  queryDeviceNumber: `${DEVICE_SERVER}/statistics/queryDeviceCount`,
  // 设施状态统计
  queryDeviceStatus: `${DEVICE_SERVER}/statistics/queryDeviceStatusCount`,
  // 设施部署状态统计
  queryDeviceDeployStatus: `${DEVICE_SERVER}/statistics/queryDeployStatusCount`,
  // 设施传感值统计 statistics/queryDeviceSensorValues
  queryDeviceSensorValues: `${LOCK_SERVER}/statistics/queryDeviceSensorValues`,
  // 查询设备传感值统计
  queryEquipmentSensorValues: `${LOCK_SERVER}/statistics/queryDeviceSensorValuesByEquipmentId`,
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
  // odn设施资源统计
  // 查询区域下的Odn设施
  queryDeviceDtoForPageSelection: `${DEVICE_SERVER}/deviceInfo/queryDeviceDtoForPageSelection`,
  // 跳纤侧端口统计
  jumpFiberPortStatistics: `filink-rfid-server/odnFacilityResources/jumpFiberPortStatistics`,
  exportJumpFiberPortStatistics: `filink-rfid-server/odnFacilityResources/exportJumpFiberPortStatistics`,
  // 单设备端口状态统计
  devicePortStatistics: `filink-rfid-server/odnFacilityResources/devicePortStatistics`,
  // 熔接统计
  meltFiberPortStatistics: `filink-rfid-server/odnFacilityResources/meltFiberPortStatistics`,
  exportMeltFiberPortStatistics: `filink-rfid-server/odnFacilityResources/exportMeltFiberPortStatistics`,
  // 盘统计
  discPortStatistics: `filink-rfid-server/odnFacilityResources/discPortStatistics`,
  exportDiscPortStatistics: `filink-rfid-server/odnFacilityResources/exportDiscPortStatistics`,
  // 框统计
  framePortStatistics: `filink-rfid-server/odnFacilityResources/framePortStatistics`,
  exportFramePortStatistics: `filink-rfid-server/odnFacilityResources/exportFramePortStatistics`,
  // 查询设施的盘、框信息
  queryTemplateTop: `filink-rfid-server/template/queryTemplateTop`,
  // 柜内调接关系统计
  jumpConnectionInCabinet: `filink-rfid-server/jumpConnection/jumpConnectionInCabinet`,
  exportJumpConnectionInCabinet: `filink-rfid-server/jumpConnection/exportJumpConnectionInCabinet`,
  // 柜间调接关系统计
  jumpConnectionOutCabinet: `filink-rfid-server/jumpConnection/jumpConnectionOutCabinet`,
  exportJumpConnectionOutCabinet: `filink-rfid-server/jumpConnection/exportJumpConnectionOutCabinet`,
  // 光缆统计
  opticalFiber: `filink-rfid-server/fiberOpticsAndCore/opticalFiber`,
  exportOpticalFiber: `filink-rfid-server/fiberOpticsAndCore/exportOpticalFiber`,
  opticalFiberSection: `filink-rfid-server/fiberOpticsAndCore/opticalFiberSection`,
  exportOpticalFiberSection: `filink-rfid-server/fiberOpticsAndCore/exportOpticalFiberSection`,
  coreStatistics: `filink-rfid-server/fiberOpticsAndCore/coreStatistics`,
  exportCoreStatistics: `filink-rfid-server/fiberOpticsAndCore/exportCoreStatistics`,
  // 设施数量导出
  exportDeviceCount: `${DEVICE_SERVER}/statistics/exportDeviceCount`,
  // 导出设施状态统计数量
  exportDeviceStatusCount: `${DEVICE_SERVER}/statistics/exportDeviceStatusCount`,
  // 导出部署状态统计数量
  exportDeployStatusCount: `${DEVICE_SERVER}/statistics/exportDeployStatusCount`
};


//  工单统计相关
// 工单状态统计
export const SALES_ORDER_STATUS = `${WORK_ORDER_STATISTICAL}/queryListProcGroupByProcStatus`;

// 工单处理方案统计
export const SALES_ORDER_PROCESSING = `${WORK_ORDER_STATISTICAL}/queryListProcGroupByProcProcessingScheme`;

// 工单故障原因统计
export const SALES_ORDER_FAILURE = `${WORK_ORDER_STATISTICAL}/queryListProcGroupByErrorReason`;

// 工单设施类型统计
export const WORK_ORDER_DEVICE_TYPE = `${WORK_ORDER_STATISTICAL}/queryListProcGroupByDeviceType`;

// 工单区域工单比统计
export const SALES_ORDER_AREA_PERCENT = `${WORK_ORDER_STATISTICAL}/queryListProcGroupByAreaPercent`;

// 工单处理单位统计
export const SALES_ORDER_UNITS = `${WORK_ORDER_STATISTICAL}/queryDeptListGroupByAccountabilityDept`;

// 工单增量统计
export const WORK_ORDER_INCREMENT = `${WORK_ORDER_STATISTICAL}/queryProcAddListCountGroupByDay`;


// 日志统计相关
// 日志统计模板列表
export const LOG_STATISTICAL_TEMPLATE_LIST = `${LOG_STATISTICAL_TEMPLATE}/queryList`;

// 日志统计模板id查询
export const LOG_STATISTICAL_TEMPLATE_BY_ID = `${LOG_STATISTICAL_TEMPLATE}/query`;

// 新增日志统计模板
export const LOG_STATISTICAL_TEMPLATE_INSERT = `${LOG_STATISTICAL_TEMPLATE}/insert`;

// 修改日志统计模板
export const LOG_STATISTICAL_TEMPLATE_UPDATE = `${LOG_STATISTICAL_TEMPLATE}/update`;

// 删除日志统计模板
export const LOG_STATISTICAL_TEMPLATE_DELETE = `${LOG_STATISTICAL_TEMPLATE}/delete`;

// 日志类型统计
export const LOG_STATISTICAL_BY_LOG_TYPE = `${LOG_STATISTICAL}/countByLogType`;

// 操作类型统计
export const LOG_STATISTICAL_BY_OPERATE_TYPE = `${LOG_STATISTICAL}/countByOperateType`;

// 危险级别统计
export const LOG_STATISTICAL_BY_SECURITY_TYPE = `${LOG_STATISTICAL}/countBySecurityType`;


// 工单统计列表导出相关
// 销障工单设施类型导出
export const CLEAR_BARRIER_DEVICE_TYPE_EXPORT = `${WORK_ORDER_STATISTICAL}/procClearDeviceTypeStatisticalExport`;

// 销障工单状态导出
export const CLEAR_BARRIER_STATUS_EXPORT = `${WORK_ORDER_STATISTICAL}/procClearStatusStatisticalExport`;

// 销障工单处理方案导出
export const CLEAR_BARRIER_PROCESSING_EXPORT = `${WORK_ORDER_STATISTICAL}/procClearProcessingSchemeStatisticalExport`;

// 销障工单故障原因导出
export const CLEAR_BARRIER_FAILURE_EXPORT = `${WORK_ORDER_STATISTICAL}/procClearErrorReasonStatisticalExport`;


// 销障工单区域比导出
export const CLEAR_BARRIER_AREA_PERCENT_EXPORT = `${WORK_ORDER_STATISTICAL}/procClearAreaPercentStatisticalExport`;


// 巡检工单设施类型导出
export const INSPECTION_DEVICE_TYPE_EXPORT = `${WORK_ORDER_STATISTICAL}/procInspectionDeviceTypeStatisticalExport`;

// 巡检工单状态导出
export const INSPECTION_STATUS_EXPORT = `${WORK_ORDER_STATISTICAL}/procInspectionStatusStatisticalExport`;

// 巡检工单区域比导出
export const INSPECTION_AREA_PERCENT_EXPORT = `${WORK_ORDER_STATISTICAL}/procInspectionAreaPercentStatisticalExport`;


// 拆除工单设施类型导出
export const DISMANTLE_DEVICE_TYPE_EXPORT = `${WORK_ORDER_STATISTICAL}/dismantleProcInspectionDeviceTypeStatisticalExport`;

// 拆除工单状态导出
export const DISMANTLE_STATUS_EXPORT = `${WORK_ORDER_STATISTICAL}/dismantleProcInspectionStatusStatisticalExport`;

// 拆除工单区域比导出
export const DISMANTLE_AREA_PERCENT_EXPORT = `${WORK_ORDER_STATISTICAL}/dismantleProcInspectionAreaPercentStatisticalExport`;


// 日志统计导出相关
// 日志类型导出
export const LOG_TYPE_EXPORT = `${LOG_STATISTICAL}/exportLogType`;

// 操作类型导出
export const OPERATE_TYPE_EXPORT = `${LOG_STATISTICAL}/exportOperateType`;

// 危险级别导出
export const SECURITY_LEVEL_EXPORT = `${LOG_STATISTICAL}/exportSecurityLevel`;

// todo 上面要删除
export const STATISTICAL_REQUEST_URL = {
  // 获取光缆段列表
  opticCableSectionById: `${SMART_SERVER}/opticCableSectionInfo/opticCableSectionById`,
};
