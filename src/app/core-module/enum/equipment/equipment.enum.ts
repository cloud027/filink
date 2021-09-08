/**
 * 设备详情卡片code
 */
export enum DynamicDetailCardEnum {
  // 基本详情
  detail = 'detail',
  // 基本操作
  operate = 'operation',
  // 上报状态
  reportStatus = 'sensor',
  // 传感器列表
  sensorList = 'sensorList',
  // 设备告警
  alarm = 'alarm',
  // 设备工单
  equipmentOrder = 'workOrder',
  // 设备日志
  equipmentLog = 'equipmentLog',
  // 操作日志
  operateLog = 'operationLog',
  // 设备图片
  equipmentImg = 'photo',
  // 设备挂载
  mountEquipment = 'equipmentList',
  // 智能门禁详情(有没有主控)
  intelligentEntranceGuard = 'smartAccessControlDetail',
  // 无源锁
  passiveLock = 'passiveLock',
  // 智能标签详情
  intelligentLabelDetail = 'rfid',
  // 设施有配置智能标签
  intelligentLabelSetting = 'deployBusInfo',
}

/**
 * 设备类型
 */
export enum EquipmentTypeEnum {
  // 网关
  gateway = 'E001',
  // 单灯控制器
  singleLightController = 'E002',
  // 集中控制器
  centralController = 'E003',
  // 信息屏
  informationScreen = 'E004',
  // 摄像头
  camera = 'E005',
  // 广播
  broadcast = 'E006',
  // 无线AP
  wirelessAp = 'E007',
  // 环境监测仪
  environmentalMonitor = 'E008',
  // 充电桩
  chargingPile = 'E009',
  // 一键报警器
  oneButtonAlarm = 'E010',
  // 5g微基站
  baseStation = 'E011',
  // 智能门禁锁
  intelligentEntranceGuardLock = 'E012',
  // 微气象仪
  weatherInstrument = 'E013',
  // 温度传感器
  temperatureSensor = 'S001',
  // 湿度传感器
  humiditySensor = 'S002',
  // 门位开关
  gatePositionSwitch = 'S003',
  // 烟雾传感器
  smokeSensor = 'S004',
  // 水浸传感器
  floodingSensor = 'water',
  // 一键呼叫
  oneTouchCalling = 'E030',
  // 温湿传感器
  temperatureHumiditySensor = 'S006',
}

/**
 * 设备状态权重
 */
export enum EquipmentStatusSortEnum {
  // 失联
  outOfContact = 1,
  // 下线
  offline = 2,
  // 故障
  break = 3,
  // 告警
  alarm = 4,
  // 正常在线
  online = 5,
  // 未配置
  unSet = 6,
  // 已拆除
  dismantled = 7,
}

export enum portTypeEnum {
  communication = 'communication',
  electric = 'electric'
}

/**
 * 设备状态
 */
export enum EquipmentStatusEnum {
  // 未配置
  unSet = '1',
  // 正常在线
  online = '2',
  // 告警
  alarm = '3',
  // 故障
  break = '4',
  // 下线
  offline = '5',
  // 失联
  outOfContact = '6',
  // 已拆除
  dismantled = '7'
}
/**
 * 设备状态
 */
export enum EquipmentEnumStatus {
  // 未配置
  unSet = '1',
  // 正常在线
  online = '2',
  // 告警
  alarm = '3',
  // 故障
  break = '4',
  // 下线
  offline = '5',
  // 失联
  outOfContact = '6',
  // 已拆除
  // dismantled = '7'
}

/**
 * 设备状态
 */
 export enum DismantleEquipmentStatusEnum {
    // 已拆除
    dismantled = '7'
  }

/**
 * 设备状态
 */
export enum CommunicationEquipmentStatusEnum {
    // 未配置
    unSet = '1',
    // 正常在线
    online = '2',
    // 告警
    alarm = '3',
    // 故障
    break = '4',
    // 下线
    offline = '5',
    // 失联
    outOfContact = '6',
    // 已拆除
    // dismantled = '7'
  }

/**
 * 设备权重
 */
export enum EquipmentSortEnum {
  // 网关
  gateway = 1,
  // 信息屏
  informationScreen = 2,
  // 摄像头
  camera = 3,
  // 单灯控制器
  singleLightController = 4,
  // 集中控制器
  centralController = 5,
  // 智能门禁锁
  intelligentEntranceGuardLock = 6

}

/**
 *  告警类型tab
 */
export enum AlarmTypeEnum {
  // 当前告警
  current = 'current',
  // 历史告警
  history = 'history'
}

/**
 * 统计类型
 */
export enum StatisticsTypeEnum {
  /**
   * 设备统计方式
   */
  equipment = '0',
  /**
   * 设施统计方式
   */
  facility = '1'
}

/**
 * 业务状态
 */
export enum BusinessStatusEnum {
  //  释放
  release = '1',
  // 锁定
  lockEquipment = '2'
}

/**
 *  查询分组信息列表的类型
 */
export enum QueryGroupTypeEnum {
  // 设施
  device = 'device',
  // 设备
  equipment = 'equipment'
}

/**
 * 摄像头类型枚举
 */
export enum CameraTypeEnum {
  // 枪机摄像头
  gCamera = '1',
  // 球机摄像头
  bCamera = '2'
}

/**
 * 一键呼叫类型枚举
 */
export enum CallTypeEnum {
  // 话筒
  microphone = '1',
  // 对讲机
  interphone = '2'
}

/**
 * 设备图标枚举
 */
export enum EquipmentStatusIconEnum {
  // 未配置
  unSet = 'un-set',
  // 正常在线
  online = 'normal',
  // 告警
  alarm = 'alarm-status',
  // 故障
  break = 'break',
  // 下线
  offline = 'offline',
  // 失联
  outOfContact = 'out-of-contact',
  // 已拆除
  dismantled = 'dismantled',
}

/**
 * 设备类型图标枚举
 */
export enum EquipmentTypeIconEnum {
  // 网关
  gateway = 'gateway',
  // 单灯控制器
  singleLightController = 'singlelightcon',
  // 集中控制器
  centralController = 'centralwlancon',
  // 信息屏
  informationScreen = 'informationboard',
  // 枪型摄像头
  camera = 'camera',
  // 门禁电子锁
  intelligentEntranceGuardLock = 'accesslock',
  // 广播
  broadcast = 'broadcasts',
  // 无线Ap
  wirelessAp = 'wireless-ap',
  // 环境监测仪
  environmentalMonitor = 'environmental-monitor',
  // 充电桩
  chargingPile = 'chargingPile',
  // 一键报警器
  oneButtonAlarm = 'alarm-fast',
  // 5g微基站
  baseStation = 'base-station',
  // 微气象仪
  weatherInstrument = 'weather-instrument',
  // 广播
  // broadcast = 'filink-guangbo-icon',
  /** 环境监测仪 */
  // environmentalMonitor = 'filink-huanjingjiance-icon',
  smartPower = 'filink-dianbiao-icon',
  // oneTouchCalling = 'alarm-fast',
  oneTouchCalling = 'filink-duijiangji-icon',
}

/**
 * 设备类型名称枚举
 */
export enum IndexEquipmentTypeNameEnum {
  /**
   * 网关
   */
  gateway = '网关',
  /**
   * 单灯控制器
   */
  singleLampController = '单灯控制器',
  /**
   * 集中控制器
   */
  centralizedController = '集中控制器',
  /**
   * 信息屏
   */
  informationScreen = '信息屏',
  /**
   * 摄像头
   */
  camera = '摄像头',
  /**
   * 广播
   */
  broadcast = '广播',
  /**
   * 无线AP
   */
  wirelessAP = '无线AP',
  /**
   * 环境监测仪
   */
  environmentalMonitor = '环境监测仪',
  /**
   * 充电桩
   */
  chargingPile = '充电桩',
  /**
   * 一键报警器
   */
  oneKeyAlarm = '一键报警器',
  /**
   * 5G微基站
   */
  MicroBaseStation = '5G微基站',
}


/**
 * 设备状态
 */
export enum equipmentStatusNameEnum {
  unconfigured = '1',   // 未配置
  normal = '2',    // 正常/在线
  alarm = '3',     // 告警
  fault = '4',     // 故障
  offline = '5',   // 离线
  lost = '6',    // 失联
  removed = '7',    // 已拆除
  selected = '0',   // 自定义状态，页面选中
}

export enum equipmentStatusRankNameEnum {
  unconfigured = 'unconfigured',   // 未配置
  normal = 'normal',    // 正常/在线
  alarm = 'alarm',     // 告警
  fault = 'fault',     // 故障
  offline = 'offline',   // 离线
  lost = 'lost',      // 失联
  removed = 'removed',    // 已拆除
  selected = 'selected',   // 自定义状态，页面选中
}

/**
 * 设备状态权重
 */
export enum equipmentStatusSortEnum {
  // 失联
  lost = '6',
  // 下线
  offline = '5',
  // 故障
  fault = '4',
  // 告警
  alarm = '3',
  // 正常在线
  normal = '2',
  // 未配置
  unconfigured = '1',
  // 已拆除
  removed = '7',
}

export enum equipmentStatusSortRankEnum {
  // 失联
  lost = 1,
  // 下线
  offline = 2,
  // 故障
  fault = 3,
  // 告警
  alarm = 4,
  // 正常在线
  normal = 5,
  // 未配置
  unconfigured = 6,
  // 已拆除
  removed = 7,
}


/**
 * 设备状态
 */
export enum equipmentTypeNameEnum {
  gateway = 'E001',   // 网关
  singlelightcon = 'E002',    // 单灯控制器
  centralwlancon = 'E003',       // 集中控制器
  informationboard = 'E004',      // 信息屏
  camera = 'E005',   // 摄像头
  accesslock = 'E012', // 智能门禁锁
  broadcast = 'E006', // 广播
  weatherInstrument = 'E013', // 微气象仪
  oneButtonAlarm = 'E010',   // 一键报警器
  oneTouchCalling = 'E030',   // 一键呼叫
}

export enum equipmentTypeRankNameEnum {
  gateway = 'gateway',   // 网关
  singlelightcon = 'singlelightcon',    // 单灯控制器
  centralwlancon = 'centralwlancon',       // 集中控制器
  informationboard = 'informationboard',      // 信息屏
  accesslock = 'accesslock',   // 智能门禁锁
  camera = 'camera',   // 摄像头
  broadcast = 'broadcast', // 广播
  weatherInstrument = 'weatherInstrument', // 微气象仪
  oneButtonAlarm = 'oneButtonAlarm',   // 一键报警器
  oneTouchCalling = 'oneTouchCalling',   // 一键呼叫
}

/**
 * 云平台
 */
export enum CloudPlatFormEnum {
  // 0 电信云
  telecomCloud = '0',
  // 1 移动云
  mobileCloud = '1',
  // 2 私有云
  privateCloud = '2'
}


