import {DEVICE_SERVER, STRATEGY, WORK_ORDER_SERVER, WORK_FLOW_SERVER, CALL_SERVER, BROADCAST_SERVER} from '../api-common.config';

// 获取配置信息
export const SECURITY_CONFIGURATION_GET = `${STRATEGY}/cameraWorkbench/queryConfiguration`;
// 指令控制
export const CLOUD_CONTROL = `${STRATEGY}/instruct/instructDistribute`;
// 获取预置位列表
export const PRESET_LIST_GET = `${STRATEGY}/cameraWorkbench/queryPresetList`;
// 安防获取通道列表
export const SECURITY_PASSAGEWAY_LIST_GET = `${STRATEGY}/cameraWorkbench/queryChannelList`;
// 分组控制指令下发接口
export const GROUP_CONTROL = `${STRATEGY}/instruct/groupControl`;
// 设备播放的节目信息
export const CURRENT_PLAY_PROGRAM = `${STRATEGY}/equipmentData/queryEquipmentCurrentPlayProgram`;
// 工单增量统计
export const APPLY_STATISTICS = `${WORK_ORDER_SERVER}/applyStatistics/findApplyStatisticsByCondition`;
export const A_KEY_APPLY_STATISTICS = `${WORK_ORDER_SERVER}/applyStatistics/findApplyAKeyToCallStatisticsByCondition`;
// 切换设备模式时校验
export const CHECK_POLICY = `${STRATEGY}/equipmentData/checkEquipmentModeByStrategy`;
// 获取指令通知列表
export const GET_INSTRUCTION_LIST = `${DEVICE_SERVER}/instruct/getInstructResultList`;
export const GET_INSTRUCTION_LIST_100 = `${DEVICE_SERVER}/instruct/getTop100InstructResultList`;
// 已读指令通知
export const READ_INSTRUCTION = `${DEVICE_SERVER}/instruct/updateInstructResult`;
// 获取未读指令通知数量
export const GET_INSTRUCTION_COUNT = `${DEVICE_SERVER}/instruct/queryCurTenantInstructResultCount`;
// 获取审核工单历史流程
export const QUERY_HISTORY_LIST = `${WORK_FLOW_SERVER}/process/queryHistoryList`;
// 获取sip账号
export const AVAILABLE_SIP_USER = `${CALL_SERVER}/sipInfo/availableSipUser`;
// 查询当前设备音量
export const QUERY_BROADCAST_VOLUME_BY_ID = `${BROADCAST_SERVER}/broadcast/queryBroadcastVolumeById`;
// 设备列表
export const EQUIPMENT_LIST_PAGE = `${DEVICE_SERVER}/equipmentInfo/equipmentListByPage`;
