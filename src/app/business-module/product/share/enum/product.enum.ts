
/**
 * 产品操作权限枚举
 */
export enum ProductPermissionEnum {
  // 列表权限
  productList = '15-1-0',
  // 新增产品
  addProduct = '15-1-1',
  // 删除产品
  deleteProduct = '15-1-2',
  // 修改产品
  updateProduct = '15-1-3',
  // 产品详情
  productDetail = '15-1-4',
  // 模版配置
  configTemplate = '15-1-8',
  // 上传杆型图
  uploadPoleImg = '15-1-10',
  // 编辑杆型图
  editPoleImg = '15-1-11',
  // 上传网关图
  uploadGatewayImg = '15-1-12',
  // 编辑网关图
  editGatewayImg = '15-1-13',
  // 批量上传杆型图
  batchUploadPoleImg = '15-1-5',
  // 批量上传网关图
  batchUploadGatewayImg = '15-1-6',
  // 导入
  importProduct = '15-1-7',
  // 编码设置
  EncodingSetting = '15-1-14'

}

/**
 * 获取特定设备字段的枚举方法
 */
export enum EquipmentItemEnum {
  // 网关
  gateway = 'getGatewayColumn',
  // 单灯控制器
  singleLightController = 'getSingleLampColumn',
  // 集中控制器
  centralController = 'getCentralizedControllerColumn',
  // 信息屏
  informationScreen = 'getScreenConfigColumn',
  // 摄像头
  camera = 'getCameraConfigColumn',
  // 广播
  broadcast = 'getBroadcastColumn',
  // 一键呼叫
  oneTouchCalling = 'getOneButtonAlarmColumn',
  // 无线AP
  wirelessAp = 'getCameraConfigColumn',
  // 环境监测仪
  weatherInstrument = 'getEnvironmentalMonitoringColumn',
  // 充电桩
  chargingPile = 'getChargingPileColumn',
  // 一键报警器
  oneButtonAlarm = 'getOneButtonAlarmColumn',
  // 5g微基站
  baseStation = 'getMicroBaseStationColumn',
  // 智能门禁锁 目前需求不显示下一步信息
  // intelligentEntranceGuardLock = 'getSmartCircuitBreakerColumn',
}

/**
 * 设备配置枚举
 */
export enum SensorConfigEnum {
  // 温度传感器
  temperatureSensor = 'S001',
  // 湿度传感器
  humiditySensor = 'S002',
  // 水浸传感器
  waterSensor = 'S003',
  // 烟雾传感器
  smokeSensor = 'S004',
  // 门禁传感器
  doorSensor = 'S005',
  // 温湿传感器
  temperatureHumiditySensor = 'S006',
}

/**export enum SensorTypeEnum {
  // 温度传感器
  temperatureSensor = 'S001',
  // 湿度传感器
  humiditySensor = 'S002',
  // 门位开关
  gatePositionSwitch = 'S003',
  // 烟雾传感器
  smokeSensor = 'S004',
  // 水浸传感器
  floodingSensor = 'S005',
  // 温湿传感器
  temperatureHumiditySensor = 'S006',
}*/

/**
 * 端口枚举
 */
export enum PortConfigEnum {
  // 通信端口-WAN
  communicationPort_wan  = 'WAN',
  communicationPort_lan  = 'LAN',
  communicationPort_rs485  = 'RS485',
  communicationPort_di  = 'DI',
  communicationPort_do  = 'DO'
}
