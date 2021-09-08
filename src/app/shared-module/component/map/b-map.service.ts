import {MapAbstract} from './map-abstract';
import {CommonUtil} from '../../util/common-util';
import {Observable, Subject} from 'rxjs';
import {MapConfig as BMapConfig} from './b-map.config';
import {MapConfig} from './map.config';

declare let BMap: any;   // 一定要声明BMap，要不然报错找不到BMap
declare let BMapLib: any;
declare const BMAP_NORMAL_MAP: any;
declare const BMAP_SATELLITE_MAP: any;
declare const BMAP_ANCHOR_BOTTOM_RIGHT: any;
declare const OBMap_ANCHOR_TOP_LEFT: any;
declare const BMAP_ANCHOR_TOP_LEFT: any;

export class BMapService extends MapAbstract {
  mapInstance;
  markersMap = new Map();
  cityTimer;
  _iconSize;
  iconSize;
  markerClusterer;
  view;
  private cityListStatus: Subject<any> = new Subject<any>();
  private mapEvent: Subject<any> = new Subject<any>();
  polyline;
  polylineData = [];
  constructor(mapConfig: MapConfig) {
    super();
    this.mapInstance = this.createMap(mapConfig);
    this.iconSize = mapConfig.defaultIconSize;
    this.setIconSize();
    // 启用滚轮放大缩小，默认禁用
    this.mapInstance.enableScrollWheelZoom();
    // 禁止双击放大
    this.mapInstance.disableDoubleClickZoom();
    // 增加城市控件
    this.addMapTypeControl();
    setTimeout(() => {
      this.addEventListenerToMap();
    }, 0);
  }

  /**
   * 创建地图
   */
  createMap(mapConfig: MapConfig) {
    // 创建Map实例
    const mapInstance = new BMap.Map(mapConfig.mapId, {enableMapClick: false, maxZoom: BMapConfig.maxZoom});
    // 添加地图类型控件
    const point = new BMap.Point(116.331398, 39.897445);
    mapInstance.centerAndZoom(point, 8);
    const style = mapConfig.mapStyle ? mapConfig.mapStyle : [];
    // v2版本样式自定义时与地图类型切换插件有冲突
    // mapInstance.setMapStyleV2({styleJson: mapConfig.mapStyle});
    // 采用v1版本样式配置
    mapInstance.setMapStyle({styleJson: style});
    return mapInstance;
  }

  /**
   * 城市列表改变
   */
  private cityListChange(data): void {
    this.cityListStatus.next(data);
  }

  /**
   * 城市选择组件状态改变
   */
  public cityListHook(): Observable<any> {
    return this.cityListStatus.asObservable();
  }

  /**
   * 地图回传
   */
  private mapEventEmitter(data): void {
    this.mapEvent.next(data);
  }

  /**
   * 地图事件
   */
  public mapEventHook(): Observable<any> {
    return this.mapEvent.asObservable();
  }

  /**
   * 创建marker点
   * param point
   * param fn
   * returns {BMap.Marker}
   */
  createMarker(point, fn?) {
    const url = CommonUtil.getFacilityIconUrl(this.iconSize, point.deviceType, point.deviceStatus);
    const icon = this.toggleIcon(url);
    super.updateCenterPoint(point.lng, point.lat);
    const marker = new BMap.Marker(this.createPoint(point.lng, point.lat), {
      icon: icon
    });
    marker.customData = {id: point.deviceId};
    marker.isShow = {id: point.deviceId};
    if (fn) {
      if (fn.length > 0) {
        fn.forEach(item => {
          marker.addEventListener(item.eventName, item.eventHandler);
        });
      }
    }
    this.markersMap.set(point.deviceId, {marker: marker, data: point});
    return marker;
  }

  /**
   * 创建点
   * param lng
   * param lat
   * returns {BMap.Point}
   */
  createPoint(lng, lat) {
    return new BMap.Point(lng, lat);
  }

  /**
   * 聚合点
   * param markers
   */
  addMarkerClusterer(markers, fn?) {
    const eventMap = new Map();
    if (fn && fn.length > 0) {
      fn.forEach(item => {
        eventMap.set(item.eventName, item.eventHandler);
      });
    }
    this.markerClusterer = new BMapLib.MarkerClusterer(this.mapInstance, {
      markers: markers,
      maxZoom: BMapConfig.maxZoom,
      isAverageCenter: true,
    }, (event, data) => {
      if (eventMap.get(event.type)) {
        eventMap.get(event.type)(event, data);
      }
    });
  }

  updateMarker(type, data, fn?) {
    if (type === 'add') {
      // 新增
      this.addMarker(this.createMarker(data, fn));
    } else if (type === 'update') {
      // 更新
      const marker = this.getMarkerById(data.deviceId);
      const imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, data.deviceType, data.deviceStatus);
      const _icon = this.getIcon(imgUrl, this._iconSize);
      marker.setIcon(_icon);
      marker.show();
      marker.isShow = true;
      this.markersMap.set(data.deviceId, {marker: marker, data: data});
    } else if (type === 'delete') {
      // 删除
      const marker = this.getMarkerById(data.deviceId);
      this.markerClusterer.removeMarker(marker);
      this.markersMap.delete(data.deviceId);
    } else if (type === 'hide') {
      // 隐藏
      this.hideMarker(data.deviceId);
    } else if (type === 'show') {
      // 显示
      this.showMarker(data.deviceId);
    }
  }

  /**
   * 重汇聚合点
   */
  redraw() {
    if (this.markerClusterer) {
      this.markerClusterer.redraw();
    }
  }

  /**
   * 隐藏其他的marker点
   * param data
   */
  hideOther(data) {
    for (const [key, value] of this.markersMap) {
      if (data.indexOf(key) < 0) {
        value.marker.hide();
        value.marker.isShow = false;
      }
    }
  }

  /**
   * 清除覆盖物
   * param overlay
   */
  removeOverlay(overlay) {
    this.mapInstance.removeOverlay(overlay);
  }

  /**
   * 添加marker点
   * param point
   * param id
   * param fn
   */
  addMarker(marker) {
    this.markerClusterer.addMarker(marker);
  }

  /**
   * 通过id获取marker
   * param id
   * returns {any}
   */
  getMarkerById(id) {
    if (this.markersMap.get(id)) {
      return this.markersMap.get(id).marker;
    } else {
      return null;
    }
  }

  /**
   * 通过id获取marker对应的数据
   * param id
   */
  getMarkerDataById(id) {
    if (this.markersMap.get(id)) {
      return this.markersMap.get(id).data;
    } else {
      return null;
    }
  }

  /**
   * 获取marker对应的数据
   */
  getMarkerMap(): Map<string, any> {
    return this.markersMap;
  }

  /**
   * 切换图标
   * param url
   * returns {BMap.Icon}
   */
  toggleIcon(url) {
    const icon = new BMap.Icon(url, this._iconSize);
    icon.setImageSize(this._iconSize);
    return icon;
  }

  /**
   * 创建图标尺寸
   */
  createSize(width, height) {
    return new BMap.Size(width, height);
  }

  /**
   * 设置图标尺寸
   */
  setIconSize() {
    const size = this.iconSize.split('-');
    this._iconSize = this.createSize(size[0], size[1]);
  }

  /**
   * 得到图标尺寸
   */
  getIcon(url, size) {
    const icon = new BMap.Icon(url, size);
    icon.setImageSize(size);
    return icon;
  }

  /**
   * 适合地图的标记点
   */
  fitMapToMarkers() {

  }

  /**
   * 添加定位搜索控件
   */
  addLocationSearchControl(id, resultDomId) {
    const ac = new BMap.Autocomplete(    // 建立一个自动完成的对象
      {
        'input': 'suggestId',
        'location': this.mapInstance
      });
    ac.addEventListener('onhighlight', function (e) {  // 鼠标放在下拉列表上的事件
      let str = '';
      let _value = e.fromitem.value;
      let value = '';
      if (e.fromitem.index > -1) {
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
      }
      str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value;

      value = '';
      if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
      }
      str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value;
      document.getElementById(resultDomId).innerHTML = str;
    });
    let myValue;
    ac.addEventListener('onconfirm', e => {    // 鼠标点击下拉列表后的事件
      const _value = e.item.value;
      myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      document.getElementById('searchResultPanel').innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue;
      this.setPlace(myValue);
    });
  }

  /**
   * 设置搜索位置
   */
  setPlace(myValue) {
    const myFun = () => {
      const pp = local.getResults().getPoi(0).point;    // 获取第一个智能搜索的结果
      this.mapInstance.centerAndZoom(pp, 18);
    };

    const local = new BMap.LocalSearch(this.mapInstance, { // 智能搜索
      onSearchComplete: myFun
    });
    local.search(myValue);
  }

  /**
   * 添加城市切换控件
   */
  addCityListControl() {
    const size = this.createSize(70, 20);
    this.mapInstance.addControl(new BMap.CityListControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      offset: size,
      // 切换城市之后事件
      onChangeAfter: () => {
        if (document.getElementById('selCityTip').style.display === 'none') {
          this.cityListChange({type: 'cityChange'});
        }
      }
    }));
  }

  /**
   * 城市切换插件添加监听（插件未提供打开关闭监听）
   */
  addEventListenerToCityListControl() {
    const $el = document.getElementsByClassName('ui_city_change_top')[0];
    if ($el) {
      clearTimeout(this.cityTimer);
      $el.addEventListener('click', () => {
        setTimeout(() => {
          const bol = $el.classList.contains('ui_city_change_click');
          this.cityListChange({type: 'cityListControlStatus', value: bol});
        }, 100);
      });
      document.getElementById('popup_close').addEventListener('click', () => {
        this.cityListChange({type: 'cityListControlStatus', value: false});
      });
    } else {
      this.cityTimer = setTimeout(() => {
        this.addEventListenerToCityListControl();
      }, 200);
    }
  }

  /**
   * 设置中心点
   */
  setCenterPoint(zoom = null) {
    // const {lng, lat} = this.getCenterPoint();
    const point = CommonUtil.getLatLngCenter(this.getMarkerMap());
    this.setCenterAndZoom(point[1], point[0], zoom);
  }

  /**
   * 获取缩放大小
   */
  getZoom() {
    return this.mapInstance.getZoom();
  }

  /**
   * 通过经纬度设置地图中心点及缩放级别
   * param lng
   * param lat
   * param {number} zoom
   */
  public setCenterAndZoom(lng, lat, zoom?) {
    const point = this.createPoint(lng, lat);
    if (zoom) {
      this.mapInstance.centerAndZoom(point, zoom);
    } else {
      this.mapInstance.setCenter(point);
    }
  }

  /**
   * 中心点移动
   */
  panTo(lng, lat, bol = false) {
    this.mapInstance.panTo(this.createPoint(lng, lat), {noAnimation: bol});
  }

  /**
   * 定位到当前城市
   */
  locateToUserCity(bol = false) {
    if (bol) {
      const myFun = (result) => {
        // 当前所在城市
        const cityName = result.name;
        this.setCenterByCityName(cityName);
      };
      const myCity = new BMap.LocalCity();
      myCity.get(myFun);
    }
  }

  /**
   * 通过城市名称设置地图中心
   * param {string} cityName
   */
  setCenterByCityName(cityName: string) {
    this.mapInstance.centerAndZoom(cityName);
  }

  /**
   * 获取定位
   */
  getLocation(lng, lat, fn) {
    // 创建地址解析器实例
    const geoCoder = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    const point = new BMap.Point(lng, lat);
    geoCoder.getLocation(point, fn);
  }

  /**
   * 添加覆盖物
   */
  addOverlay(marker) {
    const overlay = new BMap.Marker(marker);
    this.mapInstance.addOverlay(overlay);
    return overlay;
  }

  /**
   * 批量修改图标大小
   */
  changeAllIconSize(iconSize) {
    this.iconSize = iconSize;
    this.setIconSize();
    for (const [value] of this.markersMap) {
      const imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, value.data.deviceType, value.data.deviceStatus);
      const _icon = this.getIcon(imgUrl, this._iconSize);
      value.marker.setIcon(_icon);
    }
  }

  /**
   * 添加连线
   * data 传入的点连线
   */
  addLine(data) {
    if (this.polyline) {
      this.mapInstance.removeOverlay(this.polyline);
    }
    const mapData = [];
    data.map(item => {
      mapData.push(new BMap.Point(item.lng * 1, item.lat * 1));
    });
    this.polyline = new BMap.Polyline(
      mapData,
      {strokeColor: '#5ed8a9', strokeWeight: 5, strokeOpacity: 1}
    );   // 创建折线
    this.mapInstance.addOverlay(this.polyline);   // 增加折线
  }

  newAddLine(data) {
    const mapData = [];
    data.map(item => {
      mapData.push(new BMap.Point(item.lng * 1, item.lat * 1));
    });
    this.polyline = new BMap.Polyline(
      mapData,
      {strokeColor: '#5ed8a9', strokeWeight: 5, strokeOpacity: 1}
    );   // 创建折线
    this.polylineData.push(this.polyline);
    this.mapInstance.addOverlay(this.polyline);   // 增加折线
  }

  /**
   * 添加连线
   * data 传入的点连线
   */
  clearLine() {
    if (this.polyline) {
      this.polylineData.forEach(item => {
        this.mapInstance.removeOverlay(item);
      });
    }
  }

  /**
   * 添加地图类型控件
   */
  addMapTypeControl() {
    this.mapInstance.addControl(new BMap.MapTypeControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        mapTypes: [
          BMAP_NORMAL_MAP,
          BMAP_SATELLITE_MAP
        ]
      })
    );
  }

  /**
   * 隐藏marker点
   */
  hideMarker(id) {
    this.getMarkerById(id).hide();
    this.getMarkerById(id).isShow = false;
  }

  /**
   * 显示marker
   */
  showMarker(id) {
    this.getMarkerById(id).show();
    this.getMarkerById(id).isShow = true;
  }

  /**
   * 通过地址定位
   */
  locationByAddress(name) {

  }

  /**
   * 设置地图类型
   */
  setMapTypeId(type) {

  }

  /**
   * 给地图添加事件
   */
  addEventListenerToMap() {
    this.mapInstance.addEventListener('zoomend', () => {
      // 地图缩放
      this.mapEventEmitter({type: 'zoomend'});
    });

    this.mapInstance.addEventListener('dragend', () => {
      this.mapEventEmitter({type: 'dragend'});
    });

    this.mapInstance.addEventListener('click', e => {
      const type = e.overlay ? e.overlay.toString() : '';
      if (type !== '[object Marker]') {
        this.mapEventEmitter({type: 'click'});
      }
    });
  }

  /**
   * 清空所有缓存数据
   */
  clearMarkerMap() {
    this.markersMap.clear();
  }

  /**
   * 获取中心点
   * returns {any}
   */
  getCenter() {
    return this.mapInstance.getCenter();
  }

  /**
   * 获取地图可视区域
   */
  getBounds() {
    const bounds = this.mapInstance.getBounds();
    return {
      topLat: bounds.getNorthEast().lat,
      bottomLat: bounds.getSouthWest().lat,
      leftLng: bounds.getSouthWest().lng,
      rightLng: bounds.getNorthEast().lng,
    };
  }

  /**
   * 获取地图相对于网页的偏移
   */
  getOffset() {
    return {
      offsetX: this.mapInstance.offsetX,
      offsetY: this.mapInstance.offsetY,
    };
  }

  /**
   * 根据地理坐标获取对应的覆盖物容器的坐标，此方法用于自定义覆盖物
   */
  pointToOverlayPixel(lng, lat) {
    return this.mapInstance.pointToOverlayPixel(this.createPoint(lng, lat));
  }

  /**
   * 放大
   */
  zoomIn(level = 1) {
    const _zoom = this.getZoom() - level;
    if (_zoom > BMapConfig.maxZoom || _zoom < BMapConfig.minZoom) {
      return;
    }
    this.setZoom(_zoom);
  }

  /**
   * 缩小
   */
  zoomOut(level = 1) {
    const _zoom = this.getZoom() + level;
    if (_zoom > BMapConfig.maxZoom || _zoom < BMapConfig.minZoom) {
      return;
    }
    this.setZoom(_zoom);
  }

  /**
   * 设置缩放级别
   */
  setZoom(zoom) {
    this.mapInstance.setZoom(zoom);
  }

  /**
   * 添加缩放平移控件
   */
  addNavigationControl() {
    // 左上角，添加默认缩放平移控件
    this.mapInstance.addControl(new BMap.NavigationControl());
  }

  /**
   * 根据提供的地理区域或坐标获得最佳的地图视野
   */
  getViewport(points) {
   return this.view = this.mapInstance.getViewport(points);
  }
}
