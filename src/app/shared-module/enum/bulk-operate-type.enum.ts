/**
 * 批量操作组件下发类型枚举
 */
export enum BulkOperateTypeEnum {
  // 广播同步播放事件
  broadcastSynchronization = '1',
// 信息屏幕同步播放事件
  screenSynchronization = '2',
// 公共操作按钮时间
  commonOperate = '3',
// 照明控制亮度变化触发事件
  lightChange = '4',
// 信息屏幕亮度变化触发事件
  screenLight = '5',
// 信息屏幕音量变化触发事件
  screenVolume = '6',
// 广播幕音量变化触发事件
  broadcastVolume = '7',
}
