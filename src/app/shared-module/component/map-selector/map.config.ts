export const BMAP_DRAWING_MARKER: any = 'marker'; // 画点
export const BMAP_DRAWING_CIRCLE: any = 'circle'; // 画圆
export const BMAP_DRAWING_POLYLINE: any = 'polyline'; // 画线
export const BMAP_DRAWING_POLYGON: any = 'polygon'; // 画多边形
export const BMAP_DRAWING_RECTANGLE: any = 'rectangle'; // 画矩形
export const BMAP_ARROW: any = 'arrow'; // 箭头模式
export const activeIconUrl = 'assets/img/facility/red.png';
export const iconUrl = 'assets/img/facility/bule.png';
export const iconSize = '18-24';
export const styleOptions = {
  strokeColor: 'red',    // 边线颜色。
  fillColor: 'red',      // 填充颜色。当参数为空时，圆形将没有填充效果。
  strokeWeight: 3,       // 边线的宽度，以像素为单位。
  strokeOpacity: 0.8,	   // 边线透明度，取值范围0 - 1。
  fillOpacity: 0.6,      // 填充的透明度，取值范围0 - 1。
  strokeStyle: 'solid' // 边线的样式，solid或dashed。
};
export const DEFAUT_ZOOM = 12;

/**
 * 说明：
 * 百度地图v2版本普通地图和卫星地图最大支持缩放级别为19
 * 百度地图v1版本普通地图最大支持缩放级别为18，卫星地图最大支持缩放级别为19
 */

export enum MapConfig {
  // 最大缩放级别,大于此缩放级别不再以聚合点展示
  maxZoom = 19,
  // 最小缩放级别
  minZoom = 3,
  // 默认缩放级别
  defaultZoom = 8,
  // 大于或等于此缩放级别显示连线
  showLineZoom = 16,
  // 设施/设备层级
  deviceZoom = 18,
  // 区域层级
  areaZoom = 16
}
