/**
 * 产品类型枚举
 */
export enum ProductTypeEnum {
  // 设施
  facility = 'device',
  // 设备
  equipment = 'equipment',
  // 其它
  other = 'other'
}

/**
 * 点位类型
 */
export enum PositionTypeEnum {
  // 固有点位
  fixedPoint = 'fixedPoint',
  // 可扩展点位
  expandPoint = 'expandPoint',
}

/**
 * 产品计量单位枚举
 */
export enum ProductUnitEnum {
  // 台
  station = 'station',
  // 件
  pieces = 'pieces',
}

/**
 * 网关端口类型枚举
 */
export enum PortTypeEnum {
  // 通信端口
  communication = 'communication',
  // 电力端口
  electric = 'electric'

}
/**
 * 模版类型
 */
export enum TemplateEnum {
  // 产品导入模版
  productImportTemplate = 'productImportTemplate',
  // 智慧杆上传点位配置模版
  polePointConfigTemplate = 'polePointConfigTemplate',
  // 网关配置模版
  gatewayConfigTemplate = 'gatewayPointConfigTemplate'
}
/**
 * 产品上传文件类型
 */
export enum ProductFileTypeEnum {
  // 杆型图
  pole = 1,
  // 网关图
  gateway = 2
}

/**
 * 电子锁类型枚举
 */
export enum LockTypeEnum {
  // 有源锁
  activeLock = '1',
  // 无源锁
  passiveLock = '0'
}

/**
 * 云平台类型
 */
export enum CloudPlatformTypeEnum {
  // 电信云
  telecomCloud=  '0',
  // 移动云
  mobileCloud  = '1',
  // 私有云
  privateCloud = '2'
}

/**
 * 校验方式
 */
export enum CheckTypeEnum {
  // 无
  empty = 'empty',
  // 奇校验
  oddCheck = 'oddCheck',
  // 偶校验
  evenCheck = 'evenCheck'
}
/**
 * 一键呼叫类型枚举
 */
export enum CallTypeEnum {
  // 话筒
  microphone = '1',
  // 对讲
  interphone = '2'
}
