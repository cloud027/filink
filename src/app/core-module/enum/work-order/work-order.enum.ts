/**
 * 工单类型
 */

export enum IndexWorkOrderTypeEnum {
  /**
   * 巡检
   */
  inspection = 'inspection',
  /**
   * 销障
   */
  clearFailure = 'clear_failure',
  /**
   * 告警确认
   */
  confirm = 'confirm',
  /**
   * 安装
   */
  install = 'proc_install',
  /**
   * 拆除
   */
  removal = 'removal',
  remove = 'remove'
}

/**
 * 工单状态
 */
export enum IndexWorkOrderStateEnum {
  /**
   * 待处理
   */
  pending = 'pending',
  /**
   * 已退单
   */
  singleBack = 'singleBack',
  /**
   * 待指派
   */
  assigned = 'assigned',
  /**
   * 处理中
   */
  processing = 'processing',
  /**
   * 已完成
   */
  completed = 'completed',
  /**
   * 已转派
   */
  turnProcess = 'turnProcess',
}

/**
 * 数据来源
 */
export enum WorkOrderResourceEnum {
  /**
   * 告警
   */
  alarm = '1',
  /**
   * 故障
   */
  trouble = '2'
}

export enum  WorkOrderStatusEnum {
  // 待指派
  assigned = 'assigned',
  // 待处理
  pending = 'pending',
  // 处理中
  processing = 'processing',
  // 已完成
  completed = 'completed',
  // 已退单
  singleBack = 'singleBack',
  // 已转派
  turnProcess = 'turnProcess'
}

export enum  WorkOrderStatusClassEnum {
  assigned = 'fiLink-assigned-w statistics-assigned-color',
  pending = 'fiLink-processed statistics-pending-color',
  processing = 'fiLink-processing statistics-processing-color',
  turnProcess = 'fiLink-turnProcess-icon statistics-turnProcess-color',
  completed = 'fiLink-completed statistics-completed-color',
  singleBack = 'fiLink-chargeback statistics-singleBack-color',
}

/**
 * 工单审核状态
 */
export enum WorkOrderStateStatusEnum {
  // 待指派
  assigning = '0',
  // 已指派
  assigned = '1',
  // 审核中
  underReview = '2',
  // 已完成
  completed = '3',
  // 已退单
  chargeback = '4',
  // 已取消
  cancelled = '5'
}

/**
 * 是否
 */
export enum WhetherEnum {
  // 是
  right = '1',
  // 否
  deny = '0',
}

/**
 * 工单类型
 */
export enum IndexWorkOrderTypeStatisticsEnum {
  /**
   * 巡检
   */
  inspectOrder = 'INSPECTION',
  /**
   * 销障
   */
  clearBarrier = 'CLEAR_FAILURE',
  /**
   * 告警确认
   */
  alarmConfirm = 'PROC_CONFIRM',
  /**
   * 安装
   */
  installation = 'PROC_INSTALL',
  /**
   * 拆除
   */
  procRemove = 'REMOVE'
}
