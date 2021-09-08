/**
 * 光缆设施类型
 */
export enum CableDeviceTypeEnum {
  // 光交箱(有锁)(有智能标签)
  Optical_Box = '001',
  // 配线架(有智能标签)
  Distribution_Frame = '060',
  // 接头盒(有智能标签)
  Junction_Box = '090',
}

/**
 * 光缆拓扑结构
 */
export enum TopologyTypeEnum {
  // 环形
  ring = '0',
  // 非环形
  nonCircular = '1',
}

/**
 * 布线类型
 */
export enum WiringTypeEnum {
  // 递减
  decrement = '0',
  // 不递减
  notDecrementing = '1',
}

/**
 * 光缆段状态
 */
export enum CableSectionStatusEnum {
  // 使用
  use = '0',
  // 未使用
  doNotUse = '1',
}

// 熔纤本对端框和光缆段
export enum CoreCableTypeEnum {
  // 本端光缆框
  localBox = 'localBox',
  // 对端光缆框
  peerBox = 'peerBox',
  // 本端光缆段起始端
  localCableStart = 'localCableStart',
  // 本端光缆段尾端
  localCableEnd = 'localCableEnd',
  // 对端光缆段起始端
  peerCableStart = 'peerCableStart',
  // 对端光缆段尾端
  peerCableEnd = 'peerCableEnd',
}

/**
 * 配件类型
 */
export enum PartsTypeEnum {
  bluetoothKey = '1',
  mechanicalKey = '2',
  labelGun = '3'
}

/**
 * 编号规则
 */
export enum TemplateCodeRuleEnum {
  // 左上
  leftUp = 0,
  // 左下
  leftDown = 1,
  // 右上
  rightUp = 2,
  // 右下
  rightDown = 3
}

/**
 * 走向
 */
export enum TemplateTrendEnum {
  // 列有
  templateTrendCol = 0,
  // 行优
  templateTrendRow = 1
}

/**
 * 设备日志类型
 */
export enum LogTypeEnum {
  event = '1',
  // alarm: '2'
}

/**
 * 熔纤设施类型转化
 */
export enum CoreDeviceTypeEnum {
  // 光交箱
  opticalBox = 'optical box',
  // 接头盒
  junctionBox = 'junction box',
  // 配线架
  DistributionFrame = 'distribution frame',
  // 光交箱
  optical_box = 'D001',
  // 接头盒
  junction_box = 'D090',
  // 配线架
  Distribution_Frame = 'D060'
}
