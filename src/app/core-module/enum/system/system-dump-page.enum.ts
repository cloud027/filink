/**
 * 转储页面
 */
export enum SystemDumpPageEnum {
  // 系统日志转储策略
  systemLog = 'system-log',
  // 告警转储策略
  alarm = 'alarm',
  // 设施日志转储策略
  facilityLog = 'facility-log',
  // 巡检工单转储策略
  inspection = 'inspection',
  // 销障工单转储策略
  clearBarrier = 'clear-barrier',
  // 安装工单
  installation = 'installation',
  // 告警确认工单
  alarmConfirm = 'alarm-confirm',
  // 故障
  trouble = 'trouble',
}
