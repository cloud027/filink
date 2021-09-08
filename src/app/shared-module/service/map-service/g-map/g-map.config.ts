/**
 * 说明：
 * 谷歌地图普通地图最大支持缩放级别为22，卫星地图最大支持缩放级别为20
 */

export enum MapConfig {
  // 最大缩放级别
  maxZoom = 20,
  // 最小缩放级别
  minZoom = 3,
  // 默认缩放级别
  defaultZoom = 8,
  // 大于或等于此缩放级别显示连线
  showLineZoom = 12,
}
