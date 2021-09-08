/**
 * 故障处理状态样式
 */
export enum HandleStatusClassEnum {
  /**
   * 未提交
   */
  uncommit = 'fiLink-filink-weitijiao-icon uncommit-color',
  /**
   * 已提交
   */
  commit = 'fiLink-filink-yitijiao-icon commit-color',
  /**
   * 处理中
   */
  processing = 'fiLink-filink-chulizhong-icon processing-color',
  /**
   * 已完成
   */
  done = 'fiLink-filink-yiwancheng-icon done-color',
  /**
   * 已打回
   */
  undone = 'fiLink-filink-yidahui-icon undone-color'
}

/**
 * 告警等级背景色
 */
export enum WorkOrderAlarmLevelColor {
  /**
   * 紧急
   */
  urgent = '1',
  /**
   * 主要
   */
  main = '2',
  /**
   * 次要
   */
  secondary = '3',
  /**
   * 提示
   */
  prompt = '4',
}

/**
 * 等级卡片图标
 */
export enum levelClassEnum {
  /**
   * 紧急
   */
  urgency = 'fiLink-alarm-urgency',
  /**
   * 主要
   */
  serious = 'fiLink-alarm-serious',
  /**
   * 次要
   */
  secondary = 'fiLink-alarm-secondary',
  /**
   * 提示
   */
  prompt = 'fiLink-alarm-prompt',
}

/**
 * 告警等级转换
 */
export enum getLevelValueEnum {
  /**
   * 紧急
   */
  urgency = '1',
  /**
   * 主要
   */
  serious = '2',
  /**
   * 次要
   */
  secondary = '3',
  /**
   * 提示
   */
  prompt = '4',
}
/*
* 处理状态
*/
export enum HandleStatusEnum {
  /**
   * 未提交
   */
  uncommit = 'uncommit',
  /**
   * 已提交
   */
  commit = 'commit',
  /**
   * 处理中
   */
  processing = 'processing',
  /**
   * 已完成
   */
  done = 'done',
  /**
   * 已打回
   */
  undone = 'undone'
}

/**
 * 故障来源
 */
export enum TroubleSourceEnum {
  /**
   * App报修
   */
  app = 'App',
  /**
   * 投诉
   */
  complaint = 'complaint',
  /**
   * 告警
   */
  alarm = 'alarm'
}

/**
 * 故障类型
 */
export enum TroubleTypeEnum {
  // 通信故障
  communicationTrouble = '1',
  // 业务质量故障
  qosTrouble = '2',
  // 环境故障
  environmentTrouble = '3',
  // 电力故障
  powerTrouble = '4',
  // 安全故障
  safetyTrouble = '5',
  // 设备故障
  deviceTrouble = '6'
}
