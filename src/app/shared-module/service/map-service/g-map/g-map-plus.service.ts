/**
 * Created by xiaoconghu on 2020/6/5.
 */
import {GMapBaseService} from './g-map-base.service';
import {MapPlusPointInterface} from '../map-plus-point.interface';
import {MapPlusViewInterface} from '../map-plus-view.interface';
import {MapConfig as GMapConfig, MapConfig} from '../../../component/map/g-map.config';
import {Observable, Subject} from 'rxjs';
import {ICON_SIZE, POINT_SIZE} from '../map.config';
import {CommonUtil} from '../../../util/common-util';
import {MapConfig as BMapConfig} from '../../../component/map/b-map.config';

declare const google: any;
declare let MarkerClusterer: any;

export class GMapPlusService extends GMapBaseService implements MapPlusPointInterface, MapPlusViewInterface {

  // 地图搜索对象
  mapInstance;
  // 地图makers Map
  markersMap = new Map();
  // 图标大小
  iconSize = ICON_SIZE;
  // 区域点大小
  pointSize = POINT_SIZE;
  // 聚合点对象
  markerClusterer;
  // 画线
  polyline;
  // 地图搜索对象
  public autoComplete;
  // 回路列表画线数据
  polylineData = [];
  // 回路列表画线数据
  polylineLoopData = [];
  res = [];
  _iconSize;
  geocoder;
  isAddListener = false;
  cityTimer;
  // 城市组件状态
  private cityListStatus: Subject<any> = new Subject<any>();
  // 地图的事件
  private mapEvent: Subject<any> = new Subject<any>();

  createPlusMap(documentId: any) {
    this.mapInstance = new google.maps.Map(document.getElementById(documentId), {
      zoom: MapConfig.defaultZoom,
      maxZoom: MapConfig.maxZoom,
      center: {lat: 39.897445, lng: 116.331398},
      mapTypeControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      scaleControl: true,
      streetViewControl: false,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      },
      fullscreenControl: false,
      clickableIcons: false
    });
  }

  /**
   * 创建marker点
   */
  createMarker(point, fn?, iconUrl?): any {
    //  const url = `assets/facility-icon/icon-shiwaigui.png`;
    let url;
    this.iconSize = ICON_SIZE;
    if (iconUrl === 'area') {
      // 区域点图标
      url = `assets/facility-icon/icon_area.png`;
      this.iconSize = POINT_SIZE;
    } else {
      // facilityType：设施/设备类型
      if (point.facilityType === 'equipment') {
        // 设备点图标
        url = CommonUtil.getEquipmentTypeIconUrl(this.iconSize, point.equipmentType, point.equipmentStatus);
      } else {
        // 设施点图标
        url = CommonUtil.getFacilityIconUrl(this.iconSize, point.deviceType, point.deviceStatus);
      }
    }
    this.setIconSize();
    // 切换图标
    const icon = this.toggleIcon(url);
    // 计算坐标
    super.updateCenterPoint(point.lng, point.lat);
    // 创建marker点
    console.log(icon);
    const marker = new google.maps.Marker({position: this.createPoint(point.lng, point.lat), icon: icon});
    marker.customData = {id: point.deviceId || point.equipmentId};
    marker.isShow = true;
    // 为点添加地图事件
    if (fn) {
      if (fn.length > 0) {
        fn.forEach(item => {
          google.maps.event.addListener(marker, item.eventName, (event) => {
            item.eventHandler({target: marker}, event);
          });
        });
      }
    }
    if (iconUrl === 'area') {
      // 向地图存储区域点数据与事件
      this.markersMap.set(point.code, {marker: marker, data: point});
    } else {
      // 地图存储设施/设备点数据与事件
      this.markersMap.set(point.facilityId, {marker: marker, data: point});
    }
    return marker;
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
   * 更新marker点
   */
  updateMarker(type, data, fn?) {
    // 数据id 设施/设备
    let dataId;
    // 数据类型 设施/设备
    let dataType;
    // 数据状态 设施/设备
    let dataStatus;
    let imgUrl;
    // 设施/设备数据转换
    if (data.facilityType === 'equipment') {
      dataId = data.equipmentId;
      dataType = data.equipmentType;
      dataStatus = data.equipmentStatus;
      imgUrl = CommonUtil.getEquipmentTypeIconUrl(this.iconSize, dataType, dataStatus);
    } else {
      dataId = data.deviceId;
      dataType = data.deviceType;
      dataStatus = data.deviceStatus;
      imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, dataType, dataStatus);
    }
    if (type === 'add') {  // 新增
      this.addMarker(this.createMarker(data, fn));
    } else if (type === 'update') {   // 更新
      const marker = this.getMarkerById(dataId);
      const _icon = this.getIcon(imgUrl, this._iconSize);
      marker.setIcon(_icon);
      marker.setVisible(true);
      marker.isShow = true;
      this.markersMap.set(dataId, {marker: marker, data: data});
    } else if (type === 'delete') {
      // 删除marker点
      const marker = this.getMarkerById(dataId);
      if (marker) {
        this.markerClusterer.removeMarker(marker);
        this.markersMap.delete(dataId);
      }
    } else if (type === 'hide') {
      // 隐藏marker点
      this.hideMarker(dataId);
    } else if (type === 'show') {
      // 显示marker点
      this.showMarker(dataId);
    }
  }


  /**
   * 胡孝聪
   * 创建设施点 新方法
   */
  createNewMarker(mapPoint, markerIcon, fn?: any[]): any {
  }

  /**
   * 胡孝聪新方法
   */
  setMarkerMap(key: string, value: { marker: any; data: any }): void {
  }

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
   * 聚合点重绘
   */
  markerRedraw() {
    if (this.markerClusterer) {
      this.markerClusterer.redraw();
    }
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
      // 拖拽结束
      this.mapEventEmitter({type: 'dragend'});
    });

    this.mapInstance.addListener('click', e => {
      console.log(e);
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


  addMarkerClusterer(markers, fn?, iSHiddenZoom = false) {
    const imgPath = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
    this.markerClusterer = new MarkerClusterer(this.mapInstance, markers, {averageCenter: true, imagePath: imgPath});
    // this.addListenerToClusterer();
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
   * param lng
   * param lat
   * param {number} zoom
   */
  public setCenterAndZoom(lng, lat, zoom = 0) {
    const point = this.createPoint(Number(lng), Number(lat));
    if (zoom) {
      this.mapInstance.setZoom(zoom);
    }
    if (point.lat) {
      this.mapInstance.setCenter(point);
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
    console.log(111);
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
    points.forEach(item => {
      this.res.push(new google.maps.LatLng(item.lat, item.lng));
    });
    const bounds = new google.maps.LatLngBounds();
    for (let i = 0, LtLgLen = this.res.length; i < LtLgLen; i++) {
      bounds.extend(this.res[i]);
    }
    this.mapInstance.fitBounds(bounds);
  }

  addZoomEnd(fn) {
    this.mapInstance.addListener('zoom_changed', fn);
  }

  /**
   * 罗丹丹新功能
   * 回路画线
   */
  loopDrawLine(data) {

  }

  /**
   * 罗丹丹新功能
   * 清除回路画线
   */
  public clearLoopDrawLine(): void {

  }

  /**
   * 胡孝聪新方法 todo
   * 添加地图类型控件
   */
  addMapTypeControl() {

  }

  /**
   * 百度地图首页切换到其他页面时有div未清除
   * 谷歌暂未测试 todo
   * 地图对象销毁
   */
  destroy() {

  }

  searchLocation(key, fn) {
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({'address': key}, fn);
  }

  //
  // /**
  //  * 添加marker点
  //  */
  // addMarker(marker) {
  //   this.markerClusterer.addMarker(marker);
  // }
  //
  // /**
  //  * 聚合点
  //  * param markers
  //  */
  // addMarkerClusterer(markers, fn?) {
  //   const imgPath = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
  //   this.markerClusterer = new MarkerClusterer(this.mapInstance, markers, {averageCenter: true, imagePath: imgPath});
  //   this.addListenerToClusterer();
  // }
  //
  // addListenerToClusterer() {
  //   if (!this.markerClusterer) {
  //     return;
  //   }
  //
  //   google.maps.event.addListener(this.markerClusterer, 'clustermouseover', c => {
  //     if (this.getZoom() >= GMapConfig.maxZoom) {
  //       this.mapEventEmitter({
  //         target: 'c',
  //         type: 'mouseover',
  //         event: event,
  //         markers: c.getMarkers()
  //       });
  //     }
  //   });
  //   google.maps.event.addListener(this.markerClusterer, 'clustermouseout', c => {
  //     this.mapEventEmitter({
  //       target: 'c',
  //       type: 'mouseout',
  //     });
  //   });
  //   google.maps.event.addListener(this.markerClusterer, 'clusterclick', c => {
  //     if (this.getZoom() >= GMapConfig.maxZoom) {
  //       this.mapEventEmitter({
  //         target: 'c',
  //         type: 'click',
  //         event: event,
  //         markers: c.getMarkers()
  //       });
  //     }
  //   });
  //   this.isAddListener = true;
  // }
  //
  // /**
  //  * 添加覆盖物
  //  */
  // addOverlay(marker): any {
  // }
  //
  //
  // /**
  //  * 清空所有缓存数据
  //  */
  // clearMarkerMap() {
  //   this.markersMap.clear();
  // }
  //
  //
  // /**
  //  * 创建图标尺寸
  //  */
  // createSize(width, height) {
  //   return new google.maps.Size(width, height);
  // }
  //
  //
  // /**
  //  * 获取定位
  //  */
  // getLocation(point, fn?) {
  // }
  //
  //

  //
  //
  // /**
  //  * 通过id获取marker
  //  */
  // getMarkerById(id) {
  //   if (this.markersMap.get(id)) {
  //     return this.markersMap.get(id).marker;
  //   } else {
  //     return null;
  //   }
  // }
  //
  // /**
  //  * 通过id获取marker对应的数据
  //  */
  // getMarkerDataById(id) {
  //   if (this.markersMap.get(id)) {
  //     return this.markersMap.get(id).data;
  //   } else {
  //     return null;
  //   }
  // }
  //
  // /**
  //  * 获取marker对应的数据
  //  */
  // getMarkerMap(): Map<string, any> {
  //   return this.markersMap;
  // }
  //
  //
  // /**
  //  * 隐藏marker点
  //  */
  // hideMarker(id) {
  //   this.getMarkerById(id).setVisible(false);
  //   this.getMarkerById(id).isShow = false;
  // }
  //
  //
  // /**
  //  * 显示marker
  //  */
  // showMarker(id) {
  //   this.getMarkerById(id).setVisible(true);
  //   this.getMarkerById(id).isShow = true;
  // }
  //
  //
  // /**
  //  * 定位到当前城市
  //  */
  // locateToUserCity(bol = false) {  // 采用原生方法
  //   if (bol) {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(position => {
  //         this.setCenterAndZoom(position.coords.longitude, position.coords.latitude, GMapConfig.defaultZoom);
  //       }, () => {
  //         console.log(this.getCenter());
  //       });
  //     } else {
  //       // Browser doesn't support Geolocation
  //       console.log(this.getCenter());
  //     }
  //   }
  // }
  //
  // /**
  //  * 获取中心点
  //  */
  // getCenter() {
  //   const centerPoint = this.mapInstance.getCenter();
  //   return {
  //     lng: centerPoint.lng(),
  //     lat: centerPoint.lat(),
  //   };
  // }
  //
  //

  //
  // /**
  //  * 清除覆盖物
  //  * param overlay
  //  */
  // removeOverlay(overlay) {
  //   this.mapInstance.removeOverlay(overlay);
  // }
  //
  //
  // /**
  //  * 设置图标尺寸
  //  */
  // setIconSize() {
  //   const size = this.iconSize.split('-');
  //   this._iconSize = this.createSize(size[0], size[1]);
  // }
  //
  //
  // /**
  //  * 切换图标
  //  * param url
  //  * returns
  //  */
  // toggleIcon(url) {
  //   const icon = this.getIcon(url, this._iconSize);
  //   // icon.setImageSize(this._iconSize);
  //   return icon;
  // }
  //
  // /**
  //  * 设置中心点
  //  */
  // setCenterPoint(zoom = null) {
  //   const point = CommonUtil.getLatLngCenter(this.getMarkerMap());
  //   this.setCenterAndZoom(point[1], point[0], zoom);
  // }
  //
  // /**
  //  * 通过经纬度设置地图中心点及缩放级别
  //  * param lng
  //  * param lat
  //  * param {number} zoom
  //  */
  // public setCenterAndZoom(lng, lat, zoom = 0) {
  //   const point = this.createPoint(lng, lat);
  //   if (zoom) {
  //     this.mapInstance.setZoom(zoom);
  //   }
  //   if (point.lat) {
  //     this.mapInstance.setCenter(point);
  //   }
  //
  // }
  //
  // /**
  //  * 得到图标尺寸
  //  */
  // getIcon(url, size) {
  //   return new google.maps.MarkerImage(url, size);
  // }
  //
  //
  //
  //
  // /**
  //  * 隐藏其他的marker点
  //  * param data
  //  */
  // hideOther(data) {
  //   for (const [key, value] of this.markersMap) {
  //     if (data.indexOf(key) < 0) {
  //       value.marker.setVisible(false);
  //       value.marker.isShow = false;
  //     }
  //   }
  // }
  //
  // /**
  //  * 添加定位搜索控件
  //  */
  // addLocationSearchControl(id, resultDomId) {
  // }
  //
  //
  // /**
  //  * 设置搜索位置
  //  */
  // setPlace(myValue) {
  //
  // }
  //
  // /**
  //  * 根据地理坐标获取对应的覆盖物容器的坐标，此方法用于自定义覆盖物
  //  */
  // pointToOverlayPixel(lng, lat) {
  //   const scale = Math.pow(2, this.mapInstance.getZoom());
  //   const proj = this.mapInstance.getProjection();
  //   const bounds = this.mapInstance.getBounds();
  //   const nw = proj.fromLatLngToPoint(
  //     new google.maps.LatLng(
  //       bounds.getNorthEast().lat(),
  //       bounds.getSouthWest().lng()
  //     ));
  //   const point = proj.fromLatLngToPoint(new google.maps.LatLng(lat, lng));
  //   return new google.maps.Point(
  //     Math.floor((point.x - nw.x) * scale),
  //     Math.floor((point.y - nw.y) * scale)
  //   );
  // }
  //
  //


  //
  //
  // /**
  //  * 城市选择组件状态改变
  //  */
  // public cityListHook(): Observable<any> {
  //   return this.cityListStatus.asObservable();
  // }
  //
  // /**
  //  * 中心点移动
  //  */
  // panTo(lng, lat, bol = false) {
  //   this.mapInstance.panTo(this.createPoint(lng, lat));
  // }
  //
  // /**
  //  * 批量修改图标大小
  //  */
  // changeAllIconSize(iconSize) {
  //   this.iconSize = iconSize;
  //   this.setIconSize();
  //   for (const [key, value] of this.markersMap) {
  //     const imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, value.data.deviceType, value.data.deviceStatus);
  //     const _icon = this.getIcon(imgUrl, this._iconSize);
  //     value.marker.setIcon(_icon);
  //   }
  // }
  //
  //
  // /**
  //  * 地图事件
  //  */
  // public mapEventHook(): Observable<any> {
  //   return this.mapEvent.asObservable();
  // }
  //
  // /**
  //  * 通过地址定位
  //  */
  // locationByAddress(address) {
  //   this.geocoder.geocode({'address': address}, (results, status) => {
  //     if (status === 'OK') {
  //       this.mapInstance.setCenter(results[0].geometry.location);
  //     } else {
  //     }
  //   });
  // }
  //
  //
  // /**
  //  * 清除连线
  //  */
  // clearLine() {
  //   if (this.polyline) {
  //     this.polylineData.forEach(item => {
  //       item.setMap(null);
  //     });
  //   }
  // }
  //
  //
  // /**
  //  * 画线
  //  * param data
  //  */
  // newAddLine(data) {
  //   const gMap = [];
  //   data.map(item => {
  //     const obj = {
  //       lat: null,
  //       lng: null
  //     };
  //     obj.lng = item.lng * 1;
  //     obj.lat = item.lat * 1;
  //     gMap.push(obj);
  //   });
  //   console.log(gMap);
  //   this.polyline = new google.maps.Polyline({
  //     path: gMap,
  //     geodesic: true,
  //     strokeColor: '#5ed8a9',
  //     strokeWeight: 5,
  //     strokeOpacity: 1
  //   });
  //   this.polylineData.push(this.polyline);
  //   this.polyline.setMap(this.mapInstance);
  // }
  //
  //

  //
  //
  // /**
  //  * 根据提供的地理区域或坐标获得最佳的地图视野
  //  */
  // getViewport(points) {
  //   this.res = [];
  //   points.forEach(item => {
  //     this.res.push(new google.maps.LatLng(item.lat, item.lng));
  //   });
  //   const bounds = new google.maps.LatLngBounds();
  //   for (let i = 0, LtLgLen = this.res.length; i < LtLgLen; i++) {
  //     bounds.extend(this.res[i]);
  //   }
  //   this.mapInstance.fitBounds(bounds);
  // }
  //
  //

  //
  //
  // /**
  //  * 给地图添加事件
  //  */
  // addEventListenerToMap() {
  //   this.mapInstance.addListener('zoom_changed', () => {
  //     // 地图缩放
  //     this.mapEventEmitter({type: 'zoomend'});
  //   });
  //   this.mapInstance.addListener('dragend', () => {
  //     this.mapEventEmitter({type: 'dragend'});
  //   });
  //
  //   this.mapInstance.addListener('click', e => {
  //     if (!e.customData) {
  //       setTimeout(() => {
  //         this.mapEventEmitter({type: 'click'});
  //       }, 0);
  //     } else {
  //     }
  //   });
  //
  //   this.mapInstance.addListener('maptypeid_changed', () => {
  //     // this.mapInstance.getMapTypeId()
  //   });
  // }
  //
  //

  //
  //
  // /**
  //  * 地图回传
  //  */
  // private mapEventEmitter(data): void {
  //   this.mapEvent.next(data);
  // }
  //
  // zoomIn(level = 1) {
  //   const _zoom = this.mapInstance.getZoom() - level;
  //   if (_zoom >= BMapConfig.maxZoom || _zoom <= BMapConfig.minZoom) {
  //     return;
  //   }
  //   this.mapInstance.setZoom(_zoom);
  // }
  //
  // zoomOut(level = 1) {
  //   const _zoom = this.mapInstance.getZoom() + level;
  //   if (_zoom >= BMapConfig.maxZoom || _zoom <= BMapConfig.minZoom) {
  //     return;
  //   }
  //   this.mapInstance.setZoom(_zoom);
  // }

}
