/**
 *工单类型 巡检、销障、安装、告警
 */
export enum ClearBarrierOrInspectEnum {
  // 巡检
  inspection = 'inspection',
  // 销障
  clearBarrier = 'clear_failure',
  // 告警确认工单
  alarmConfirmOrder = 'confirm',
  // 安装工单
  installation = 'install',
  /** 拆除工单 */
  remove = 'remove'
}

/**
 * 巡检项是否通过
 */
export enum ItemIsPassEnum {
  // 已通过.
  pass = '0',
  // 未通过
  unPass = '1'
}

/**
 * 巡检类型
 */
export enum InspectionTaskTypeEnum {
  // 例行巡检
  routineInspection = '1',
}

/**
 * 图表类型
 */
export enum ChartTypeEnum {
  // 图表
  chart= 'chart',
  // 文字
  text = 'text',
}

/**
 * 故障来源
 */
export enum FaultSourceEnum {
  // 告警
  alarm = 'alarm',
  // App报修
  App = 'App',
  // 投诉
  complaint = 'complaint',
}

/**
 * 图片来源
 */
export enum QueryImgResourceEnum {
  /**
   * 告警
   */
  alarm = '1',
  /**
   *工单
   */
  order = '2',
  /**
   * 实景图
   */
  realImage = '3'
}

/**
 * 图片设施或者设备
 */
export enum QueryImgTypeEnum {
  /**
   * 设施图片
   */
  device = '1',
  /**
   * 设备图片
   */
  equipment = '2'
}

/**
 * 是否全选
 */
export enum IsSelectAllItemEnum {
  // 是
  isSelectAll = '1',
  // 否
  unSelectAll = '0'
}

/**
 * 剩余天数class
 */
export enum LastDaysIconClassEnum {
  // 1-3天（包括3天）
  lastDay_1 = 'last-1',
  // 大于3天
  lastDay_2 = 'last-2',
  // 小于等于1天
  lastDay_3 = 'last-3',
}

/**
 * 故障来源
 */
export enum SourceTypeEnum {
  // 告警
  alarm = '1',
  // 故障
  trouble = '2',
}


/**
 * 巡检任务状态
 */
export enum InspectionTaskStatusEnum {
  // 未巡检
  notInspected = '1',
  // 巡检中
  duringInspection = '2',
  // 已完成
  completed = '3',
}

/**
 * 巡检任务状态class
 */
export enum TaskStatusIconEnum {
  /**
   * 未巡检
   */
  notInspected = 'fiLink-processed',
  /***
   * 巡检中
   */
  duringInspection = 'fiLink-processing',
  /**
   * 已完成
   */
  completed = 'fiLink-completed-o'
}

/**
 * 工单巡检结果
 */
export enum WorkOrderResultEnum {
  // 正常
  normal = '0',
  // 异常
  abnormal = '1',
}

/**
 * 启用状态
 */
export enum EnableStatusEnum {
  // 禁用
  disable = '0',
  // 启用
  enable = '1',
}

/**
 * 启用权限
 */
export enum EnablePermissionEnum {
  // 禁用code
  disable = '06-1-2-7',
  // 启用code
  enable = '06-1-2-6',
}

/**
 * 是否巡检全集
 */
export enum IsSelectAllEnum {
  // 是
  right = '1',
  // 否
  deny = '0',
}

/**
 * 多工单class
 */
export enum MultiWorkOrder {
  // 是
  right = 'fiLink-success multi-1',
  // 否
  deny = 'fiLink-fail multi-0',
}


/**
 * 剩余天数颜色
 */
export enum LastDayColorEnum {
  // 超过期望完工时间
  overdueTime = '#FF0000',
  // 剩余天数小于3天
  estimatedTime = '#ffc63d'
}

/**
 * 故障原因code
 */
export enum WorkOrderErrorReasonCodeEnum {
  // 0 其他
  other = '0',
  // 1 人为损坏
  personDamage = '1',
  // 2 道路施工
  RoadConstruction = '2',
  // 3 盗穿
  stealWear = '3',
  // 4 销障
  clearBarrier = '4'
}

/**
 * 故障原因名称
 */
export enum WorkOrderErrorReasonNameEnum {
  // 其他
  other = 'other',
  // 人为损坏
  personDamage = 'personDamage',
  // 道路施工
  RoadConstruction = 'RoadConstruction',
  // 盗穿
  stealWear = 'stealWear',
  // 销障
  clearBarrier = 'clearBarrier'
}

/**
 * 处理code
 */
export enum WorkOrderProcessingSchemeCodeEnum {
  // 0-其他（对应故障原因-其他)
  other = '0',
  // 1-报修（对应故障原因-人为损坏，道路施工，盗穿）
  repair = '1',
  // 2 - 现场销障（对应故障原因-销障）
  destruction = '2'
}

/**
 * 处理name
 */
export enum WorkOrderProcessingSchemeNameEnum {
  // 其他
  other = 'other',
  // 报修
  repair = 'repair',
  // 现场销障
  destruction = 'destruction'
}

/**
 * 退单原因code
 */
export enum WorkOrderSingleBackReasonCodeEnum {
  other = '0', // 0 其他
  FalsePositives = '1' // 1人为损坏
}

/**
 * 退单原因name
 */
export enum WorkOrderSingleBackReasonNameEnum {
  other = 'other',
  FalsePositives = 'FalsePositives'
}

/**
 * 来源
 */
export enum ResourceTypeEnum {
  // 手动添加
  manuallyAdd = '1',
}

/**
 * 异常情况
 */
export enum WorkOrderNormalAndAbnormalEnum {
  // 正常
  normal = 'normal',
  // 异常
  abnormal = 'abnormal'
}

/**
 * 是否删除
 */
export enum IsDeleteEnum {
  // 已删除
  deleted = '1',
  // 未删除
  unDelete = '0',
}

/**
 * 业务状态
 */
export enum OrderBusinessStatusEnum {
  //  释放
  release = '1',
  // 锁定
  lockEquipment = '2'
}

/**
 * 退单原因
 */
export enum ReasonForChargeback {
  // 其他
  other = '0',
  // 误报
  falsePositive = '1'
}
