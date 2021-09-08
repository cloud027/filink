export abstract class MapAbstract {
  private _maxLng;   // 最大经度
  private _minLng;   // 最小经度
  private _maxLat;   // 最大纬度
  private _minLat;   // 最小纬度

  get maxLng() {
    return this._maxLng;
  }

  set maxLng(value) {
    this._maxLng = value;
  }

  get minLng() {
    return this._minLng;
  }

  set minLng(value) {
    this._minLng = value;
  }

  get maxLat() {
    return this._maxLat;
  }

  set maxLat(value) {
    this._maxLat = value;
  }

  get minLat() {
    return this._minLat;
  }

  set minLat(value) {
    this._minLat = value;
  }

  /**
   * 生成point
   * param lng
   * param lat
   * returns {any}
   */
  abstract createPoint(lng, lat): any;

  /**
   * 添加覆盖物
   * param marker
   * returns {any}
   */
  abstract addOverlay(marker): any;

  /**
   * 添加marker点
   * param marker
   */
  abstract addMarker(marker);

  /**
   * 移除覆盖物
   * param overlay
   */
  abstract removeOverlay(overlay);

  /**
   * 创建地图
   * param documentId
   * param mapConfig
   */
  abstract createMap(documentId, mapConfig);

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
   * 获取设施图标
   * param url
   */
  abstract getIcon(url, size);

  /**
   * 生成大小
   * param width
   * param height
   */
  abstract createSize(width, height);

  /**
   * 设置图标大小
   * param url
   */
  abstract setIconSize(size);

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
  abstract addMarkerClusterer(markers, fn?);

  /**
   * 更新marker点
   * param data
   */
  abstract updateMarker(type, data, fn?);

  /**
   * 定位到markers视图
   */
  abstract fitMapToMarkers();

  /**
   * 获取所有点数据
   * returns {Map<string, any>}
   */
  abstract getMarkerMap(): Map<string, any>;

  /**
   * 清空所有缓存数据
   */
  abstract clearMarkerMap();

  /**
   * 设置中心点
   */
  abstract setCenterPoint(zoom?);

  /**
   * 设置中心点及缩放级别
   * param lat
   * param lng
   * param zoom
   */
  abstract setCenterAndZoom(lng?, lat?, zoom?);

  /**
   * 获取中心点
   */
  abstract getCenter();

  /**
   * 中心点移动
   * param point
   * param bol  是否在平移过程中禁止动画
   */
  abstract panTo(point, bol?);

  /**
   * 重绘
   */
  abstract redraw();

  /**
   * 获取当前地址
   */
  abstract getLocation(lng, lat, fn?);

  /**
   * 通过城市名称设置地图中心
   * param {string} cityName
   */
  abstract setCenterByCityName(cityName);

  /**
   * 定位到用户登录的城市
   */
  abstract locateToUserCity(bol?);

  /**
   * 添加缩放平移组件
   */
  abstract addNavigationControl();

  /**
   * 城市选择组件状态改变
   */
  abstract cityListHook();

  /**
   * 地图事件
   */
  abstract mapEventHook();

  /**
   * 给地图添加事件
   */
  abstract addEventListenerToMap();

  /**
   * 批量修改图标大小
   */
  abstract changeAllIconSize(size);

  /**
   * 隐藏marker点
   * param id
   */
  abstract hideMarker(id);

  /**
   * 显示marker
   * param id
   */
  abstract showMarker(id);

  /**
   * 隐藏其他的设施点
   * param data
   */
  abstract hideOther(data);

  /**
   * 通过地址定位
   * param address
   */
  abstract locationByAddress(address);

  /**
   * 设置地图类型
   * param type
   */
  abstract setMapTypeId(type);

  /**
   * 获取地图缩放级别
   */
  abstract getZoom();

  /**
   * 获取地图可视区域
   */
  abstract getBounds();


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

  /**
   * 设置缩放级别
   * param zoom
   */
  abstract setZoom(zoom);

  /**
   * 根据地理坐标获取对应的覆盖物容器的坐标，此方法用于自定义覆盖物
   * param lng
   * param lat
   */
  abstract pointToOverlayPixel(lng, lat);

  /**
   * 添加地图搜索组件
   * param id
   * param resultDomId
   */
  abstract addLocationSearchControl(id, resultDomId);

  /**
   *显示地图高亮
   * param data
   */
  abstract addLine(data);

  /**
   * new显示地图高亮
   */
  abstract newAddLine(data);

  /**
   * 根据提供的地理区域或坐标获得最佳的地图视野
   */
  abstract getViewport(points?);

  /**
   *清除地图高亮
   * param data
   */
  abstract clearLine();

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
   * 移除最大最小经纬度
   */
  removeCenterPoint() {
    this._maxLat = null;
    this._maxLng = null;
    this._minLat = null;
    this._minLng = null;
  }

  /**
   * 获取中心点
   * returns {{lng: number; lat: number}}
   */
  getCenterPoint() {
    const lng = (this._maxLng + this._minLng) / 2;
    const lat = (this._maxLat + this._minLat) / 2;
    return {lng, lat};
  }
}
