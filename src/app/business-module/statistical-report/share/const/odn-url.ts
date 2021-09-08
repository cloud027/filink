import {DEVICE_SERVER} from '../../../../core-module/api-service/api-common.config';

export const OdnUrl = {
  // // odn设施资源统计
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
};

