/**
 * 策略枚举
 */
export enum PolicyEnum {
  // 设备类型
  equipmentType = 'equipmentType',
  // 程序状态
  programStatus = 'programStatus',
  // 告警类型ID
  alarmSourceTypeId = 'alarm_source_type_id',
  // 策略类型
  strategyType = 'strategyType',
  // 策略状态
  strategyStatus = 'strategyStatus',
  // 环状ID
  loopId = 'loopId',
  // 环状IDS
  loopIds = 'loopIds',
  // 组ID
  groupId = 'groupIds',
  // 设备ID
  equipmentId = 'equipmentId',
  // 有效时间
  effectivePeriodTime = 'effectivePeriodTime',
  // 有效开始时间
  effectivePeriodStart = 'effectivePeriodStart',
  // 有效结束时间
  effectivePeriodEnd = 'effectivePeriodEnd',
  // 一键呼叫设备形态
  equipmentModelType = 'equipmentModelType',
  programType = 'programType',
}

/**
 * 策略类型枚举
 */
export enum StrategyStatusEnum {
  lighting = '1',
  centralizedControl = '2',
  information = '3',
  broadcast = '4',
  linkage = '5',
  execType = '6',
}

/**
 * 操作类型
 */
export enum ExecStatusEnum {
  free = '0',
  implement = '1'
}

/**
 * 开关状态
 */
export enum SwitchStatus {
  /**
   * 关
   */
  off = '0',
  /**
   * 开
   */
  on = '1'
}

/**
 * 单灯控制
 */
export enum TargetTypeEnum {
  /**
   * 单灯
   */
  singleControl = 'E002',
  /**
   * 集控
   */
  multiControl = 'E003',
  /**
   * 信息屏
   */
  informationScreen = 'E004',
  broadcast = 'E006',
  oneTouchCalling = 'E030',
}

/**
 * form表单中的显隐枚举
 */
export enum FormTypeEnum {
  intervalTime = 'intervalTime',
  execTime = 'execTime',
  all = 'all'
}

/**
 * 策略执行周期枚举
 */
export enum ExecTypeEnum {
  // 无
  none = '1',
  // 每天
  every_day = '2',
  // 工作日
  working_day = '3',
  // 节假日
  holiday = '4',
  // 间隔执行
  interval_execution = '5',
  // 自定义
  custom = '6',
}

export enum ApplicationScopeTypeEnum {
  /**
   * 设备列表类型
   */
  equipment = '1',
  /**
   * 分组列表类型
   */
  group = '2',
  /**
   * 回路列表类型
   */
  loop = '3'
}
