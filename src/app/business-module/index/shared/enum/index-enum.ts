/**
 * 操作记录返回数据转换
 */
export enum ResultItemEnum {
  /**
   * 成功
   */
  success = 'success',
  /**
   * 失败
   */
  failure = 'failure',
}

/**
 * 首页详情卡安装数量和空闲数量
 */
export enum IndexInstallNumEnum {
  /**
   * 安装数量
   */
  installNum = '1',
  /**
   * 空闲数量
   */
  freeNum = '2'
}

/**
 * 分组操作
 */
export enum IndexGroupTypeEnum {
  /**
   * 当前分组
   */
  current = '1',
  /**
   * 新增分组
   */
  create = '2'
}


/**
 * 地图分层类型
 */
export enum IndexCoverageTypeEnum {
  /**
   * 设施分层
   */
  facility = '1',
  /**
   * 设备分层
   */
  device = '2'
}


/**
 * 地图分层步骤条
 */
export enum StepIndexEnum {
  /**
   * 上一步
   */
  back = 0,
  /**
   * 设备分层
   */
  next = 1
}

/**
 * 详情卡权限Code
 */
export enum DetailCode {
  /**
   * 设施详情
   */
  detail = 'detail',
  /**
   * 基本设施操作
   */
  operation = 'operation',
  /**
   * 设施告警
   */
  alarm = 'alarm',
  /**
   * 设施工单
   */
  workOrder = 'workOrder',
  /**
   * 设备日志
   */
  equipmentLog = 'equipmentLog',
  /**
   * 操作日志
   */
  operationLog = 'operationLog',
  /**
   * 设施图片
   */
  photo = 'photo',
  /**
   * 挂载设备列表
   */
  equipmentList = 'equipmentList',
  /**
   * 设备上报状态
   */
  sensor = 'sensor',
  /**
   * 智能门禁详情
   */
  smartAccessControlDetail = 'smartAccessControlDetail',
}

export enum DeviceTabListEnum {
  tabArea = 'tabArea',
  facilityTypeTitle = 'facilityTypeTitle',
  equipmentTypeTitle = 'equipmentTypeTitle',
  group = 'group',
  selectRent = 'selectRent',
  workOrderType = 'workOrderType',
  workOrderStatus = 'workOrderStatus',
  constructionStatus = 'constructionStatus',
  smartPoleModel = 'smartPoleModel',
  smartPoleModelPlanning = 'smartPoleModelPlanning',
  constructionStatusPlanning = 'constructionStatusPlanning',
  smartPoleModelProject = 'smartPoleModelProject',
  constructionStatusProject = 'constructionStatusProject',
  planning = 'planning',
  project = 'project',
}

/**
 * 全部分组或已选分组
 */
export enum GroupTypeEnum {
  allGroup = 'allGroup',
  selectedGroup = 'selectedGroup'
}
