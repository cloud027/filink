import {
  ALARM_CURRENT_SERVER,
  DEVICE_SERVER, USER_SERVER,
  STRATEGY,
  WORK_ORDER_SERVER, ALARM_SET_SERVER,
  FILOCK_SERVER,
  REPORT_ANALYSIS_SERVER,
  CALL_SERVER,
  BROADCAST_SERVER
} from '../../../../core-module/api-service/api-common.config';

// 策略列表
export const LIGHTING_POLICY_LIST = `${DEVICE_SERVER}/strategy/queryStrategyList`;
// 信息发布获取内容列表
export const RELEASE_CONTENT_LIST_GET = `${STRATEGY}/program/queryProgramList`;
// 删除策略
export const LIGHTING_POLICY_DELETE = `${DEVICE_SERVER}/strategy/deleteLightStrategy`;
// 删除联动策略
export const DELETE_LINKAGE_STRATEGY = `${DEVICE_SERVER}/strategy/deleteLinkageStrategy`;
// 删除信息发布策略
export const DELETE_INFO_STRATEGY = `${DEVICE_SERVER}/strategy/deleteInfoStrategy`;
// 删除策略
export const DELETE_STRATEGY = `${DEVICE_SERVER}/strategy/deleteStrategy`;
// 删除节目列表
export const RELEASE_CONTENT_LIST_DELETE = `${STRATEGY}/program/deleteProgram`;
// 信息发布更新列表状态
export const RELEASE_CONTENT_STATE_UPDATE = `${STRATEGY}/program/updateProgramState`;
// 告警列表
export const ALARM_LEVEL_LIST = `${ALARM_CURRENT_SERVER}/alarmCurrent/queryAlarmCurrentPage`;
// 告警名称
export const ALARM_LEVEL_LIST_NAME = `${ALARM_SET_SERVER}/alarmSet/queryAlarmNamePage`;
// 照明策略详情
export const LIGHTING_POLICY_EDIT = `${DEVICE_SERVER}/strategy/queryLightStrategyById`;
// 信息发布
export const RELEASE_POLICY_DETAILS = `${DEVICE_SERVER}/strategy/queryInfoStrategyById`;
// 信息发布新增
export const RELEASE_POLICY_ADD = `${DEVICE_SERVER}/strategy/addInfoStrategy`;
// 信息发布编辑
export const RELEASE_POLICY_EDIT = `${DEVICE_SERVER}/strategy/modifyInfoStrategy`;
// 广播发布新增
export const BROADCAST_POLICY_ADD = `${DEVICE_SERVER}/strategy/addBroadcastStrategy`;
// 广播发布编辑
export const BROADCAST_POLICY_EDIT = `${DEVICE_SERVER}/strategy/modifyBroadcastStrategy`;
// 广播发布
export const BROADCAST_POLICY_DETAILS = `${DEVICE_SERVER}/strategy/queryBroadcastStrategyById`;
// 安防策略详情
export const SECURITY_POLICY_DETAILS = `${DEVICE_SERVER}/strategy/querySecurityStrategyById`;
// 设备播放的节目信息
export const CURRENT_PLAY_PROGRAM = `${STRATEGY}/equipmentData/queryEquipmentCurrentPlayProgram`;
// 联动策略详情
export const LINKAGE_DETAILS = `${DEVICE_SERVER}/strategy/queryLinkageStrategyById`;
// 验证策略名称是否存在
export const CHECK_STRATEGY_NAME_EXIST = `${DEVICE_SERVER}/strategy/checkStrategyNameExist`;
// 照明下发
export const DISTRIBUTE_LIGHT = `${DEVICE_SERVER}/strategy/distributeLightStrategy`;
// 信息发布下发
export const DISTRIBUTE_RELEASE = `${DEVICE_SERVER}/strategy/distributeInfoStrategy`;
// 广播发布下发
export const DISTRIBUTE_BROADCAST = `${DEVICE_SERVER}/strategy/distributeBroadcastStrategy`;
// 联动策略下发
export const DISTRIBUTE_LINKAGE = `${DEVICE_SERVER}/strategy/distributeLinkageStrategy`;
// 策略导出
export const EXPORT_STRATEGY_LIST = `${DEVICE_SERVER}/strategy/exportStrategyList`;
// 设备列表
export const EQUIPMENT_LIST_PAGE = `${DEVICE_SERVER}/equipmentInfo/equipmentListByPage`;
// new设备列表
export const NEW_EQUIPMENT_LIST_PAGE = `${DEVICE_SERVER}/equipmentInfo/equipmentListByPageForListPage`;
// 根据策略id查询关联的设备列表
export const EQUIPMENT_LIST_BY_STRATEGY = `${DEVICE_SERVER}/strategy/equipmentListByStrategy`;
// 设备指令
export const INSTRUCT_DISTRIBUTE = `${STRATEGY}/instruct/instructDistribute`;
// 控制设备详情里面的按钮
export const EQUIPMENT_OPERATION = `${DEVICE_SERVER}/equipmentProtocol/getOperation`;
// 分组指令
export const GROUP_CONTROL = `${STRATEGY}/instruct/groupControl`;
// 工作台亮度调整
export const STRATEGY_INSTRUCT_DISTRIBUTE = `${STRATEGY}/instruct/strategyInstructDistribute`;
// 分组列表
export const GROUP_LIST_PAGE = `${DEVICE_SERVER}/groupInfo/queryGroupInfoList`;
// 设备分组列表
export const GROUP_EQUIPMENT_LIST_PAGE = `${DEVICE_SERVER}/groupInfo/queryGroupInfoListByEquipmentType`;
// 回路列表
export const LOOP_LIST_PAGE = `${DEVICE_SERVER}/loopInfo/loopListByPageForLight`;
// 设备开关
export const EQUIPMENT_SWITCH_LIGHT = `${DEVICE_SERVER}/lightSingleCtrl/switchLight`;
// 设备统计
export const EQUIPMENT_STATUS = `${DEVICE_SERVER}/equipmentInfo/queryEquipmentStatus`;
// 单控数量和集控数量
export const CONTROL_EQUIPMENT_COUNT = `${DEVICE_SERVER}/equipmentInfo/getControlEquipmentCount`;
// 智慧杆数量
export const DEVICE_FUNCTION_POLE = `${DEVICE_SERVER}/deviceInfo/queryDeviceMultiFunctionPole`;
// 安防新增
export const ADD_SECURITY_STRATEGY = `${DEVICE_SERVER}/strategy/addSecurityStrategy`;
// 联动策略的新增
export const LINKAGE_ADD = `${DEVICE_SERVER}/strategy/addLinkageStrategy`;
// 联动策略编辑
export const LINKAGE_EDIT = `${DEVICE_SERVER}/strategy/modifyLinkageStrategy`;
// 信息发布编辑列表内容
export const RELEASE_PROGRAM_EDIT = `${STRATEGY}/program/updateProgram`;
// 信息发布通过节目查看节目信息
export const RELEASE_PROGRAM_LOOK = `${STRATEGY}/program/queryProgramDetailById`;
// 根据节目ids集合查询
export const RELEASE_PROGRAM_LOOKS = `${STRATEGY}/program/queryProgramDetailByIds`;
// 信息新增节目信息
export const RELEASE_PROGRAM_ADD = `${STRATEGY}/program/insertProgram`;
// 信息新增审核(发起审核)
export const RELEASE_WORK_PROGRAM_ADD = `${STRATEGY}/programWorkOrder/addWorkProgram`;
// 信息发布获取内容审核列表
export const RELEASE_PROGRAMME_WORK_LIST_GET = `${STRATEGY}/programWorkOrder/queryProgrammeWorkList`;
// 信息发布工单审核操作
export const RELEASE_WORK_ORDER = `${STRATEGY}/programWorkOrder/auditWorkOrder`;
// 信息发布通过审核查看审核信息
export const RELEASE_WORK_ORDER_DETAIL = `${STRATEGY}/programWorkOrder/queryProgrammeWorkById`;
// 策略新增
export const LIGHTING_POLICY_ADD = `${DEVICE_SERVER}/strategy/addLightStrategy`;
// 策略编辑
export const LIGHTING_MODIFY_STRATEGY = `${DEVICE_SERVER}/strategy/modifyLightStrategy`;
// 策略启用禁用
export const LIGHTING_ENABLE_DISABLE = `${DEVICE_SERVER}/strategy/enableOrDisableStrategy`;
// 安防获取通道列表
export const SECURITY_PASSAGEWAY_LIST_GET = `${STRATEGY}/cameraWorkbench/queryChannelList`;
// 获取配置信息
export const SECURITY_CONFIGURATION_GET = `${STRATEGY}/cameraWorkbench/queryConfiguration`;
// 亮灯率统计
export const LIGHTING_RATE_STATISTICS = `${STRATEGY}/lightStatisticsPart/getLightingRateStatisticsData`;
// 用电量统计
export const ELECT_CONS_STATISTICS = `${STRATEGY}/lightStatisticsPart/getElectConsStatisticsData`;
// 告警统计
export const STATISTICS_ALARM_LEVEL = `${ALARM_CURRENT_SERVER}/alarmStatistics/statisticsAlarmLevel`;
// 告警设备统计
export const STATISTICS_ALARM_LEVEL_EQUIPMENT = `${ALARM_CURRENT_SERVER}/alarmStatistics/statisticsAlarmLevelType`;
// 工单增量统计
export const APPLY_STATISTICS = `${WORK_ORDER_SERVER}/applyStatistics/findApplyStatisticsByCondition`;
// 获取摄像头流地址
export const SECURITY_CONNECTION_CAMERA_GET = `${STRATEGY}/camera/queryCameraPlayStream`;
// 新增/修改配置信息
export const SECURITY_CONFIGURATION_SAVE = `${STRATEGY}/cameraWorkbench/saveConfiguration`;
// 新增通道列表
export const SAVE_CHANNEL = `${STRATEGY}/cameraWorkbench/insertChannel`;
// 修改通道列表
export const UPDATE_CHANNEL = `${STRATEGY}/cameraWorkbench/updateChannel`;
// 安防上传文件（基础配置专用）
export const UPLOAD_SSL_FILE = `${STRATEGY}/cameraWorkbench/uploadSslFile`;
// 删除文件
export const DELETE_FILE = `${STRATEGY}/cameraWorkbench/deleteSslFile`;
// 指令控制
export const CLOUD_CONTROL = `${STRATEGY}/instruct/instructDistribute`;
// 获取预置位列表
export const PRESET_LIST_GET = `${STRATEGY}/cameraWorkbench/queryPresetList`;
// 摄像头流销毁
export const CAMERA_LOGOUT = `${STRATEGY}/cameraWorkbench/cameraLogout`;
// 查看节目状态
export const PROGRAM_STATUS = `${DEVICE_SERVER}/strategy/checkProgStatus`;
// 查询信息屏尺寸
export const GET_ALL_SCREEN_SIZE = `${DEVICE_SERVER}/deviceInfo/getAllScreenSize`;
// 设备节目投放数量统计
export const STATISTICS_OF_NUMBER_OF_EQUIPMENT_PROGRAMS_LAUNCHED = `${STRATEGY}/screenStatisticsPart/getEquipProgramStatisticsData`;
// 设备播放时长统计
export const STATISTICS_OF_DEVICE_PLAYBACK_TIME = `${STRATEGY}/screenStatisticsPart/getEquipPlayTimeStatisticsData`;
// 工单增量统计
export const STATISTICS_OF_WORK_ORDER_INCREMENT = `${STRATEGY}/screenStatisticsPart/getWorkOrderIncrementStatisticsData`;
// 调整音量/亮度
export const ADJUST_VOLUME_AND_BRIGHTNESS = `${STRATEGY}/instruct/strategyInstructDistribute`;
// 查询审核人接口
export const CHECK_USERS = `${USER_SERVER}/user/queryWorkOrderCheckUsers`;
// 告警级别统计
export const STATISTICS_ALARM_LEVEL_TYPE = `${ALARM_CURRENT_SERVER}/alarmStatistics/statisticsAlarmLevelType`;
// 通道列表删除
export const DELETE_CHANNEL = `${STRATEGY}/cameraWorkbench/deleteChannel`;
// 根据通道ID查询通道数据
export const QUERY_CHANNEL_LIST_BY_ID = `${STRATEGY}/cameraWorkbench/queryChannelListById`;
// 节目名称唯一校验
export const PROGRAM_NAME_REPEAT = `${STRATEGY}/program/isProgramNameRepeat`;
// 通道列表修改状态
export const UPDATE_CHANNEL_STATUS = `${STRATEGY}/cameraWorkbench/updateChannelStatus`;
// 设备列表不带分页
export const QUERY_EQUIPMENT_DATA_LIST = `${DEVICE_SERVER}/equipmentInfo/queryEquipmentInfoList`;
// 导出节目接口
export const EXPORT_PROGRAM_DATA = `${STRATEGY}/program/exportProgramList`;
// 导出工单接口
export const EXPORT_WORK_ORDER_DATA = `${STRATEGY}/programWorkOrder/exportProgrammeWorkList`;
// 根据设备id 回路id 分组id 查询设备点在地图上的位置
export const LIST_EQUIPMENT_INFO_FOR_MAP = `${DEVICE_SERVER}/equipmentInfo/listEquipmentInfoForMap`;
// 根据策略id查询关联设施的经纬度
export const EQUIPMENT_MAP_LIST_BY_STRATEGY = `${DEVICE_SERVER}/strategy/equipmentMapListByStrategy`;
// 根据设备id 回路id 分组id 查询设备点在地图上的位置(同一个点上有多个设备的情况)
export const LIST_SAME_POSITION_EQUIPMENT_INFO_FOR_MAP = `${DEVICE_SERVER}/equipmentInfo/listSamePositionEquipmentInfoForMap`;
// 统一授权
const UNIFY_AUTH = `${FILOCK_SERVER}/unifyauth`;
// 查询统一授权列表
export const QUERY_UNIFY_AUTH_LIST = `${UNIFY_AUTH}/queryUnifyAuthByCondition`;

// 新增统一授权
export const ADD_UNIFY_AUTH = `${UNIFY_AUTH}/addUnifyAuth`;

// 查询单个统一授权信息
export const QUERY_UNIFY_AUTH_BY_ID = `${UNIFY_AUTH}/queryUnifyAuthById`;

// 修改统一授权信息
export const MODIFY_UNIFY_AUTH = `${UNIFY_AUTH}/modifyUnifyAuth`;

// 删除单个统一授权信息
export const DELETE_UNIFY_AUTH_BY_ID = `${UNIFY_AUTH}/deleteUnifyAuthById`;

// 批量删除统一授权信息
export const DELETE_UNIFY_AUTH_BY_IDS = `${UNIFY_AUTH}/batchDeleteUnifyAuth`;

// 批量生效/禁用统一授权信息状态
export const BATCH_MODIFY_UNIFY_AUTH_STATUS = `${UNIFY_AUTH}/batchModifyUnifyAuthStatus`;


// 临时授权
const TEMP_AUTH = `${FILOCK_SERVER}/tempauth`;
// 查询临时授权列表
export const QUERY_TEMP_AUTH_LIST = `${TEMP_AUTH}/queryTempAuthByCondition`;

// 审核单个临时授权
export const AUDING_TEMP_AUTH_BY_ID = `${TEMP_AUTH}/audingTempAuth`;

// 批量审核临时授权
export const AUDING_TEMP_AUTH_BY_IDS = `${TEMP_AUTH}/batchAudingTempAuthByIds`;

// 删除单个临时授权信息
export const DELETE_TEMP_AUTH_BY_ID = `${TEMP_AUTH}/deleteTempAuthById`;

// 批量删除统一授权信息
export const DELETE_TEMP_AUTH_BY_IDS = `${TEMP_AUTH}/batchDeleteTempAuth`;

// 查询单个临时授权信息
export const QUERY_TEMP_AUTH_BY_ID = `${TEMP_AUTH}/queryTempAuthById`;


// 权限
const PERMISSION = `${USER_SERVER}/permission`;

// 查询顶级权限
export const QUERY_TOP_PERMISSION = `${PERMISSION}/queryTopPermission`;

// 设施
const DEVICEINFO = `${DEVICE_SERVER}/deviceInfo`;

// 根据设施ids查询设备信息
export const GET_DEVICE_BY_IDS = `${DEVICEINFO}/getDeviceByIds`;

// 获取所有的设施集
export const GET_DEVICE_TYPE = `${USER_SERVER}/role/queryInitDeviceType`;
// 查询统一授权信息
export const QUERY_USER_UNIFY_AUTH_BY_ID = `${UNIFY_AUTH}/queryUserAuthInfoById`;

// 授权名称校验
export const QUERY_AUTH_BY_NAME = `${UNIFY_AUTH}/queryAuthByName`;
// 查询亮度
export const QUERY_LIGHT_NUMBER_BY_ID = `${DEVICE_SERVER}/groupInfo/listGroupInfoByGroupInfoId`;

// 查询设备当前是否有播放策略
export const QUERY_EQUIPMENT_STRATEGY = `${DEVICE_SERVER}/strategy/checkStrategyIsEnableOfEquip`;
// 查询设施锁全部列表
export const QUERY_EQUIPMENT_LOCKLIST = `${UNIFY_AUTH}/deviceListOfLockByPage`;
// 根据授权数据中 门锁
export const QUERY_EQUIPMENT_LOCKOFLIST = `${UNIFY_AUTH}/authDeviceListOfLockByPage`;

// 启用时检查
export const ENABLED_POLICY = `${STRATEGY}/equipmentData/checkEquipmentModeByStrategyId`;
// 新增是设备模式校验
export const CHECK_EQUIPMENT_POLICY = `${STRATEGY}/equipmentData/checkEquipmentMode`;
// 批量关注设备
export const ADD_COLLECT_EQUIPMENTS = `${DEVICE_SERVER}/equipmentInfo/addBatchCollectingByIds`;
// 批量关注设施
export const ADD_COLLECT_DEVICES = `${DEVICE_SERVER}/deviceCollecting/addBatchCollectingByIds`;
// 智慧照明报表分析查询统计数据
export const QUERY_REPORT_ANALYSIS = `${REPORT_ANALYSIS_SERVER}/statistics/light/query`;
// 智慧照明报表分析导出报表
export const EXPORT_REPORT_ANALYSIS = `${REPORT_ANALYSIS_SERVER}/statistics/light/export`;
// 照明工作台用电量统计接口
export const WORKBENCH_QUERY_LIGHT = `${REPORT_ANALYSIS_SERVER}/statistics/light/powerConsumptionStatistics`;

// 获取审核工单历史流程
export const QUERY_HISTORY_LIST = `${STRATEGY}/programWorkOrder/selectOrderHistory`;
// 广播节目投放数量统计
export const STATISTICS_OF_BROADCAST_EQUIPMENT_PROGRAMS_LAUNCHED = `${STRATEGY}/broadcastStatisticsPart/getEquipProgramStatisticsData`;
// 广播播放时长统计
export const STATISTICS_OF_BROADCAST_PLAYBACK_TIME = `${STRATEGY}/broadcastStatisticsPart/getEquipPlayTimeStatisticsData`;
// 广播工单增量统计
export const STATISTICS_OF_BROADCAST_WORK_ORDER_INCREMENT = `${STRATEGY}/broadcastStatisticsPart/getWorkOrderIncrementStatisticsData`;
// 查询历史录音列表
export const QUERY_SOUND_RECORD_LIST = `${BROADCAST_SERVER}/soundRecord/querySoundRecordList`;
// 查询指定历史录音的录音设备
export const QUERY_SOUND_RECORD_EQUIPMENT_LIST = `${BROADCAST_SERVER}/soundRecord/querySoundRecordEquipmentList`;
export const DELETE_SOUND_RECORD = `${BROADCAST_SERVER}/soundRecord/deleteSoundRecord`;
export const BATCH_SEND_BROADCAST = `${BROADCAST_SERVER}/soundRecord/batchSendBroadcastInstruct`;
// 批量下载录音
export const BATCH_DOWNLOAD_RECORDS = `${BROADCAST_SERVER}/soundRecord/batchDownLoadRecords`;
// 导出历史录音
export const EXPORT_RECORD_LIST = `${BROADCAST_SERVER}/soundRecord/exportRecordList`;
export const QUERY_BROADCAST_VOLUME_BY_ID = `${BROADCAST_SERVER}/broadcast/queryBroadcastVolumeById`;
// 一键呼叫
// 查询对讲中的设备
export const QUERY_CALL_DEVICE = `${CALL_SERVER}/callingEquipment/callingEquipmentsByPage`;
// 操作一键呼叫的设备
export const OPERATE_CALL_DEVICE = `${STRATEGY}/instruct/instructDistribute`;
// 查询设施
export const OPERATE_DEVICE_LIST = `${DEVICE_SERVER}/deviceInfo/deviceListByPage`;
export const QUERY_CALL_STATUS = `${CALL_SERVER}/callingEquipment/queryEquipmentStatus`;
// -----------------------------------环境监测--------------------------------------------------------
/** 环境监测列表数据获取 */
export const monitorQueryListDataURL = `${DEVICE_SERVER}/equipmentInfo/equipmentListByPage`;
/** 环境监测基本信息：获取最近一次气象仪上报数据，展示在工作台中 */
export const monitorQueryInfoDataURL = `${STRATEGY}/environment/getEnvironmentData`;
/** 监测点数据  */
export const monitorStatisticsDataByTimeURL = `${STRATEGY}/environment/getStatisticsByTime`;
/** 环境监测工单增量统计 */
// export const monitorWorkInsertURL = `${WORK_ORDER_SERVER}/applyStatistics/findApplyStatisticsByCondition`;
export const monitorWorkInsertURL = `${WORK_ORDER_SERVER}/applyStatistics/findApplyEnvironmentStatisticsByCondition`;
/** 校验分组名称是否重复 */
export const checkGroupInfoByNameURL = `${DEVICE_SERVER}/groupInfo/checkGroupInfoByName`;
/** 新增分组信息 */
export const addGroupInfoURL = `${DEVICE_SERVER}/groupInfo/addGroupInfo`;
/** 移除分组 */
export const moveOutGroupByIdURL = `${DEVICE_SERVER}/groupInfo/moveOutGroupById`;
// 批量关注设备
export const addCollectingEquipmentByIdsURL = `${DEVICE_SERVER}/equipmentInfo/addBatchCollectingByIds`;
// 批量关注设施
export const addCollectingDeviceByIdsURL = `${DEVICE_SERVER}/deviceCollecting/addBatchCollectingByIds`;
// -----------------------------------环境监测--------------------------------------------------------
