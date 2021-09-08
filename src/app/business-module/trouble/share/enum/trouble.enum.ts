/**
 * 指派类型
 */
export enum DesignateTypeEnum {
  // 初始指派
  initial = '0',
  // 责任上报
  duty = '1',
  // 上报分管领导
  reportResponsibleLeaders = '2',
  // 故障打回
  troubleRepulse = '3',
  // 协调成功
  coordinateSuccessful = '4',
  // 协调不成功强制指派
  coordinateFailConstraint = '5',
  // 协调不成功
  coordinateFail = '6',
}

/**
 * 指派原因
 */
export enum DesignateReasonEnum {
  // 初始指派
  initial = '0',
  // 指派错误，需重新指派
  againDesignate = '1',
  // 责任无法确定,需上级协调
  coordinate = '2',
  // 其他
  other = '3',
}

/**
 * 故障卡片切换，故障提示码
 */
export enum TroubleHintListEnum {
  // 故障级别
  troubleLevelCode = 1,
  // 故障设施类型
  troubleFacilityTypeCode = 2
}

/**
 * 是否展示责任单位
 */
export const IsShowUintEnum = {
  // 是
  yes: '0',
  // 否
  no: '1'
};

/**
 * 图片页签
 */
export enum ImageTabsEnum {
  // 工单执行前
  orderExecuteBefore = '1',
  // 工单执行后
  orderExecuteAfter = '2',
  // 告警图片
  alarmImage = '3'
}


// -------------------------------------------故障统计-----------------------------------------
/** 故障统计类型 后端返回的 字段名称 */
export enum TroubleStatisticTypeEnum {
  /** 故障来源 */
  faultSource = 'troubleSource',
  /** 故障类型 */
  faultType = 'troubleType',
  /** 故障级别 */
  faultLevel = 'troubleLevel',
  /** 设施类型 */
  facilityType = 'deviceType',
  /** 设备类型 */
  equipmentType = 'equipmentType',
}
/** 传递给后端的字段 */
export enum TranKeyEnum {
  /** 故障来源 */
  faultSource = 'troubleSourceList',
  /** 故障类型 */
  faultType = 'troubleTypeList',
  /** 故障级别 */
  faultLevel = 'troubleLevelList',
  /** 设施类型 */
  facilityType = 'deviceTypeList',
  /** 设备类型 */
  equipmentType = 'equipmentTypeList',
}
/** 统计请求的 URL 地址 */
export enum RequestURLTypeEnum {
  /** 故障来源 */
  faultSource = 'queryTroubleSourceCount',
  /** 故障类型 */
  faultType = 'queryTroubleTypeCount',
  /** 故障级别 */
  faultLevel = 'queryTroubleLevelCount',
  /** 设施类型 */
  facilityType = 'queryTroubleDeviceTypeCount',
  /** 设备类型 */
  equipmentType = 'queryTroubleEquipmentTypeCount',
}

/** 表格 导出的 URL 地址 */
export enum TableExportUrlEnum {
  /** 故障来源 */
  faultSource = 'exportTroubleSourceCount',
  /** 故障类型 */
  faultType = 'exportTroubleTypeCount',
  /** 故障级别 */
  faultLevel = 'exportTroubleLevelCount',
  /** 设施类型 */
  facilityType = 'exportTroubleDeviceTypeCount',
  /** 设备类型 */
  equipmentType = 'exportTroubleEquipmentTypeCount',
}

/** 导出需要的字段  */
export enum TroubleExportKeyEnum {
  // ---------------------------故障来源----------------------------------
  /**
   * app报修
   */
  'App' = 'appRepairCount',

  /**
   * 投诉
   */
  'complaint' = 'complaintCount',

  /**
   * 告警
   */
  'alarm' = 'alarmCount',

  // ---------------------------故障类型----------------------------------
  /**
   * 通信故障
   */
  'troubleType-1' = 'communicationCount',

  /**
   * 业务质量故障
   */
  'troubleType-2' = 'businessCount',

  /**
   * 环境故障
   */
  'troubleType-3' = 'environmentCount',

  /**
   * 电力故障
   */
  'troubleType-4' = 'electricityCount',

  /**
   * 安全故障
   */
  'troubleType-5' = 'securityCount',

  /**
   * 设备故障
   */
  'troubleType-6' = 'equipmentCount',

  // ---------------------------故障级别----------------------------------
  /**
   * 紧急
   */
  'troubleLevel-1' = 'level1Count',

  /**
   * 主要
   */
  'troubleLevel-2' = 'level2Count',

  /**
   * 次要
   */
  'troubleLevel-3' = 'level3Count',

  /**
   * 提示
   */
  'troubleLevel-4' = 'level4Count',
  // ---------------------------故障设施----------------------------------
  /**
   * 光交箱
   */
  'D001' = 'opticalBoxCount',

  /**
   * 人井
   */
  'D004' = 'wellCount',

  /**
   * 配线架
   */
  'D006' = 'distributionFrameCount',

  /**
   * 接头盒
   */
  'D007' = 'junctionBoxCount',

  /**
   * 室外柜
   */
  'D005' = 'outdoorCabinetCount',

  /**
   * 配电箱
   */
  'D003' = 'distributionPanelCount',

  /**
   * 智慧杆
   */
  'D002' = 'wisdomCount',

  // ---------------------------故障设备----------------------------------
  /**
   * 网关
   */
  'E001' = 'gatewayCount',

  /**
   * 广播
   */
  'E006' = 'broadCastCount',

  /**
   * 环境监测
   */
  'E013' = 'environmentalMonitoringCount',
  /**
   * 集中控制器
   */
  'E003' = 'centralCount',

  /**
   * 单灯控制器
   */
  'E002' = 'singleCount',

  /**
   * 信息屏
   */
  'E004' = 'screenCount',

  /**
   * 摄像头
   */
  'E005' = 'cameraCount',
  /**
   * 一键呼叫
   */
  'E030' = 'oneTouchCallingCount',

  /**
   * 智能门禁锁
   */
  'E012' = 'lockCount',
}
// -------------------------------------------故障统计-----------------------------------------
