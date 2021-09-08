/**
 * Created by xiaoconghu on 2020/6/5.
 */
export interface MapPlusPointInterface {


  /**
   * 添加覆盖物
   * param marker
   * returns {any}
   */
  addOverlay(marker): any;

  /**
   * 创建marker
   * param point
   * param fn
   */
  createMarker(point, fn?, iconUrl?): any;

  /**
   * 创建maker点新方法与业务分离
   * param mapPoint
   * param markerIcon
   * param fn
   */
  createNewMarker(mapPoint, markerIcon, fn?: any[]): any;

  /**
   * 添加marker点
   * param marker
   */
  addMarker(marker);

  /**
   * 移除覆盖物
   * param overlay
   */
  removeOverlay(overlay);

  /**
   * 通过id获取marker
   * param id
   */
  getMarkerById(id);

  /**
   * 通过id获取marker点数据
   * param id
   */
  getMarkerDataById(id);

  /**
   * 向地图中存入数据maker
   * param key
   * param value
   */
  setMarkerMap(key: string, value: { marker: any, data: any }): void;

  /**
   * 切换点图标
   * param url
   */
  toggleIcon(url);

  /**
   * 生成大小
   * param width
   * param height
   */
  createSize(width, height);

  /**
   * 设置图标大小
   * param url
   */
  setIconSize(size);

  /**
   * 添加聚合点
   * param markers
   * param fn
   * param iSHiddenZoom
   */
  addMarkerClusterer(markers, fn?, iSHiddenZoom?);

  /**
   * 更新marker点
   * param data
   */
  updateMarker(type, data, fn?);

  /**
   * 获取所有点数据
   * returns {Map<string, any>}
   */
  getMarkerMap(): Map<string, any>;

  /**
   * 清空所有缓存数据
   */
  clearMarkerMap();

  /**
   * 聚合点重绘
   */
  markerRedraw();

  /**
   * 添加地图搜索组件
   * param id
   * param resultDomId
   */
  addLocationSearchControl(id, resultDomId);

  pointToOverlayPixel(lng, lat);
}
