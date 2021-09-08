/**
 * 设施类型枚举
 */

export enum DeviceTypeEnum {
  // 光交箱(有锁)(有智能标签)
  opticalBox = 'D001',
  // 智慧杆
  wisdom = 'D002',
  // 配电箱
  distributionPanel = 'D003',
  // 人井(有锁)
  well = 'D004',
  // 室外柜 (有锁)
  outdoorCabinet = 'D005',
  // 配线架(有智能标签)
  distributionFrame = 'D006',
  // 接头盒(有智能标签)
  junctionBox = 'D007'
}

/**
 * 设施类型图标枚举
 */
export enum DeviceTypeIconEnum {
  // 光交箱(有锁)(有智能标签)
  opticalBox = 'opticalBox',
  // 智慧杆
  wisdom = 'wisdom',
  // 配电箱
  distributionPanel = 'distributionPanel',
  // 人井(有锁)
  well = 'manWell',
  // 室外柜 (有锁)
  outdoorCabinet = 'outDoorCabinet',
  // 配线架(有智能标签)
  distributionFrame = 'patchPanel',
  // 接头盒(有智能标签)
  junctionBox = 'jointClosure'
}

/**
 * sim卡套餐
 */
export enum SimPackageTypeEnum {
  // 1年
  oneYear = '1',
  // 3年
  threeYear = '3',
  // 5年
  fiveYear = '5',
}

/**
 * 设施状态枚举
 */
export enum DeviceStatusEnum {
  // 未知
  unknown = '1',
  // 正常
  normal = '2',
  // 告警
  alarm = '3',
  // 故障
  break = '4',
  // 失联
  outOfContact = '6',
  // 离线
  offline = '5',
  // 已拆除
  // dismantled = '7', // 暂时没有这个状态
}
export enum DeviceDetailStatusEnum {
    // 未知
    unknown = '1',
    // 正常
    normal = '2',
    // 告警
    alarm = '3',
    // 故障
    break = '4',
    // 失联
    outOfContact = '6',
    // 离线
    offline = '5',
    // 已拆除
    dismantled = '7', // 暂时没有这个状态
  }


/**
 * 设施状态枚举
 */
 export enum DismantleDeviceStatusEnum {
    // // 未知
    // unknown = '1',
    // // 正常
    // normal = '2',
    // // 告警
    // alarm = '3',
    // // 故障
    // break = '4',
    // // 失联
    // outOfContact = '6',
    // // 离线
    // offline = '5',
    // 已拆除
    dismantled = '7',
  }

/**
 * 设施排序类型
 */
export enum DeviceSortEnum {
  // 智慧杆
  pole = 'D002',
  // 配电箱
  box = 'D003',
}

/**
 * 设施权重序号
 */
export enum DeviceSortWeightEnum {
  // 光交箱(有锁)(有智能标签)
  opticalBox = 1,
  // 智慧杆
  wisdom = 2,
  // 配电箱
  distributionPanel = 3,
  // 人井(有锁)
  well = 4,
  // 室外柜 (有锁)
  outdoorCabinet = 5,
  // 配线架(有智能标签)
  distributionFrame = 6,
  // 接头盒(有智能标签)
  junctionBox = 7
}

/**
 * 设施状态图标
 */
export enum DeviceStatusIconEnum {
  // 未配置
  unknown = 'unknown',
  // 正常在线
  normal = 'normal',
  // 告警
  alarm = 'alarm',
  // 故障
  break = 'break',
  // 失联
  outOfContact = 'lost',
  // 离线
  offline = 'offline',
  // 已拆除
  dismantled = 'dismantled',
}

/**
 * 设施状态
 */
export enum DeviceStatusNameEnum {
  // 未知
  unknown = '1',
  // 正常
  normal = '2',
  // 告警
  alarm = '3',
  // 故障
  fault = '4',
  // 已拆除
  removed = '5',
  // 失联
  lost = '6',
  // 页面选中
  selected = '0',
}


/**
 * 设施状态国际化转换
 */
export enum DeviceStatusNameRankEnum {
  // 未知
  unknown = 'unknown',
  // 正常
  normal = 'normal',
  // 告警
  alarm = 'alarm',
  // 故障
  fault = 'fault',
  // 已拆除
  removed = 'removed',
  // 失联
  lost = 'lost',
  // 页面选中
  selected = 'selected',
}


/**
 * 电子锁覆盖方式
 */
export enum WellCoverTypeEnum {
  // 内盖
  innerCover = '1',
  // 外盖
  outCover = '2',
}

/**
 * 部署状态枚举
 */
export enum DeployStatusEnum {
  // 无
  none = '0',
  // 已部防
  deployed = '1',
  // 未部防
  noDefence = '2',
  // 停用
  notUsed = '3',
  // 维护
  defend = '4',
  // 拆除
  dismantle = '5',
  // 部署中
  deploying = '6'
}

/**
 * 部署状态枚举
 */
export enum DeployStatusClassNameEnum {
  // 无
  none = '',
  // 已部防
  deployed = 'icon-l icon_deploy_arm',
  // 未部防
  noDefence = 'icon-l icon_deploy_unarm',
  // 停用
  notUsed = 'icon-l icon_deploy_disable',
  // 维护
  defend = 'icon-l icon_deploy_maintain',
  // 拆除
  dismantle = 'icon-l icon_deploy_remove',
  // 部署中
  deploying = 'iconfont icon-fiLink fiLink-deploying'
}

/**
 * 光缆级别枚举
 */
export enum CableLevelEnum {
  // 本地介入-主干光缆
  localInterventionTrunkCable = '0',
  // 本地接入-末端光缆
  localInterventionEndCable = '1',
  // 一级干线
  firstClassTrunk = '2',
  // 二级干线
  secondaryTrunk = '3',
  // 本地中继
  localRelay = '4',
  // 本地核心
  localCore = '5',
  // 本地汇聚
  localConvergence = '6',
  // 汇接层光缆
  tandemCable = '7',
  // 联络光缆
  contactCable = '8',
  // 局内光缆
  intraOfficeCable = '9',
}

/**
 * 设施传感值枚举
 */
export enum sensorValueEnum {
  temperature = 'temperature',
  humidity = 'humidity',
  electricity = 'electricity',
  lean = 'lean',
  leach = 'leach'
}

/**
 * 关注状态
 */
export enum IsCollectedEnum {
  /**
   * 关注
   */
  collected = '1',
  /**
   * 未关注
   */
  uncollected = '0'
}


/**
 * 设施状态
 */
export enum facilityStatusColourEnum {
  notConfigured = '#ffff00', // 未配置
  normal = '#36cfc9', // 正常
  Alert = '#ff0000', // 告警
  fault = '#ff6000', // 故障
  offline = '#898989', // 离线
  lost = '#cccdcd', // 失联
  demolished = '#6985e4', // 已拆除
  selected = '#8588e7',
}

export enum facilityStatusColourRankEnum {
  notConfigured = '1', // 未配置
  normal = '2', // 正常
  Alert = '3', // 告警
  fault = '4', // 故障
  offline = '5', // 离线
  lost = '6',  // 失联
  demolished = '7', // 已拆除
  selected = '0'
}

/**
 * 建设状态颜色
 */
export enum DeployStatusColourEnum {
  shouldBeBuilt = '#cccccc',
  underConstruction = '#8ecaf7',
  built = '#67d275',
}


export enum DeployRankStatusEnum {
  shouldBeBuilt = '1',
  underConstruction = '2',
  built = '3',
}

/**
 * 建设状态国际化
 */
export enum DeployNameEnum {
  // one = 'shouldBeBuilt',
  // two = 'underConstruction',
  // three = 'built',
  shouldBeBuilt = '1',
  underConstruction = '2',
  built = '3',
}

/**
 * 建设状态国际化
 */
export enum DeployRankNameEnum {
  shouldBeBuilt = '1',
  underConstruction = '2',
  built = '3',

}

/**
 * 设施设备列表
 */
export enum FacilityListTypeEnum {
  /**
   * 设施列表
   */
  facilitiesList = '1',
  /**
   * 设备列表
   */
  equipmentList = '2'
}

/**
 * 业务状态
 */
export enum BusinessStatusEnum {
  /**
   * 释放
   */
  freed = '1',
  /**
   * 占用
   */
  occupy = '2'
}


// 激活状态
export enum activeStatusEnum {
  // 休眠
  dormancy = '0',
  // 激活
  active = '1'
}

export enum moduleTypeName {
  G2 = '2G',
  NB = 'NB',
  G4 = '4G'
}

// 开锁状态
export enum lockStatusEnum {
  // 锁开
  lockOpen = '1',
  // 锁关
  lockOff = '2',
  // 锁失效
  lockInvalid = '0'
}

// 主控类型
export enum HostTypeEnum {
  // 无源锁
  PassiveLock = '0',
  // 机械锁芯
  MechanicalLock = '1',
  // 电子锁芯
  ElectronicLock = '2'
}

export enum moduleTypeCode {
  // 2G
  G2 = '1',
  // nb
  NB = '2',
  // 4G
  G4 = '3'
}

// 太阳能电池
export enum SolarCellEnum {
  // 已安装
  Installed = '0',
  // 未安装
  NotInstalled = '1',
  // 不支持
  notSupport = '2'
}

// 供电方式
export enum SourceTypeEnum {
  // 适配器
  adapter = '0',
  // 可充电电池
  rechargeableBattery = '1',
  // 不可充电电池
  NonRechargeableBattery = '2'
}

export enum OperatorEnum {
  //  移动
  mobile = '0',
  // 电信
  telecommunications = '1',
  // 联通
  Unicom = '2',
  // 未知
  unknown = '3'
}
