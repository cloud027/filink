/**
 * Created by xiaoconghu on 2019/1/18.
 * 地图选择器抽象类
 */
export abstract class MapAbstract {
  private _maxLng;

  get maxLng() {
    return this._maxLng;
  }

  set maxLng(value) {
    this._maxLng = value;
  }

  private _minLng;

  get minLng() {
    return this._minLng;
  }

  set minLng(value) {
    this._minLng = value;
  }

  private _maxLat;

  get maxLat() {
    return this._maxLat;
  }

  set maxLat(value) {
    this._maxLat = value;
  }

  private _minLat;

  get minLat() {
    return this._minLat;
  }

  set minLat(value) {
    this._minLat = value;
  }

  abstract createPoint(lng, lat): any;

  abstract addOverlay(marker): any;

  abstract addMarker(point, id, fn?);

  abstract clearOverlay(overlay);

  /**
   * 创建地图
   * param documentId
   */
  abstract createMap(documentId);

  /**
   * 判断点是否在框中
   * param pt
   * param poly
   */
  abstract isInsidePolygon(pt, poly);

  /**
   * 通过id获取marker
   * param id
   */
  abstract getMarkerById(id);

  /**
   * 通过id获取marker点数据
   * param id
   */
  abstract getMarkerDataById(id);

  /**
   * 切换点图标
   * param url
   */
  abstract toggleIcon(url);

  /**
   * 创建点
   * param point 点信息
   * param fn 回调函数
   */
  abstract createMarker(point, fn?);

  /**
   * 添加聚合点
   * param markers
   */
  abstract addMarkerClusterer(markers, fn?): any;

  /**
   * 获取所有点数据
   * returns {Map<string, any>}
   */
  abstract getMarkerMap(): Map<string, any>;

  /**
   * 设置中心点
   */
  abstract setCenterPoint(lat?, lng?, zoom?);

  /**
   * 获取城市信息
   */
  abstract getLocation(overlays, fn);

  /**
   * 定位到用户登录的城市
   */
  abstract locateToUserCity();

  /**
   * 根据录入点的坐标计算出中心点
   * param lng
   * param lat
   */
  public updateCenterPoint(lng, lat) {
    this._maxLng = this._maxLng ? (lng > this._maxLng ? lng : this._maxLng) : lng;
    this._minLng = this._minLng ? (lng < this._minLng ? lng : this._minLng) : lng;
    this._maxLat = this._maxLat ? (lat > this._maxLat ? lat : this._maxLat) : lat;
    this._minLat = this._minLat ? (lat < this._minLat ? lat : this._minLat) : lat;
  }

  /**
   * 添加地图搜索组件
   * param id
   * param resultDomId
   */
  abstract addLocationSearchControl(id, resultDomId);

  /**
   * 根据地理坐标获取对应的覆盖物容器的坐标，此方法用于自定义覆盖物
   * param lng
   * param lat
   */
  abstract pointToOverlayPixel(lng, lat);

  /**
   * 获取地图相对于网页的偏移
   */
  abstract getOffset();

  /**
   * 放大
   * param level 放大等级 默认为1
   */
  abstract zoomIn(level?);

  /**
   * 缩小
   * param level 缩小等级 默认为1
   */
  abstract zoomOut(level?);
}
