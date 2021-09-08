/**
 * Created by xiaoconghu on 2020/6/5.
 */

export interface MapBaseViewInterface {

  /**
   * 地图实例
   */
  mapInstance;

  /**
   * 创建基础版地图
   * param documentId
   * param mapConfig
   */
  createBaseMap(documentId);

  /**
   * 获取地图缩放级别
   */
  getZoom();

  /**
   * 放大
   * param level 放大等级 默认为1
   */
  zoomIn(level?: number);

  /**
   * 缩小
   * param level 缩小等级 默认为1
   */
  zoomOut(level?: number);

  /**
   * 设置缩放级别
   * param zoom
   */
  setZoom(zoom);

  /**
   * 获取地图相对于网页的偏移
   */
  getOffset();

  /**
   * 设置地图类型
   * param type
   */
  setMapTypeId(type);

  /**
   * 设置中心点及缩放级别
   * param lat
   * param lng
   * param zoom
   */
  setCenterAndZoom(lng?, lat?, zoom?);

  /**
   * 开启滚轮缩放
   */
  enableScroll();

  /**
   * 销毁地图中对象
   */
  destroy();
  /**
   * 回路画线
   */
  loopDrawLine(data);
}
