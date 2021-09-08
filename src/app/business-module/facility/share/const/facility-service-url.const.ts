import {
  ALARM_CURRENT_SERVER,
  ALARM_HISTORY_SERVER,
  ALARM_SET_SERVER,
  DEVICE_SERVER,
  SMART_SERVER
} from '../../../../core-module/api-service/api-common.config';

export const FacilityServiceUrlConst = {
  // 新增设施信息
  addDevice: `${DEVICE_SERVER}/deviceInfo/addDevice`,
  // 删除设施
  deleteDevice: `${DEVICE_SERVER}/deviceInfo/deleteDevice`,
  // 查询设施名称是否存在
  queryDeviceNameIsExist: `${DEVICE_SERVER}/deviceInfo/queryDeviceNameIsExist`,
  // 查询设施日志
  deviceLogListByPage: `${DEVICE_SERVER}/deviceLog/deviceLogListByPage`,
  // 导出设施列表数据
  exportDeviceList: `${DEVICE_SERVER}/deviceInfo/exportDeviceList`,
  // 导出设施列表数据已拆除
  exportDeviceListNew: `${DEVICE_SERVER}/deviceInfo/exportDeviceListNew`,
  // 导出设备日志
  exportDeviceLogList: `${DEVICE_SERVER}/deviceLog/exportDeviceLogList`,
  // 获取光缆信息列表
  opticCableListByPage: `${SMART_SERVER}/opticCableInfo/opticCableListByPage`,
  // 根据光缆id查询详情
  queryOpticCableById: `${SMART_SERVER}/opticCableInfo/queryOpticCableById`,
  // 新增光缆信息
  addOpticCable: `${SMART_SERVER}/opticCableInfo/addOpticCable`,
  // 光缆名称校验
  checkOpticCableName: `${SMART_SERVER}/opticCableInfo/checkOpticCableName`,
  // 编辑光缆信息
  updateOpticCableById: `${SMART_SERVER}/opticCableInfo/updateOpticCableById`,
  // 删除光缆信息
  deleteOpticCableById: `${SMART_SERVER}/opticCableInfo/deleteOpticCableById`,
  // 光缆列表导出
  exportOpticCableList: `${SMART_SERVER}/opticCableInfo/exportOpticCableList`,
  // 获取光缆段列表
  opticCableSectionById: `${SMART_SERVER}/opticCableSectionInfo/opticCableSectionById`,
  // 删除光缆段信息
  deleteOptic: `${SMART_SERVER}/opticCableSectionInfo/deleteOpticCableSectionByOpticCableSectionId`,
  // 光缆段列表导出
  exportOptic: `${SMART_SERVER}/opticCableSectionInfo/exportOpticCableSectionList`,
  // 根据光缆ID查询光缆拓扑
  opticCableSectionByIdForTopology: `${SMART_SERVER}/opticCableSectionInfo/opticCableSectionByIdForTopology`,
  // 获取智能标签列表
  opticCableSectionRFidInfoById: `${SMART_SERVER}/opticCableSectionRfidInfo/OpticCableSectionRfidInfoById`,
  // 智能标签列表删除
  deleteOpticCableSectionRFidInfoById: `${SMART_SERVER}/opticCableSectionRfidInfo/deleteOpticCableSectionRfidInfoById`,
  // 根据设施id查询当前用户是否存在全部设施权限
  existIsPermissionDeviceByDeviceIdList: `${SMART_SERVER}/opticCableSectionInfo/existIsPermissionDeviceByDeviceIdList`,
  // 根据设施id查询当前用户有权限的设施信息
  checkIsPermissionDeviceByDeviceIdList: `${SMART_SERVER}/opticCableSectionInfo/checkIsPermissionDeviceByDeviceIdList`,
  // 最后一条设施日志的时间
  queryRecentDeviceLogTime: `${DEVICE_SERVER}/deviceLog/queryRecentDeviceLogTime`,
  // 下载模板
  downloadTemplate: `${DEVICE_SERVER}/deviceInfo/downloadTemplate`,
  // 查询责任单位下是否有告警转工单规则
  queryAlarmOrderRuleByAreaDeptIds: `${ALARM_SET_SERVER}/alarmOrderRule/queryAlarmOrderRuleByAreaDeptIds`,
  // 根据设施查询当前告警
  queryAlarmDeviceId: `${ALARM_CURRENT_SERVER}/alarmCurrent/queryAlarmDeviceId`,
  // 首页设施详情查看历史告警
  queryAlarmHistoryDeviceId: `${ALARM_HISTORY_SERVER}/alarmHistory/queryAlarmHistoryDeviceId`,
  // 查询杆体上可挂载的设备
  updatePoleInfoByEquipment: `${DEVICE_SERVER}/equipmentInfo/updatePoleInfoByEquipment`,
  // 查询设施杆体信息
  queryDeviceInfo: `${DEVICE_SERVER}/deviceInfo/queryDeviceInfo`,
  // 新增设备
  addEquipment: `${DEVICE_SERVER}/equipmentInfo/addEquipment`,

  // 修改设施业务状态 释放、锁定
  updateDeviceStatusByIds: `${DEVICE_SERVER}/deviceInfo/updateStatusByIds`,

  // 修改设备业务状态 释放、锁定
  updateEquipmentStatusByIds: `${DEVICE_SERVER}/equipmentInfo/updateStatusByIds`,
  // 保存同步产品
  saveSyncProduct: `${DEVICE_SERVER}/deviceInfo/updateProductInfoByEquipment`,
};
