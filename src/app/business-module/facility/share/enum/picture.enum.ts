
/**
 * 点击来源
 */
export enum PicResourceStatusEnum {
  // 销账未完工列表
  picStatusClearUnfinished = '1',
  // 销账历史列表
  picStatusClearHis = '2',
  // 巡检未完工列表
  picStatusInspectionUnfinished = '3',
  // 巡检历史列表
  picStatusInspectionHis = '4',
  // 当前告警
  picStatusCurrentAlarm = '5',
  // 历史告警
  picStatusHisAlarm = '6',
  // 历史安装工单
  picHistoryInstallOrder = '7',
  // 历史告警确认工单
  picHistoryAlarmOrder = '8',
  // 未完工拆除工单列表
  picStatusDismantleUnfinished = '9',
  // 历史拆除工单列表
  picStatusDismantleHis = '10',
}
