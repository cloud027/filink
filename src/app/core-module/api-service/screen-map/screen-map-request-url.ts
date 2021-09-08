import {MPA_SERVER, SYSTEM_SERVER, ALARM_CURRENT_SERVER, DEVICE_SERVER} from '../api-common.config';
// 菜单
const largeScreen = '/largeScreen';

// 查询地区信息
export const GET_AREA = `${SYSTEM_SERVER}/map/getSonArea`;

// 查询所有的省
export const GET_ALL_PROVINCE = `${MPA_SERVER}/map/queryAllProvince`;

// 获取所有的城市信息
export const GET_ALL_CITYINFO = `${MPA_SERVER}/map/queryAllCityInfo`;

// 获取大屏列表
export const GET_ALL_SCREEN = `${SYSTEM_SERVER}${largeScreen}/queryLargeScreenAll`;

// 修改大屏名称
export const EDIT_SCREEN_NAME = `${SYSTEM_SERVER}${largeScreen}/updateLargeScreenNameById`;

// 获取当前告警类型
export const GET_CURRENT_ALARM = `${ALARM_CURRENT_SERVER}/alarmStatistics/queryAlarmCurrentLevelGroup`;

// 获取设施类型
export const GET_DEVICE_TYPE_COUNT = `${DEVICE_SERVER}/statistics/queryDeviceTypeCount`;

// 获取各种设施状态数量
export const GET_DEVICE_STATUS_COUNT = `${DEVICE_SERVER}/statistics/queryUserDeviceStatusCount`;

// 查询告警列表
export const GET_ALARM_CURRENT_LIST = `${ALARM_CURRENT_SERVER}/alarmCurrent/queryAlarmCurrentList`;

// 告警设施topN
export const GET_SCREEN_DEVICE_GROUP = `${ALARM_CURRENT_SERVER}/alarmStatistics/queryScreenDeviceIdGroup`;

// 告警增量
export const GET_ALARM_INCREMENT = `${ALARM_CURRENT_SERVER}/alarmStatistics/alarmDateStatistics`;

// 根据设施id查询设施信息
export const GET_DEVICE_BY_IDS = `${DEVICE_SERVER}/deviceInfo/getDeviceByIds`;
