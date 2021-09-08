import {ALARM_CURRENT_SERVER} from '../api-common.config';
import {ALARM_HISTORY_SERVER} from '../api-common.config';
import {
  ALARM_SET_SERVER, USER_SERVER, DEVICE_SERVER,
  WORK_ORDER_SERVER
} from '../api-common.config';

const ALARM_CURRENT = `${ALARM_CURRENT_SERVER}/alarmCurrent`;
const QUERY_ALARM_CURRENT = `${ALARM_CURRENT_SERVER}`;
const ALARM_SET = `${ALARM_SET_SERVER}/alarmSet`;
// 查询单个当前告警的信息
export const QUERY_ALARM_CURRENT_INFO_BY_ID = `${ALARM_CURRENT}/queryAlarmCurrentInfoById`;
// 批量修改当前告警备注信息
export const UPDATE_ALARM_REMARK = `${ALARM_CURRENT}/updateAlarmRemark`;
// websocket-msg
export const WEBSOCKET = `${ALARM_CURRENT}/websocket`;
// 首页设施详情查看当前告警
export const QUERY_ALARM_DEVICE_ID = `${ALARM_CURRENT}/queryAlarmDeviceId`;

const ALARM_HISTORY = `${ALARM_HISTORY_SERVER}/alarmHistory`;
// 首页设施详情查看历史告警
export const QUERY_ALARM_HISTORY_DEVICE_ID = `${ALARM_HISTORY}/queryAlarmHistoryDeviceId`;
// 历史告警 修改备注
export const UPDATE_HISTORY_ALARM_REMARK = `${ALARM_HISTORY}/batchUpdateAlarmRemark`;

const ALARM_FILTER_REMOTE = `${ALARM_SET_SERVER}/alarmForwardRule`;
const USER = `${USER_SERVER}/user`;
// 告警远程通知 新增页面 请求通知人
export const QUERY_ALARM_USER = `${USER}/queryUserByField `;
// 告警远程通知 通过区域 和 设施类型 查询通知人
export const QUERY_USER_INFOBY_DEPT_AND_DEVICE_TYPE = `${USER}/queryUserInfoByDeptAndDeviceType `;
// 告警远程通知 新增
export const ADD_ALARM_REMOTE = `${ALARM_FILTER_REMOTE}/addAlarmForwardRule`;
// 告警远程通知 编辑 通过ID 查询相关数据
export const QUERY_ALARM_REMOTE_BY_ID = `${ALARM_FILTER_REMOTE}/queryAlarmForwardId`;

const PROC_CLEAR_FAILURE = `${WORK_ORDER_SERVER}/procClearFailure`;
// 当前告警 创建工单
export const ADD_CLEAR_FAILURE_PROC = `${PROC_CLEAR_FAILURE}/addClearFailureProc`;

const ALARM_STATISTICS = `${ALARM_CURRENT_SERVER}/alarmStatistics`;
// 告警类型统计
export const QUERY_ALARM_CONUT_BY_LEVEL_AND_AREA = `${ALARM_STATISTICS}/queryAlarmConutByLevelAndArea`;
// 告警处理统计
export const QUERY_ALARM_HANDLE = `${ALARM_STATISTICS}/queryAlarmHandleStatistics`;
// 查询当前告警列表信息
export const QUERY_ALARM_CURRENT_LIST = `${ALARM_CURRENT}/queryAlarmCurrentList`;
// 告警名称统计
export const QUERY_ALARM_NAME_STATISTICS = `${ALARM_STATISTICS}/queryAlarmNameStatistics`;
// 区域告警比统计
export const AREA_ALARM_STATISTICS = `${ALARM_STATISTICS}/queryAreaAlarmStatistics`;
// 告警增量统计
export const ALARM_INCREMENTAL_STATISTICS = `${ALARM_STATISTICS}/queryAlarmIncrementalStatistics`;
// 告警统计 模板
export const ALARM_STATISTICAL_LIST = `${ALARM_STATISTICS}/queryAlarmStatisticsTempList`;
// 统计模板删除
export const DELETE_ALARM_STATISTICAL = `${ALARM_STATISTICS}/deleteManyAlarmStatisticsTemp`;
// 统计模板新增
export const ADD_ALARM_STATISTICAL_TEMPLATE = `${ALARM_STATISTICS}/addAlarmStatisticsTemp`;
// 统计模板 通过ID查询
export const QUERY_ALARM_STAt_BY_TEMP_ID = `${ALARM_STATISTICS}/queryAlarmStatById`;
// 统计模板 编辑
export const UPDATE_ALARM_STATISTICAL_TEMPLATE = `${ALARM_STATISTICS}/updateAlarmStatisticsTemp`;
// 统计模板名称唯一性校验
export const STATISTICAL_TEMPLATE_NAME = `${ALARM_STATISTICS}/alarmTemplateNameExist`;
// 告警统计 导出
export const EXPORT_ALARM_STATISTICAL = `${ALARM_STATISTICS}/exportAlarmStatisticsList`;
// 设施详情单个设施告警的统计相关url
export const DEVICE_DETAIL_ALARM_STATISTICS = {
  // 设施统计当前告警级别信息
  currentLevel: `${ALARM_STATISTICS}/queryAlarmCurrentDeviceLevel`,
  // 设施统计历史告警级别信息
  historyLevel: `${ALARM_STATISTICS}/queryAlarmHistoryDeviceLevel`,
  // 设施统计当前告警名称信息
  currentSourceName: `${ALARM_STATISTICS}/queryAlarmCurrentDeviceName`,
  // 设施统计历史告警名称信息
  historySourceName: `${ALARM_STATISTICS}/queryAlarmHistoryDeviceName`,
  //  设施统计告警增量
  alarmSourceIncremental: `${ALARM_STATISTICS}/queryAlarmDeviceIncremental`
};
// 告警建议
export const QUERY_EXPERIENCE_INFO = `${QUERY_ALARM_CURRENT}/alarmExperience/queryExperience`;
// 告警类型
export const  QUERY_ALARM_TYPE_LIST = `${ALARM_CURRENT}/queryAlarmTypeList`;
// 设备列表
export const QUERY_EQUIPMENT_LIST = `${DEVICE_SERVER}/equipmentInfo/equipmentListByPage`;
// 告警照片
export const GET_ALARM_PIC = `${DEVICE_SERVER}/picRelationInfo/getPicDetailForNew`;
// 查询单个历史告警的信息
export const QUERY_ALARM_HISTORY_INFO = `${ALARM_HISTORY}/queryAlarmHistoryInfoById`;
// 查询告警级别
export const  QUERY_ALARM_STATISTICS = `${ALARM_CURRENT_SERVER}/alarmStatistics/staticAlarmTopData`;
// 批量设置当前告警的告警清除状态
export const UPDATE_ALARM_CLEAN_STATUS = `${ALARM_CURRENT}/updateAlarmCleanStatus`;
// 查询告警级别列表信息
export const QUERY_ALARM_LEVEL_LIST = `${ALARM_SET}/queryAlarmLevelList`;
// 查询当前告警设置列表信息
export const QUERY_ALARM_CURRENT_SET_LIST = `${ALARM_SET}/queryAlarmNamePage`;

