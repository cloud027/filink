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
 * 网关配置节点类型枚举
 */
export enum ConfigNodeTypeEnum {
  // 网关
  gateway = 'gateway',
  // 网关端口框架
  frame = 'gatewayFrame',
  // 网关端口
  port = 'port',
  // 端口连接设备
  equipment = 'equipment',
  // 端口和设备节点连线
  line = 'line'
}

/**
 * 网关上部分小端口和下部分LAN端口类型
 */
export enum PortClassEnum {
  // 上部分端口
  upPort = '1',
  // LAN口
  downPort = '2'
}

/**
 * 查询网关端口类型
 */
export enum QueryGatewayPortEnum {
  // 网关端口
  gateway = 0,
  // 电源控制器安端口
  powerControl = 1
}

/**
 * 传感器类型
 */
export enum SensorTypeEnum {
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
  // 温湿传感器
  temperatureHumiditySensor = 'S006',
}
