/**
 * 策略类型枚举
 */
export enum PolicyTypeEnum {
  // 照明策略
  lighting = '1',
  // 安防监控策略
  centralizedControl = '2',
  // 信息发布策略
  information = '3',
  // 广播发布策略
  broadcast = '4',
  // 联动策略
  linkage = '5'
}

/**
 * 策略状态枚举
 */
export enum PolicyStatusEnum {
  // 启用
  open = '1',
  // 禁用
  close = '0'
}

/**
 * 策略执行状态枚举
 */
export enum ExecStatusEnum {
  // 执行中
  implement= '1',
  // 空闲
  free = '0'
}

/**
 * 执行周期
 */
export  enum ExecTypeEnum {
  // 无
  none = '1',
  // 每天
  everyDay = '2',
  // 工作日
  workingDay = '3',
  // 节假日
  holiday = '4',
  // 间隔执行
  intervalExecution = '5',
  // 自定义
  custom = '6',
}
