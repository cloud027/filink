/**
 * Created by xiaoconghu on 2019/1/8.
 */
import {DEFAUT_ZOOM, iconSize, iconUrl} from './map.config';
import {MapAbstract} from './map-abstract';
import {MapDrawingService} from './map-drawing.service';
import {CommonUtil} from '../../util/common-util';
import {MapConfig as BMapConfig, MapConfig} from '../map/b-map.config';

declare const BMap: any;
declare const BMapLib: any;
declare const BMAP_ANCHOR_TOP_LEFT: any;
declare const BMAP_ANCHOR_TOP_RIGHT: any;

/**
 * 百度地图选择器服务类
 */
export class MapSelectorService extends MapAbstract {
  // 地图实例
  mapInstance;
  // 地图绘画工具
  mapDrawUtil: MapDrawingService;
  // 地图makers Map
  markersMap = new Map();


  constructor(documentId, simpleConfig?) {
    super();
    this.mapInstance = this.createMap(documentId);

    // 增加城市控件
    if (!simpleConfig) {
      // this.initCityControl();
      this.mapInstance.enableScrollWheelZoom(true);
    } else {
      this.mapInstance.disableDragging();
    }
  }

  createMap(documentId) {
    const mapInstance = new BMap.Map(documentId, {enableMapClick: false, maxZoom: MapConfig.maxZoom});  // 创建Map实例
    mapInstance.setMapStyle({styleJson: []});   // 采用v1版本样式配置
    // 添加地图类型控件
    // mapInstance.setCurrentCity('北京');          // 设置地图显示的城市 此项是必须设置的
    // const point = new BMap.Point(116.331398, 39.897445);
    // mapInstance.centerAndZoom(point, 15);
    this.mapDrawUtil = new MapDrawingService(mapInstance);
    return mapInstance;
  }

  /**
   * 废弃
   * param point
   * param id
   * param fn
   */
  addMarker(point, id, fn?) {
    const icon = this.toggleIcon(iconUrl);
    const marker = new BMap.Marker(this.createPoint(point.position[0], point.position[1]), {
      icon: icon
    });
    marker.customData = {id: point.deviceId};
    if (fn) {
      marker.addEventListener(fn.eventName, fn.eventHandler);
    }
    this.markersMap.set(point.deviceId, {marker: marker, data: point});
    this.mapInstance.addOverlay(marker);
  }

  /**
   * 创建覆盖物
   * param point
   * param fn
   * returns {BMap.Marker}
   */
  createMarker(point, fn?) {
    const status = point.checked ? '0' : '1';
    const url = CommonUtil.getFacilityIconUrl(iconSize, point.deviceType, status);
    const icon = this.toggleIcon(url);
    const position = point.positionBase.split(',');
    const _lng = parseFloat(position[0]);
    const _lat = parseFloat(position[1]);
    point['lat'] = _lat;
    point['lng'] = _lng;
    super.updateCenterPoint(_lng, _lat);
    const marker = new BMap.Marker(this.createPoint(_lng, _lat), {
      icon: icon
    });
    marker.customData = {id: point.deviceId};
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
  addMarkerClusterer(markers, fn?): any {
    const eventMap = new Map();
    if (fn && fn.length > 0) {
      fn.forEach(item => {
        eventMap.set(item.eventName, item.eventHandler);
        // markerClusterer.addEventListener(item.eventName, item.eventHandler);
      });
    }
    const markerClusterer = new BMapLib.MarkerClusterer(this.mapInstance, {markers: markers, maxZoom: BMapConfig.maxZoom},
      (event, data) => {
        if (eventMap.get(event.type)) {
          eventMap.get(event.type)(event, data);
        }
      });
    // markerClusterer.setMinClusterSize(2);
    return markerClusterer;
  }

  /**
   * 清除覆盖物
   * param overlay
   */
  clearOverlay(overlay) {
    this.mapInstance.removeOverlay(overlay);
  }

  /**
   * 判断点是否在所选区域里面
   * param pt  具体的点
   * param poly 所选区域
   * returns {boolean}
   */
  isInsidePolygon(pt, poly) {
    let c = false;
    for (let i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
      if (((poly[i].lat <= pt.lat && pt.lat < poly[j].lat) || (poly[j].lat <= pt.lat && pt.lat < poly[i].lat)) &&
        (pt.lng < (poly[j].lng - poly[i].lng) * (pt.lat - poly[i].lat) / (poly[j].lat - poly[i].lat) + poly[i].lng)) {
        c = !c;
      }
    }
    return c;
  }

  /**
   * 通过id获取marker
   * param id
   * returns {any}
   */
  getMarkerById(id) {
    return this.markersMap.get(id).marker;
  }

  /**
   * 通过id获取marker对应的数据
   * param id
   */
  getMarkerDataById(id) {
    return this.markersMap.get(id).data;
  }

  getMarkerMap(): Map<string, any> {
    return this.markersMap;
  }

  /**
   * 切换图标
   * param url
   * returns {BMap.Icon}
   */
  toggleIcon(url) {
    const icon = new BMap.Icon(url, new BMap.Size(18, 24));
    icon.setImageSize(new BMap.Size(18, 24));
    return icon;
  }

  /**
   * 添加城市控件
   */
  initCityControl() {
    // 增加城市控件
    this.mapInstance.addControl(new BMap.CityListControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      offset: new BMap.Size(70, 10),
      // 切换城市之间事件
      onChangeBefore: function () {
      },
      // 切换城市之后事件
      onChangeAfter: function () {
      }
    }));
    this.mapInstance.addControl(new BMap.NavigationControl());
  }

  /**
   * 设置中心点
   */
  setCenterPoint(lat?, lng?, zoom?) {
    if (lat && lng) {
      this.setCenterAndZoom(lng, lat, zoom || DEFAUT_ZOOM);
    } else {
      const point = CommonUtil.getLatLngCenter(this.getMarkerMap());
      this.setCenterAndZoom(point[1], point[0], zoom || DEFAUT_ZOOM);
    }
  }

  /**
   * 定位到当前城市
   */
  locateToUserCity() {
    const myFun = (result) => {
      const cityName = result.name;
      this.mapInstance.centerAndZoom(cityName, DEFAUT_ZOOM);
    };
    const myCity = new BMap.LocalCity();
    myCity.get(myFun);
  }

  getLocation(overlays, fn) {
    const geoCoder = new BMap.Geocoder();
    geoCoder.getLocation(overlays.point, fn);
  }

  addOverlay(marker) {
    const overlay = new BMap.Marker(marker);
    this.mapInstance.addOverlay(overlay);
    return overlay;
  }

  addMarkerMap(marker) {
    this.mapInstance.addOverlay(marker);
  }

  searchLocation(key, fn) {
  }

  addZoomEnd(fn) {
    this.mapInstance.addEventListener('zoomend', fn);
  }

  addLocationSearchControl(id, resultDomId) {
    const autoComplete = new BMap.Autocomplete(    // 建立一个自动完成的对象
      {
        'input': id,
        'location': this.mapInstance,
      });
    autoComplete.addEventListener('onhighlight', function (e) {  // 鼠标放在下拉列表上的事件
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
    autoComplete.addEventListener('onconfirm', e => {    // 鼠标点击下拉列表后的事件
      const _value = e.item.value;
      myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      document.getElementById(resultDomId).innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue;
      this.setPlace(myValue);
    });
  }

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

  getOffset() {
    return {
      offsetX: this.mapInstance.offsetX,
      offsetY: this.mapInstance.offsetY,
    };
  }

  pointToOverlayPixel(lng, lat) {
    return this.mapInstance.pointToOverlayPixel(this.createPoint(lng, lat));
  }

  zoomIn(level = 1) {
    const _zoom = this.mapInstance.getZoom() - level;
    if (_zoom > BMapConfig.maxZoom || _zoom < BMapConfig.minZoom) {
      return;
    }
    this.mapInstance.setZoom(_zoom);
  }

  zoomOut(level = 1) {
    const _zoom = this.mapInstance.getZoom() + level;
    if (_zoom > BMapConfig.maxZoom || _zoom < BMapConfig.minZoom) {
      return;
    }
    this.mapInstance.setZoom(_zoom);
  }

  /**
   * 通过经纬度设置地图中心点及缩放级别
   * param lng
   * param lat
   * param {number} zoom
   */
  private setCenterAndZoom(lng, lat, zoom = 0) {
    const point = new BMap.Point(lng, lat);
    if (zoom) {
      this.mapInstance.centerAndZoom(point, zoom);
    } else {
      this.mapInstance.setCenter(point);
    }
  }

}
