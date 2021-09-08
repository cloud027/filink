/**
 * 弹窗类型
 */
export enum AlarmModalTypeEnum {
  // 已处理
  handle  = 'handle',
  // 误判
  judge = 'judge',
}

/**
 * 告警卡片切换，改变显示方式
 */
export enum ShowTypeEnum {
  // 告警级别
  showLevel  = '1',
  // 告警设施对象类型
  showType = '2',
}
/**
 * 表单联动条件
 */
export enum LinkageEnum {
  // 区域
  area  = 'area',
  // 类型
  deviceType = 'deviceType',
}

/**
 * 进程状态
 */
export enum ProcessStatusEnum {
  // 已处理
  processed = 1,
  // 误判
  erroneousJudgement  = 2,
}

/**
 * 接口请求
 */
export enum AlarmPathEnum {
  // 当前告警
  alarmCurrent = 'queryCurrentAlarmInfoById',
  // 历史告警
  alarmHistory = 'queryAlarmHistoryInfo',
  // 已处理
  alarmProcessed = 'alarmProcessed',
  // 误判
  alarmMisJudgment = 'alarmMisJudgment',
  // 新增静态告警相关性分析
  addStaticRule = 'addStaticRule',
  // 编辑静态告警相关性分析
  editStaticRule = 'editStaticRule',
}

/**
 * 是否库存
 */
export enum AlarmInventoryEnum {
  // 是
  yes = '1',
  // 否
  no = '2'
}

/**
 * 是否启用状态枚举
 */
export enum AlarmEnableStatusEnum {
  // 启用
  enable = 1,
  // 禁用
  disable = 2,
}

/**
 * 工单类型
 */
export enum AlarmWorkOrderTypeEnum {
  // 巡检工单
  pollingWork = 1,
  // 销障工单
  eliminateWork = 2,
}

/**
 * 触发条件
 */
export enum AlarmTriggerTypeEnum {
  // 告警发生时触发
  alarmHappenedTrigger = 0,
  // 启用状态时触发
  startUsingTrigger = 1,
}

/**
 * 是否自动确认
 */
export enum AlarmIsConfirmEnum {
  // 是
  yes = '1',
  // 否
  no = '0',
}

/**
 * 告警等级颜色值
 */
export enum AlarmSetLevelColorEnum {
  /**
   * 红色
   */
  red = '111',
  /**
   * 橙色
   */
  orange = '222',
  /**
   * 黄色
   */
  yellow = '333',
  /**
   * 蓝色
   */
  blue = '444',
  /**
   * 明黄色
   */
  brightYellow = '555',
  /**
   * 深蓝色
   */
  deepBlue = '666',
  /**
   * 绿色
   */
  green = '777'
}
/**
 * 是否自动诊断
 */
export enum AlarmIsAutoDiagnoseEnum {
  // 是
  isAutoDiagnose = '1',
  // 否
  noAutoDiagnose = '0'
}

/**
 * 是否自动核实派单
 */
export enum AlarmIsAutoCheckDisEnum {
  // 是
  isAutoCheckDis = '1',
  // 否
  noAutoCheckDis = '0'
}
/**
 * 是否自动转故障
 */
export enum AlarmIsAutoTurnMalEnum {
  // 是
  isAutoTurnMal = '1',
  // 否
  noAutoTurnMal = '0'
}

/**
 * 工单是否关闭
 */
export enum CloseStatusEnum {
  // 关闭
  isClose = '0',
  // 未关闭
  noClose = '1'
}
/**
 * 转故障状态
 */
export enum IsTurnTroubleEnum {
  // 可以转
  canTurn = 1,
  // 不可以转
  noTurn = 2,
  // 异常
  abnormal = 3
}
/**
 * 转派信息tab页签
 */
export enum SelectedIndexEnum {
  // 确认工单
  confirmOrder = 0,
  // 销障工单
  eliminateOrder = 1,
  // 故障
  trouble = 2
}

/**
 * 任务类型
 */
export enum TaskTypeEnum {
  // 在线
  onLine = '1',
  // 离线
  offLine = '0',
}

/**
 * 输出类型
 */
export enum OutputTypeEnum {
  // 自动
  automatic = '1',
  // 手动
  manual = '0',
}

/**
 * 告警相关性分析运算符
 */
export enum AlarmOperatorEnum {
  // 等于
  equal = '1',
  // 不等于
  unequal = '2',
  // 电力拓扑联通
  electricityLink = '3',
  // 通信拓扑联通
  communicationLink = '4',
}

/**
 * 告警相关性分析运算符转义
 */
export enum TranslateOperatorEnum {
  // 等于
  equal = '等于',
  // 不等于
  unequal = '不等于',
}
/**
 * 属性
 */
export enum AlarmPropertyEnum {
  // 根原因告警属性
  reasonAlarm = '1',
}
/**
 * 值
 */
export enum CorrelationAlarmPropertyEnum {
  // 相关原因告警属性
  correlationProperty = '1',
}

/**
 * 根原因告警属性
 */
export enum AlarmReasonPropertyEnum {
  // 告警对象
  alarmObject = '1',
  // 区域
  area = '2',
  // 设施类型
  deviceType = '3',
  // 设备类型
  equipmentType = '4'
}
/**
 * 根原因告警动作
 */
export enum rootAlarmActionEnum {
  // 无
  nothing = '1',
}
/**
 * 相关告警动作
 */
export enum CorrelationAlarmActionEnum {
  // 无
  nothing = '1',
  // 抑制
  restrain = '2',
}

/**
 * 步骤条
 */
export enum StepDataEnum {
  // 选择告警
  selectAlarm = '1',
  // 规则条件
  ruleCondition = '2',
  // 其他设置
  otherSet = '3'
}

/**
 * 是否禁启用
 */
export enum AlarmDisableStatusEnum {
  // 启用
  enable = '1',
  // 禁用
  disable = '0',
}

export enum TaskStatusEnum {
  // 已完成
  completed = '0',
  // 未执行
  notPerformed = '1',
  // 执行中
  executing = '2',
  // 异常
  abnormal = '3'
}

/**
 *  动态规则更多操作
 */
export enum DynamicRuleOperateEnum {
  // 禁用
  disables = '0',
  // 启用
  enables = '1',
  // 立即执行
  executes = '2'
}

/**
 *  是否保存
 */
export enum IsSavedEnum {
  // 是
  right = '1',
  // 否
  deny = '0'
}

/**
 * 规则条件
 */
export enum  RuleConditionEnum {
  // 1：【(根).告警对象】 = 【(相关).告警对象】
  rootAlarmObj_1 = '1',
  // 2:【(根).告警对象】 【电力拓扑连通】【(相关).告警对象】
  rootAlarmObj_2 = '2',
  // 3:【(根).告警对象】 【通信拓扑连通】【(相关).告警对象】
  rootAlarmObj_3 = '3',
  // 4:【空】
  rootAlarmObj_4 = '4'
}
