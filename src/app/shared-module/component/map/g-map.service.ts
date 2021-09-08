import {MapAbstract} from './map-abstract';
import {Observable, Subject} from 'rxjs';
import {MapConfig as GMapConfig} from './g-map.config';
import {CommonUtil} from '../../util/common-util';
import {MapConfig} from './map.config';
import {MapConfig as BMapConfig} from './b-map.config';

declare let google: any;
declare let MarkerClusterer: any;

export class GMapService extends MapAbstract {
  mapInstance;
  markersMap = new Map();
  cityTimer;
  _iconSize;
  iconSize;
  markerClusterer;
  private mapEvent: Subject<any> = new Subject<any>();
  geocoder;
  isAddListener = false;
  polyline;
  res = [];
  polylineData = [];

  constructor(mapConfig: MapConfig) {
    super();
    this.mapInstance = this.createMap(mapConfig);
    this.setMapTypeId('roadmap');
    this.geocoder = new google.maps.Geocoder();
    this.iconSize = mapConfig.defaultIconSize;
    this.setIconSize();
    setTimeout(() => {
      this.addEventListenerToMap();
    }, 0);
  }

  private mapEventEmitter(data): void {
    this.mapEvent.next(data);
  }

  public mapEventHook(): Observable<any> {
    return this.mapEvent.asObservable();
  }

  createMap(mapConfig: MapConfig) {
    const mapInstance = new google.maps.Map(document.getElementById(mapConfig.mapId), {
      zoom: GMapConfig.defaultZoom,
      maxZoom: GMapConfig.maxZoom,
      center: {lat: 39.897445, lng: 116.331398},
      mapTypeControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DEFAULT,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      zoomControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      },
      scaleControl: false,
      streetViewControl: false,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      },
      fullscreenControl: false,
      clickableIcons: false,
      disableDoubleClickZoom: true   // 禁止双击放大
    });
    return mapInstance;
  }

  /**
   * 给地图添加事件
   */
  addEventListenerToMap() {
    this.mapInstance.addListener('zoom_changed', () => {
      // 地图缩放
      this.mapEventEmitter({type: 'zoomend'});
    });
    this.mapInstance.addListener('dragend', () => {
      this.mapEventEmitter({type: 'dragend'});
    });

    this.mapInstance.addListener('click', e => {
      if (!e.customData) {
        setTimeout(() => {
          this.mapEventEmitter({type: 'click'});
        }, 0);
      }
    });

    this.mapInstance.addListener('maptypeid_changed', () => {
      // this.mapInstance.getMapTypeId()
    });
  }

  getZoom() {
    return this.mapInstance.getZoom();
  }

  createSize(width, height) {
    return new google.maps.Size(width, height);
  }

  setIconSize() {
    const size = this.iconSize.split('-');
    this._iconSize = this.createSize(size[0], size[1]);
  }

  /**
   * 获取中心点
   * returns {any}
   */
  getCenter() {
    const centerPoint = this.mapInstance.getCenter();
    return {
      lng: centerPoint.lng(),
      lat: centerPoint.lat(),
    };
  }

  getLocation(lng, lat) {

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

  clearMarkerMap() {
    this.markersMap.clear();
  }

  getMarkerMap(): Map<string, any> {
    return this.markersMap;
  }

  changeAllIconSize(iconSize) {
    this.iconSize = iconSize;
    this.setIconSize();
    for (const [value] of this.markersMap) {
      const imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, value.data.deviceType, value.data.deviceStatus);
      const _icon = this.getIcon(imgUrl, this._iconSize);
      value.marker.setIcon(_icon);
    }
  }

  addListenerToClusterer() {
    if (!this.markerClusterer) {
      return;
    }

    google.maps.event.addListener(this.markerClusterer, 'clustermouseover', c => {
      if (this.getZoom() >= GMapConfig.maxZoom) {
        this.mapEventEmitter({
          target: 'c',
          type: 'mouseover',
          event: event,
          markers: c.getMarkers()
        });
      }
    });
    google.maps.event.addListener(this.markerClusterer, 'clustermouseout', c => {
      this.mapEventEmitter({
        target: 'c',
        type: 'mouseout',
      });
    });
    google.maps.event.addListener(this.markerClusterer, 'clusterclick', c => {
      if (this.getZoom() >= GMapConfig.maxZoom) {
        this.mapEventEmitter({
          target: 'c',
          type: 'click',
          event: event,
          markers: c.getMarkers()
        });
      }
    });
    this.isAddListener = true;
  }

  createMarker(point, fn?) {
    const url = CommonUtil.getFacilityIconUrl(this.iconSize, point.deviceType, point.deviceStatus);
    const icon = this.toggleIcon(url);
    super.updateCenterPoint(point.lng, point.lat);
    const marker = new google.maps.Marker({position: this.createPoint(point.lng, point.lat), icon});
    marker.customData = {id: point.deviceId};
    marker.isShow = true;
    if (fn) {
      if (fn.length > 0) {
        fn.forEach(item => {
          google.maps.event.addListener(marker, item.eventName, (event) => {
            item.eventHandler({target: marker}, event);
          });
        });
      }
    }
    this.markersMap.set(point.deviceId, {marker: marker, data: point});
    return marker;
  }

  addMarkerClusterer(markers, fn?) {
    const imgPath = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
    this.markerClusterer = new MarkerClusterer(this.mapInstance, markers, {averageCenter: true, imagePath: imgPath});
    this.addListenerToClusterer();
  }

  /**
   * 设置中心点
   */
  setCenterPoint(zoom = null) {
    const point = CommonUtil.getLatLngCenter(this.getMarkerMap());
    this.setCenterAndZoom(point[1], point[0], zoom);
  }

  /**
   * 通过经纬度设置地图中心点及缩放级别
   * param lng
   * param lat
   * param {number} zoom
   */
  public setCenterAndZoom(lng, lat, zoom = 0) {
    const point = this.createPoint(lng, lat);
    if (zoom) {
      this.mapInstance.setZoom(zoom);
    }
    if (point.lat) {
      this.mapInstance.setCenter(point);
    }

  }

  updateMarker(type, data, fn?) {
    if (type === 'add') {  // 新增
      this.addMarker(this.createMarker(data, fn));
    } else if (type === 'update') {   // 更新
      const marker = this.getMarkerById(data.deviceId);
      const imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, data.deviceType, data.deviceStatus);
      const _icon = this.getIcon(imgUrl, this._iconSize);
      marker.setIcon(_icon);
      marker.setVisible(true);
      marker.isShow = true;
      this.markersMap.set(data.deviceId, {marker: marker, data: data});
    } else if (type === 'delete') {  // 删除
      const marker = this.getMarkerById(data.deviceId);
      this.markerClusterer.removeMarker(marker);
      this.markersMap.delete(data.deviceId);
    } else if (type === 'hide') {   // 隐藏
      this.hideMarker(data.deviceId);
    } else if (type === 'show') {   // 显示
      this.showMarker(data.deviceId);
    }
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

  hideMarker(id) {
    this.getMarkerById(id).setVisible(false);
    this.getMarkerById(id).isShow = false;
  }

  /**
   * 重汇聚合点
   */
  redraw() {
    if (this.markerClusterer) {
      this.markerClusterer.resetViewport();
      this.markerClusterer.redraw();
    }
  }

  fitMapToMarkers() {
    this.markerClusterer.fitMapToMarkers();
  }

  showMarker(id) {
    this.getMarkerById(id).setVisible(true);
    this.getMarkerById(id).isShow = true;
  }

  /**
   * 切换图标
   * param url
   * returns {BMap.Icon}
   */
  toggleIcon(url) {
    const icon = this.getIcon(url, this._iconSize);
    // icon.setImageSize(this._iconSize);
    return icon;
  }

  /**
   * 隐藏其他的marker点
   * param data
   */
  hideOther(data) {
    for (const [key, value] of this.markersMap) {
      if (data.indexOf(key) < 0) {
        value.marker.setVisible(false);
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
   * 定位到当前城市
   */
  locateToUserCity(bol = false) {  // 采用原生方法
    if (bol) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.setCenterAndZoom(position.coords.longitude, position.coords.latitude, GMapConfig.defaultZoom);
        }, () => {
          console.log(this.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        console.log(this.getCenter());
      }
    }
  }

  /**
   * 通过城市名称设置地图中心(谷歌地图)
   */
  setCenterByCityName(cityName: string) {
  }

  createPoint(lng, lat) {
    return {lat, lng};
  }

  getIcon(url, size) {
    return new google.maps.MarkerImage(url, size);
  }

  locationByAddress(address) {
    this.geocoder.geocode({'address': address}, (results, status) => {
      if (status === 'OK') {
        this.mapInstance.setCenter(results[0].geometry.location);
      }
    });
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

  setMapTypeId(type) {
    this.mapInstance.setMapTypeId(type);
  }

  addNavigationControl() {
    // 谷歌地图无此插件
  }

  cityListHook() {
  }

  addOverlay(marker) {

  }

  getBounds() {
    const bounds = this.mapInstance.getBounds().toJSON();
    return {
      topLat: bounds.north,
      bottomLat: bounds.south,
      leftLng: bounds.west,
      rightLng: bounds.east,
    };
  }

  panTo(lng, lat, bol = false) {
    this.mapInstance.panTo(this.createPoint(lng, lat));
  }

  getOffset() {
    return {
      offsetX: 0,
      offsetY: 0,
    };
  }

  zoomIn(level = 1) {
    const _zoom = this.getZoom() - level;
    if (_zoom >= BMapConfig.maxZoom || _zoom <= BMapConfig.minZoom) {
      return;
    }
    this.setZoom(_zoom);
  }

  zoomOut(level = 1) {
    const _zoom = this.getZoom() + level;
    if (_zoom >= BMapConfig.maxZoom || _zoom <= BMapConfig.minZoom) {
      return;
    }
    this.setZoom(_zoom);
  }

  setZoom(zoom) {
    this.mapInstance.setZoom(zoom);
  }

  addLocationSearchControl(id, resultDomId) {

  }

  pointToOverlayPixel(lng, lat) {
    const scale = Math.pow(2, this.mapInstance.getZoom());
    const proj = this.mapInstance.getProjection();
    const bounds = this.mapInstance.getBounds();
    const nw = proj.fromLatLngToPoint(
      new google.maps.LatLng(
        bounds.getNorthEast().lat(),
        bounds.getSouthWest().lng()
      ));
    const point = proj.fromLatLngToPoint(new google.maps.LatLng(lat, lng));
    return new google.maps.Point(
      Math.floor((point.x - nw.x) * scale),
      Math.floor((point.y - nw.y) * scale)
    );
  }

  /**
   * 自定义地图 (未使用)
   */
  customMap() {
    function CoordMapType(tileSize) {
      this.tileSize = tileSize;
    }

    CoordMapType.prototype.maxZoom = 19;
    CoordMapType.prototype['name'] = 'Tile #s';
    CoordMapType.prototype.alt = 'Tile Coordinate Map Type';

    CoordMapType.prototype.getTile = function (coord, zoom, ownerDocument) {
      const div = ownerDocument.createElement('div');
      div.innerHTML = coord;
      div.style.width = this.tileSize.width + 'px';
      div.style.height = this.tileSize.height + 'px';
      div.style.fontSize = '10';
      div.style.borderStyle = 'solid';
      div.style.borderWidth = '1px';
      div.style.borderColor = '#AAAAAA';
      div.style.backgroundColor = '#E5E3DF';
      return div;
    };

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: {lat: 41.850, lng: -87.650},
      streetViewControl: false,
      mapTypeId: 'coordinate',
      mapTypeControlOptions: {
        mapTypeIds: ['coordinate', 'roadmap'],
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      }
    });

    map.addListener('maptypeid_changed', () => {
      const showStreetViewControl = map.getMapTypeId() !== 'coordinate';
      map.setOptions({
        streetViewControl: showStreetViewControl
      });
    });

    // Now attach the coordinate map type to the map's registry.
    map.mapTypes.set('coordinate', new CoordMapType(new google.maps.Size(256, 256)));
  }

  /**
   * 添加连线
   */
  addLine(data) {
    if (this.polyline) {
      this.polyline.setMap(null);
    }
    const gMap = [];
    data.map(item => {
      const obj = {
        lat: null,
        lng: null
      };
      obj.lng = item.lng * 1;
      obj.lat = item.lat * 1;
      gMap.push(obj);
    });
    console.log(gMap);
    this.polyline = new google.maps.Polyline({
      path: gMap,
      geodesic: true,
      strokeColor: '#5ed8a9',
      strokeWeight: 5,
      strokeOpacity: 1
    });
    this.polyline.setMap(this.mapInstance);
  }

  newAddLine(data) {
    const gMap = [];
    data.map(item => {
      const obj = {
        lat: null,
        lng: null
      };
      obj.lng = item.lng * 1;
      obj.lat = item.lat * 1;
      gMap.push(obj);
    });
    console.log(gMap);
    this.polyline = new google.maps.Polyline({
      path: gMap,
      geodesic: true,
      strokeColor: '#5ed8a9',
      strokeWeight: 5,
      strokeOpacity: 1
    });
    this.polylineData.push(this.polyline);
    this.polyline.setMap(this.mapInstance);
  }

  /**
   * 清除连线
   */
  clearLine() {
    if (this.polyline) {
      this.polylineData.forEach(item => {
        item.setMap(null);
      });
    }
  }

  /**
   * 根据提供的地理区域或坐标获得最佳的地图视野
   */
  getViewport(points) {
    this.res = [];
    points.forEach( item => {
      this.res.push(new google.maps.LatLng(item.lat, item.lng));
    });
    const bounds = new google.maps.LatLngBounds();
    for (let i = 0, LtLgLen = this.res.length; i < LtLgLen; i++) {
      bounds.extend(this.res[i]);
    }
    this.mapInstance.fitBounds(bounds);
  }
}
