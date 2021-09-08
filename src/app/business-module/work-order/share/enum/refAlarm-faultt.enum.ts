/**
 * 告警/故障类型
 */
export enum RefAlarmFaultEnum {
  /**
   * 告警
   */
  alarm= 'alarm',
  /**
   * 故障
   */
  fault = 'fault'
}

/**
 * 巡检对象搜索
 */
export enum SearchConditionEnum {
  /**
   * 设施搜索条件
   */
  deviceType= 'deviceType',
  /**
   * 地址搜索条件
   */
  addressType = 'addressType'
}

/**
 * 告警确认状态
 */
export enum WorkOrderAlarmConfirmStatusEnum {
  /**
   * 已确认
   */
  isConfirm = '1',
  /**
   * 未确认
   */
  noConfirm = '2',
}

/**
 * 告警清除状态
 */
export enum WorkOrderAlarmCleanStatusEnum {
  /**
   * 已清除
   */
  cleared = '1',
  /**
   * 设备清除
   */
  deviceClean = '2',
  /**
   * 未清除
   */
  noClean = '3',
}

/**
 * 告警评分背景色选择
 */
export enum WorkOrderAlarmEvaluateEnum {
  /**
   * 0星评价
   */
  zeroStar = '0',
  /**
   * 1星评价
   */
  oneStar = '1',
  /**
   * 2星评价
   */
  twoStar = '2',
  /**
   * 3星评价
   */
  threeStar = '3',
  /**
   * 4星评价
   */
  fourStar = '4',
  /**
   * 5星评价
   */
  fiveStar = '5',
}

/**
 * 销障工单剩余天数背景色选择
 */
export enum WorkOrderRemainDaysEnum {
  /**
   * 剩余天数小于1的状态
   */
   lessThanOneDays = '1',
  /**
   * 剩余天数小于1～3的状态
   */
   lessThanThreeDays = '2',
  /**
   * 剩余天数大于3的状态
   */
  moreThreeDays = '3',
}

/**
 * 销障工单节点
 */
export enum WorkOrderNodeEnum {
  /**
   * 节点1
   */
  oneNode = 'sid-528B7184-B251-4556-A6BC-293385BF0CCA',
  /**
   * 节点2
   */
  twoNode = 'sid-C4B4A170-C173-4EAC-95C5-3871C99AE6DF',
  /**
   * 节点3
   */
  threeNode = 'sid-2D4C5B6D-A68D-41FD-A0D9-7779525F0E97',
  /**
   * 节点4
   */
  fourNode = 'sid-889B319A-0BE1-498C-AD4F-3C5794683914',
  /**
   * 节点5
   */
  fiveNode = 'sid-0FC7F325-66DC-402D-99CA-E480C370F85B',
  /**
   * 节点6
   */
  sixNode = 'sid-685F95E0-9706-4E42-9E71-5FFCC9EDA10E',
  /**
   * 节点7
   */
  sevenNode = 'sid-94C31000-7BF9-4BFF-89C7-313ED5C0E11D',
  /**
   * 节点8
   */
  eightNode = 'sid-7EF192AF-9381-4455-BA0D-9F57357B4DCA',
  /**
   * 节点9
   */
  nineNode = 'sid-A92BB01F-33F7-41A9-AB92-1220C409AC01',
  /**
   * 节点10
   */
  tenNode = 'sid-261B1F5C-840F-44BA-B02C-C0730AC7EBAF',
  /**
   * 节点11
   */
  elevenNode = 'sid-856121C2-4BA0-4323-8FA3-3075F83DD493',
  /**
   * 节点12
   */
  twelevNode = 'sid-9101F8C2-153C-4A11-974C-7E2C24EA4FA5',
}
/**
 * 销障工单反映射
 */
export enum WorkOrderNodeShineEnum {
  /**
   * 节点1
   */
  oneNode = '01',
  /**
   * 节点2
   */
  twoNode = '02',
  /**
   * 节点3
   */
  threeNode = '03',
  /**
   * 节点4
   */
  fourNode = '04',
  /**
   * 节点5
   */
  fiveNode = '05',
  /**
   * 节点6
   */
  sixNode = '06',
  /**
   * 节点7
   */
  sevenNode = '07',
  /**
   * 节点8
   */
  eightNode = '08',
  /**
   * 节点9
   */
  nineNode = '09',
  /**
   * 节点10
   */
  tenNode = '10',
  /**
   * 节点11
   */
  elevenNode = '11',
  /**
   * 节点12
   */
  twelveNode = '12',
}

/**
 * 告警清除
 */
export enum AlarmCleansStatusEnum {
  // 已清除
  isClean = 1,
  // 设备清除
  deviceClean = 2,
  // 未清除
  noClean = 3,
}
/**
 * 告警确认状态
 */
export enum AlarmConfirmStatusNumberEnum {
  /**
   * 已确认
   */
  isConfirm = 1,
  /**
   * 未确认
   */
  noConfirm = 2,
}

/**
 * 设施或者设备
 */
export enum FacilitiesTypeEnum {
  // 设施
  idDevice = 1,
  // 设备
  isEquip = 2,
}
