import {
  ALARM_CURRENT_SERVER,
  DEVICE_SERVER,
  LOG_SERVER,
  SMART_SERVER,
  STRATEGY, USER_SERVER,
  WORK_ORDER_SERVER
} from '../api-common.config';

const AREA_PREFIX = `${DEVICE_SERVER}/areaInfo`;
const FACILITY_PREFIX = `${DEVICE_SERVER}/deviceInfo`;
const MAP_PREFIX = `${USER_SERVER}/deviceMapConfig`;
const COLLECTION_PREFIX = `${DEVICE_SERVER}/deviceCollecting`;
const ALARM_STATISTICS = `${ALARM_CURRENT_SERVER}/alarmStatistics`;
const FACILITY_STATISTICS = `${DEVICE_SERVER}/statistics`;
const LOG_OPERATE = `${LOG_SERVER}/log`;
const PRO_STATISTICAL = `${WORK_ORDER_SERVER}/procStatistical`;
const OPTIC_CABLE_SECTION_INFO = `${SMART_SERVER}/opticCableSectionInfo`;
const ODN_FACILITY_RESOURCES = `${SMART_SERVER}/odnFacilityResources`;

export const INDEX_URL = {
  // 查询所有设施列表
  GET_FACILITY_LIST_ALL: `${FACILITY_PREFIX}/queryDeviceAreaList`,

  // 根据Id查询设备详情
  FIND_DEVICE_ID: `${FACILITY_PREFIX}/findDeviceById`,

  // 查询所有设施列表(基本数据，key值简化)
  GET_FACILITY_LIST_ALL_BASE: `${FACILITY_PREFIX}/queryDeviceAreaListBase`,

  // 查询所有设施列表(key值简化)
  GET_FACILITY_LIST_ALL_SIMPLE: `${FACILITY_PREFIX}/queryDeviceAreaListSimple`,

  // 查询区域列表
  GET_AREA_LIST_ALL: `${AREA_PREFIX}/queryAreaListAll`,

  // 查询当前用户区域列表
  GET_AREA_LIST_FOR_CURRENT_USER: `${AREA_PREFIX}/queryAreaListForPageSelection`,

  // 获取设施类型配置信息
  GET_FACILITY_CONFIG_ALL: `${MAP_PREFIX}/queryDeviceConfigAll`,

  // 修改用户地图设施类型配置的设施类型启用状态
  UPDATE_FACILITY_TYPE_STATUS: `${MAP_PREFIX}/updateDeviceTypeStatusAll`,

  // 修改用户地图设施类型配置的设施图标尺寸
  UPDATE_FACILITY_ICON_SIZE: `${MAP_PREFIX}/updateDeviceIconSize`,

  // 收藏设施
  COLLECT_FACILITY: `${COLLECTION_PREFIX}/focus`,

  // 取消收藏设施
  CANCEL_COLLECT_FACILITY: `${COLLECTION_PREFIX}/unFollow`,

  // 获取收藏设施统计
  GET_COLLECT_FACILITY_LIST_STATISTICS: `${COLLECTION_PREFIX}/count`,

  // 获取收藏设施列表
  GET_COLLECT_FACILITY_LIST: `${COLLECTION_PREFIX}/attentionListByPage`,

  // 获取所有收藏的设施
  GET_COLLECT_FACILITY_LIST_ALL: `${COLLECTION_PREFIX}/attentionList`,

  // 查询设施当前告警各级别数量
  QUERY_ALARM_LEVEL_GROUPS: `${ALARM_STATISTICS}/queryAlarmNameHomePage`,

  // 查询当前告警各级别数量
  QUERY_ALARM_CURRENT_LEVEL_GROUPS: `${ALARM_STATISTICS}/queryAlarmCurrentLevelGroup`,

  // 操作记录
  FIND_OPERATE_LOG: `${LOG_OPERATE}/findOperateLog`,

  // 查询告警设施Top10
  QUERY_SCREEN_DEVICE_IDS_GROUP: `${ALARM_STATISTICS}/queryScreenDeviceIdsGroup`,

  // 查询告警设施Top10名称
  QUERY_HOME_DEVICE_IDS: `${FACILITY_PREFIX}/queryHomeDeviceByIds`,

  // 查询各设施状态数量
  QUERY_USER_DEVICE_STATUS_COUNT: `${FACILITY_STATISTICS}/queryUserDeviceStatusCount`,

  // 工单增量
  QUERY_HOME_PROC_ADD_LIST_COUNT_GROUP_BY_DAY: `${PRO_STATISTICAL}/queryHomeProcAddListCountGroupByDay`,

  // 告警增量
  ALARM_DATE_STATISTICS: `${ALARM_STATISTICS}/alarmDateStatistics`,

  // 繁忙TOP
  QUERY_USER_UNLOCKING_TOP_NUM: `${FACILITY_STATISTICS}/queryUserUnlockingTopNum`,

  // 根据光缆ID查询光缆所有设施
  QUERY_DEVICE_INFO_LIST_BY_ID: `${OPTIC_CABLE_SECTION_INFO}/queryDeviceInfoListByOpticCableId`,

  // 根据光缆ID查询光缆所有设施
  QUERY_DEVICE_USE_PORT_STATISTICS: `${ODN_FACILITY_RESOURCES}/deviceUsePortStatistics`,

  // 根据设施Id 查询设施信息
  QUERY_HOME_DEVICE_BY_ID: `${FACILITY_PREFIX}/queryHomeDeviceById`,

  // 首页首次加载
  QUERY_HOME_DEVICE_AREA: `${FACILITY_PREFIX}/queryHomeDeviceArea`,

  // 首页大数据刷新
  REFRESH_HOME_DEVICE_AREA: `${FACILITY_PREFIX}/refreshHomeDeviceArea`,

  // 首页数据刷新
  REFRESH_HOME_DEVICE_AREA_HUGE: `${FACILITY_PREFIX}/refreshHomeDeviceAreaHuge`,

  // 批量操作
  INSTRUCT_INSTIUCT_DISTRIBUTE: `${STRATEGY}/instruct/instructDistribute`,

  // 获取音量或者亮度
  QUERY_EQUIPMENT_BY_ID : `${STRATEGY}/equipmentData/queryEquipmentById`

};
