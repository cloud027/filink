/**
 * Created by xiaoconghu on 2020/6/5.
 */
import {BMapBaseService} from './b-map-base.service';
import {MapPlusPointInterface} from '../map-plus-point.interface';
import {MapPlusViewInterface} from '../map-plus-view.interface';
import {MapConfig as BMapConfig} from './b-map.config';
import {CommonUtil} from '../../../util/common-util';
import {Observable, Subject} from 'rxjs';
import {DEFAUT_ZOOM} from '../../../component/map-selector/map.config';
import {bigIconSize, ICON_SIZE, POINT_SIZE} from '../map.config';
import * as _ from 'lodash';
import {MapTypeEnum} from '../../../enum/filinkMap.enum';

declare const BMap: any;
declare const BMapLib: any;
declare const BMAP_NORMAL_MAP: any;
declare const BMAP_SATELLITE_MAP: any;
declare const BMAP_ANCHOR_BOTTOM_RIGHT: any;

export class BMapPlusService extends BMapBaseService implements MapPlusPointInterface, MapPlusViewInterface {

  // 地图makers Map
  markersMap = new Map();
  // 聚合点对象
  markerClusterer;
  // 图标大小
  iconSize = ICON_SIZE;
  // 区域点大小
  pointSize = POINT_SIZE;
  // 画线
  polyline;
  // 回路列表画线数据
  public polylineLoopData = [];
  // 地图搜索对象
  public autoComplete;
  // 画线的数据
  private polylineData = [];
  // 城市组件状态
  private cityListStatus: Subject<any> = new Subject<any>();
  // 地图的事件
  private mapEvent: Subject<any> = new Subject<any>();
  // 存储回路的颜色和id进行绑定
  private loopColorSet = new Map<string, string>();

  createPlusMap(documentId) {
    // 创建Map实例
    this.mapInstance = new BMap.Map(documentId, {enableMapClick: false, maxZoom: BMapConfig.maxZoom});
    // 地图加载时需要给地图一个初始点位防止默认加载慢导致控制台报错
    this.mapInstance.centerAndZoom(new window['BMap'].Point(114.32423409800981, 30.570112561741844), 5);
    // 添加地图类型控件
    this.addMapTypeControl();
    // 启动滚轮缩放
    this.enableScroll();
  }

  /**
   * 创建marker点
   * param point
   * param fn
   * returns {BMap.Marker}
   */
  createMarker(point, fn?, inconSize?, iconUrl?) {
    let url;
    this.iconSize = inconSize || ICON_SIZE;
    if (iconUrl) {
      // 区域点图标
      if (iconUrl === 'area') {
        url = `assets/facility-icon/icon_area.png`;
      }
      // 规划点
      if (iconUrl === 'plan') {
        url = `assets/facility-icon/icon_plan.png`;
      }
      // 项目点
      if (iconUrl === 'project') {
        url = `assets/facility-icon/icon_project.png`;
      }
      this.iconSize = POINT_SIZE;
    } else {
      // facilityType：设施/设备类型
      if (point.facilityType === 'equipment') {
        // 设备点图标
        url = CommonUtil.getEquipmentTypeIconUrl(this.iconSize, point.equipmentType, point.equipmentStatus, point.equipmentList);
      } else {
        if (point.pointStatus) {
          // 设施建设状态图标
          url = CommonUtil.getFacilityPointIconUrl(this.iconSize, point.deviceType, point.pointStatus);
        } else {
          // 设施点状态图标
          url = CommonUtil.getFacilityIconUrl(this.iconSize, point.deviceType, point.deviceStatus);
        }
      }
    }
    // 为图标添加尺寸
    const icon = this.toggleIcon(url);
    // 创建点
    const marker = new BMap.Marker(this.createPoint(point.lng, point.lat), {
      icon: icon
    });
    if (iconUrl) {
      // 区域点标识
      if (iconUrl === 'area') {
        marker.customData = {code: point.code};
        marker.isShow = {areaId: point.areaId};
      }
      // 规划点标识
      if (iconUrl === 'plan') {
        marker.customData = {code: point.planId};
        marker.isShow = {areaId: point.planId};
      }
      // 项目点标识
      if (iconUrl === 'project') {
        marker.customData = {code: point.projectId};
        marker.isShow = {areaId: point.projectId};
      }
      marker.allData = point;
      if (point.count) {
        // 设施区域点添加数字
        marker.setLabel(this.getPointNumber(point.count));
      } else {
        let num = 0;
        point.equipmentData.forEach(item => {
          num = num + item.count;
        });
        // 设备点区域点添加数字
        marker.setLabel(this.getPointNumber(num));
      }
    } else {
      if (point.equipmentList && point.equipmentList.length > 1) {
        // 多重设备点添加数字
        marker.setLabel(this.getEPointNumber(point.equipmentList.length));
      }
      marker.customData = {id: point.facilityId};
      marker.isShow = {id: point.facilityId};
    }

    if (fn) {
      // 为点添加地图事件
      if (fn.length > 0) {
        fn.forEach(item => {
          marker.addEventListener(item.eventName, item.eventHandler, {passive: false, capture: true});
        });
      }
    }
    marker.$detail = point;
    if (iconUrl) {
      // 区域点标识
      if (iconUrl === 'area') {
        // 向地图存储区域点数据与事件
        this.markersMap.set(point.code, {marker: marker, data: point});
      }
      // 规划点标识
      if (iconUrl === 'plan') {
        this.markersMap.set(point.planId, {marker: marker, data: point});
      }
      // 项目点标识
      if (iconUrl === 'project') {
        this.markersMap.set(point.projectId, {marker: marker, data: point});
      }
    } else {
      // 地图存储设施/设备点数据与事件
      this.markersMap.set(point.facilityId, {marker: marker, data: point});
    }
    return marker;
  }

  /**
   * 创建设施点 新方法
   */
  createNewMarker(mapPoint, markerIcon, fn?: any[], nodeData?) {
    const marker = new BMap.Marker(mapPoint, {icon: markerIcon});
    if (fn && fn.length) {
      fn.forEach(item => {
        marker.addEventListener(item.eventName, item.eventHandler);
      });
    }
    if (nodeData) {
      nodeData.lat = marker.point.lat;
      nodeData.lng = marker.point.lng;
      nodeData.positionBase = `${marker.point.lng},${marker.point.lat}`;
      marker.$detail = nodeData;
    }
    return marker;
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
   * 聚合点
   * param markers
   */
  addMarkerClusterer(markers, fn?, iSHiddenZoom = false, zoom?) {
    const eventMap = new Map();
    const hiddenZoom = zoom ? zoom : BMapConfig.hiddenZoom;
    if (fn && fn.length > 0) {
      fn.forEach(item => {
        eventMap.set(item.eventName, item.eventHandler);
      });
    }
    this.markerClusterer = new BMapLib.MarkerClusterer(this.mapInstance, {
      markers: markers,
      hiddenZoom: iSHiddenZoom ? null : hiddenZoom,
      maxZoom: BMapConfig.maxZoom,
      isAverageCenter: true,
    }, (event, data) => {
      if (eventMap.get(event.type)) {
        eventMap.get(event.type)(event, data);
      }
    });
  }

  /**
   * 添加覆盖物
   * param marker
   * returns {any}
   */
  addOverlay(marker) {
    const overlay = new BMap.Marker(marker);
    this.mapInstance.addOverlay(overlay);
    return overlay;
  }

  /**
   * 清空所有缓存数据
   */
  clearMarkerMap() {
    this.markersMap.clear();
  }

  /**
   * 创建图标尺寸
   */
  createSize(width, height) {
    return new BMap.Size(width, height);
  }

  /**
   * 获取定位
   */
  getLocation(point, fn) {
    // 创建地址解析器实例
    const geoCoder = new BMap.Geocoder();
    geoCoder.getLocation(point, fn);
  }

  /**
   * 胡孝聪新方法
   */
  setMarkerMap(key: string, value: { marker: any; data: any }): void {
    this.markersMap.set(key, value);
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
   * 通过id获取makrer对应的数据
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
   * 隐藏marker点
   */
  hideMarker(id) {
    const marker = this.getMarkerById(id);
    if (marker) {
      marker.hide();
      marker.isShow = false;
    }
  }

  /**
   * 显示marker
   */
  showMarker(id) {
    const marker = this.getMarkerById(id);
    if (marker) {
      marker.show();
      marker.isShow = true;
    }
  }

  /**
   * 定位到当前城市
   */
  locateToUserCity() {
    const that = this;
    const myFun = (result) => {
      const cityName = result.name;
      if (that.mapInstance) {
        that.mapInstance.centerAndZoom(cityName);
      }
    };
    const myCity = new BMap.LocalCity();
    myCity.get(myFun);
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
   * 清除覆盖物
   * param overlay
   */
  removeOverlay(overlay) {
    this.mapInstance.removeOverlay(overlay);
  }

  /**
   * 设置图标尺寸
   */
  setIconSize() {
    const size = this.iconSize.split('-');
    return this.createSize(size[0], size[1]);
  }

  /**
   * 切换图标
   * param url
   * returns {BMap.Icon}
   */
  toggleIcon(url, iconSize?) {
    let size = [];
    if (iconSize) {
      size = iconSize.split('-');
    } else {
      size = this.iconSize.split('-');
    }
    return this.getIcon(url, this.createSize(size[0], size[1]));
  }

  /**
   * 切换大图标
   * param url
   * returns {BMap.Icon}
   */
  toggleBigIcon(url) {

    const size = bigIconSize.split('-');
    return this.getIcon(url, this.createSize(size[0], size[1]));
  }

  /**
   * 设置中心点
   */
  setCenterPoint(zoom?) {
    const point = CommonUtil.getLatLngCenter(this.getMarkerMap());
    this.setCenterAndZoom(point[1], point[0], zoom || DEFAUT_ZOOM);
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
      imgUrl = CommonUtil.getEquipmentTypeIconUrl(this.iconSize, dataType, dataStatus, data.equipmentList);
    } else if (data.facilityType === 'device' && !data.pointId) {
      dataId = data.deviceId;
      dataType = data.deviceType;
      dataStatus = data.deviceStatus;
      imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, dataType, dataStatus);
    } else if (data.pointId) {
      dataId = data.pointId;
      dataType = data.deviceType;
      dataStatus = data.pointStatus;
      imgUrl = CommonUtil.getFacilityPointIconUrl(this.iconSize, dataType, dataStatus);
    } else {
      dataId = data.code;
    }
    if (type === 'add') {
      // 新增
      this.addMarker(this.createMarker(data, fn));
    } else if (type === 'update') {
      // 更新
      const marker = this.getMarkerById(dataId);
      const _icon = this.toggleIcon(imgUrl);
      marker.setIcon(_icon);
      marker.show();
      marker.isShow = true;
      this.markersMap.set(dataId, {marker: marker, data: data});
    } else if (type === 'delete') {
      // 删除marker点
      this.markersMap.delete(dataId);
    } else if (type === 'hide') {
      // 隐藏marker点
      this.hideMarker(dataId);
    } else if (type === 'show') {
      // 显示marker点
      this.showMarker(dataId);
    }
  }

  // removeFun(id) {
  //   let _this = this;
  //   let allOverlay = this.mapInstance.getOverlays();
  //   if
  // }

  /**
   * 隐藏其他的marker点
   * param data
   */
  hideOther(data) {
    this.markersMap.forEach((value, key) => {
      if (data.indexOf(key) < 0) {
        value.marker.setVisible(false);
        value.marker.isShow = false;
      }
    });
  }

  /**
   * 添加地图搜索组件
   * param id
   * param resultDomId
   */
  addLocationSearchControl(id, resultDomId) {
    this.autoComplete = new BMap.Autocomplete(    // 建立一个自动完成的对象
      {
        'input': id,
        'location': this.mapInstance,
      });
    this.autoComplete.addEventListener('onhighlight', function (e) {  // 鼠标放在下拉列表上的事件
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
    }, {passive: false, capture: true});
    let myValue;
    this.autoComplete.addEventListener('onconfirm', e => {    // 鼠标点击下拉列表后的事件
      const _value = e.item.value;
      myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      document.getElementById(resultDomId).innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue;
      this.setPlace(myValue);
    }, {passive: false, capture: true});
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
   * 根据地理坐标获取对应的覆盖物容器的坐标，此方法用于自定义覆盖物
   */
  pointToOverlayPixel(lng, lat) {
    return this.mapInstance.pointToOverlayPixel(this.createPoint(lng, lat));
  }


  searchLocation(key, fn) {
  }

  addZoomEnd(fn) {
    this.mapInstance.addEventListener('zoomend', fn, {passive: false, capture: true});
  }

  /**
   * 城市选择组件状态改变
   */
  public cityListHook(): Observable<any> {
    return this.cityListStatus.asObservable();
  }

  /**
   * 中心点移动
   */
  panTo(lng, lat, bol = false) {
    this.mapInstance.panTo(this.createPoint(lng, lat), {noAnimation: bol});
  }

  /**
   * 批量修改图标大小
   */
  changeAllIconSize(iconSize) {
    this.iconSize = iconSize;
    this.setIconSize();
    let imgUrl = '';
    for (const [value] of this.markersMap) {
      if (value.data.facilityType === MapTypeEnum.device) {
        // 获取设施点图标
        imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, value.data.deviceType, value.data.deviceStatus);
        value.marker.setIcon(this.toggleIcon(imgUrl));
      } else if (value.data.facilityType === MapTypeEnum.equipment) {
        // 获取设备点图标
        imgUrl = CommonUtil.getEquipmentTypeIconUrl(this.iconSize, value.data.equipmentType, value.data.equipmentStatus, value.data.equipmentList);
        value.marker.setIcon(this.toggleIcon(imgUrl));
      }
    }
  }

  /**
   * 地图事件
   */
  public mapEventHook(): Observable<any> {
    return this.mapEvent.asObservable();
  }

  /**
   * 通过地址定位
   */
  locationByAddress(name) {

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
   * 画线
   * param data
   */
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
   * 回路画线
   * param data
   */
  public loopDrawLine(data, fn?): void {
    // 每次重新绘制前先清除
    this.clearLoopDrawLine();
    data.map(item => {
      const mapData = [];
      item.forEach(useItem => {
        if (typeof (useItem.positionBase) === 'string') {
          const eachItem = useItem.positionBase.split(',');
          useItem.positionBase = {lng: eachItem[0], lat: eachItem[1]};
          mapData.push(new BMap.Point(useItem.positionBase.lng * 1, useItem.positionBase.lat * 1));
        } else {
          mapData.push(new BMap.Point(useItem.positionBase.lng * 1, useItem.positionBase.lat * 1));
        }
      });
      let colorStyle = '';
      // 随机生成颜色
      if (!_.isEmpty(item)) {
        if (this.loopColorSet.has(item[0].loopId)) {
          colorStyle = this.loopColorSet.get(item[0].loopId);
        } else {
          colorStyle = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
          this.loopColorSet.set(item[0].loopId, colorStyle);
        }
      }
      const polyline = new BMap.Polyline(
        mapData,
        {strokeColor: colorStyle, strokeWeight: 3, strokeOpacity: 1},
      );
      const loopData = {
        loopId: item[0].loopId
      };
      polyline['data'] = loopData;
      if (fn) {
        // 为点添加地图事件
        if (fn.length > 0) {
          fn.forEach(v => {
            polyline.addEventListener(v.eventName, v.eventHandler, {passive: false, capture: true});
          });
        }
      }
      // 创建折线保存
      this.polylineLoopData.push(polyline);
      // 增加折线
      this.mapInstance.addOverlay(polyline);
    });
  }

  /**
   * 清除回路画线
   */
  public clearLoopDrawLine(): void {
    if (!_.isEmpty(this.polylineLoopData)) {
      this.polylineLoopData.forEach(item => {
        this.mapInstance.removeOverlay(item);
      });
      this.polylineLoopData = [];
    }
  }


  /**
   * 根据提供的地理区域或坐标获得最佳的地图视野
   */
  getViewport(points) {
    return this.mapInstance.getViewport(points);
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
   * 给地图添加事件
   */
  addEventListenerToMap() {
    // 点击事件
    this.mapInstance.addEventListener('click', e => {
      const type = e.overlay ? e.overlay.toString() : '';
      if (type !== '[object Marker]') {
        this.mapEventEmitter({type: 'click', data: e});
      }
    }, {passive: false, capture: true});
    this.mapInstance.addEventListener('zoomend', () => {
      this.mapEventEmitter({type: 'zoomend'});
    }, {passive: false, capture: true});
    this.mapInstance.addEventListener('dragend', () => {
      this.mapEventEmitter({type: 'dragend'});
    }, {passive: false, capture: true});
  }

  /**
   * 地图对象销毁
   */
  destroy() {
    super.destroy();
    if (this.autoComplete) {
      this.autoComplete.dispose();
    }
  }

  // 绑定对应数据文字
  getPointNumber(number) {
    let offsetSize = new BMap.Size(0, 0);
    const labelStyle = {
      color: '#000',
      backgroundColor: '0.05',
      border: '0',
      fontWeight: 'bold',
      fontSize: '12px'
    };

    // 不同数字长度需要设置不同的样式。
    switch ((number + '').length) {
      case 1:
        labelStyle.fontSize = '10px';
        offsetSize = new BMap.Size(20, 17);
        break;
      case 2:
        labelStyle.fontSize = '10px';
        offsetSize = new BMap.Size(17, 17);
        break;
      case 3:
        labelStyle.fontSize = '10px';
        offsetSize = new BMap.Size(12, 17);
        break;
      case 4:
        labelStyle.fontSize = '10px';
        offsetSize = new BMap.Size(10, 17);
        break;
      case 5:
        labelStyle.fontSize = '10px';
        offsetSize = new BMap.Size(8, 17);
        break;
      default:
        break;
    }

    const label = new BMap.Label(number, {
      offset: offsetSize
    });
    label.setStyle(labelStyle);
    return label;
  }

  /**
   * 根据屏幕自适应显示所有的点
   */
  public centerAndZoom(points): void {
    const view = this.mapInstance.getViewport(points, {enableAnimation: false, margins: [0, 0, 0, 0], zoomFactor: 0,});
    this.mapInstance.centerAndZoom(view.center, view.zoom);
  }

  getEPointNumber(number) {

    const labelStyle = {
      padding: '1px 3px',
      background: '#fff',
      fontSize: '8px',
      border: '1px solid #fff',
      borderRadius: '30px',
      width: '15px',
      height: '15px',
      opacity: '0.75'
    };

    switch ((number + '').length) {
      case 1:
        labelStyle.width = '15px';
        break;
      case 2:
        labelStyle.width = '21px';
        break;
      case 3:
        labelStyle.width = '28px';
        break;
      default:
        break;
    }

    const opts = {
      // position: ase,    // 指定文本标注所在的地理位置
      offset: new BMap.Size(5, -10)    // 设置文本偏移量
    };
    const label = new BMap.Label(number, opts);  // 创建文本标注对象
    label.setStyle(labelStyle);
    this.mapInstance.addOverlay(label);
    return label;
  }

  /**
   * 地图回传
   */
  private mapEventEmitter(data): void {
    this.mapEvent.next(data);
  }
}
