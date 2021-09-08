/**
 * 说明：
 * 百度地图v2版本普通地图和卫星地图最大支持缩放级别为19
 * 百度地图v1版本普通地图最大支持缩放级别为18，卫星地图最大支持缩放级别为19
 */

export enum MapConfig {
  // 最大缩放级别,大于此缩放级别不再以聚合点展示
  maxZoom = 20,
  // 最小缩放级别
  minZoom = 3,
  // 默认缩放级别
  defaultZoom = 8,
  // 大于或等于此缩放级别显示连线
  showLineZoom = 16,
  // 设施/设备层级
  deviceZoom = 19,
  // 区域层级
  areaZoom = 17
}
