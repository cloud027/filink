/**
 * Created by xiaoconghu on 2020/6/5.
 */
import {MapBaseAbstract} from '../map-base.abstract';
import {MapConfig as BMapConfig} from './b-map.config';
import {CommonUtil} from '../../../util/common-util';
import {ICON_SIZE} from '../map.config';
import {ObjectTypeEnum} from '../../../../core-module/enum/facility/object-type.enum';

declare const BMap: any;
declare const BMapLib: any;
declare const BMAP_ANCHOR_TOP_LEFT: any;
declare const BMAP_ANCHOR_TOP_RIGHT: any;

export class BMapBaseService extends MapBaseAbstract {


  /**
   * 开启滚轮缩放
   */
  enableScroll() {
    this.mapInstance.enableScrollWheelZoom(true);
  }

  createBaseMap(documentId) {
    // 创建Map实例
    this.mapInstance = new BMap.Map(documentId, {enableMapClick: false, maxZoom: BMapConfig.maxZoom});
    // 地图加载时需要给地图一个初始点位防止默认加载慢导致控制台报错
    this.mapInstance.centerAndZoom(new window['BMap'].Point(114.32423409800981, 30.570112561741844), 5);
  }

  /**
   * 获取缩放大小
   */
  getZoom() {
    return this.mapInstance.getZoom();
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
   * 获取地图相对于网页的偏移
   */
  getOffset() {
    return {
      offsetX: this.mapInstance.offsetX,
      offsetY: this.mapInstance.offsetY,
    };
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

  setMapTypeId(type) {
  }

  /**
   * 设置缩放级别
   */
  setZoom(zoom) {
    this.mapInstance.setZoom(zoom);
  }

  /**
   * 放大
   */
  zoomIn(level: number = 1) {
    const _zoom = this.getZoom() - level;
    if (_zoom > BMapConfig.maxZoom || _zoom < BMapConfig.minZoom) {
      return;
    }
    this.setZoom(_zoom);
  }

  /**
   * 缩小
   */
  zoomOut(level: number = 1) {
    const _zoom = this.getZoom() + level;
    if (_zoom > BMapConfig.maxZoom || _zoom < BMapConfig.minZoom) {
      return;
    }
    this.setZoom(_zoom);
  }


  createMarker(device, type = ObjectTypeEnum.facility, fn?: any[]) {
    let url;
    if (type === ObjectTypeEnum.facility) {
      url = CommonUtil.getFacilityIconUrl(ICON_SIZE, device.deviceType, device.deviceStatus);
    } else if (type === ObjectTypeEnum.equipment) {
      url = CommonUtil.getEquipmentTypeIconUrl(ICON_SIZE, device.equipmentType, device.equipmentStatus);
    }
    const size = ICON_SIZE.split('-');
    const marker = new BMap.Marker(this.createPoint(device.point.lng, device.point.lat), {
      icon: this.getIcon(url, this.createSize(size[0], size[1]))
    });
    if (fn && fn.length) {
      fn.forEach(item => {
        marker.addEventListener(item.eventName, item.eventHandler, {passive: false, capture: true});
      });
    }
    return marker;
  }

  /**
   * 添加覆盖物
   * param marker
   * returns {any}
   */
  addOverlay(marker) {
    this.mapInstance.addOverlay(marker);
  }

  /**
   * 得到图标尺寸
   */
  getIcon(url, size) {
    return new BMap.Icon(url, size);
  }

  /**
   * 创建图标尺寸
   */
  createSize(width, height) {
    return new BMap.Size(width, height);
  }




  /**
   * 回路画线
   * param data
   */
  public loopDrawLine(data): void {
    const mapData = [];
    data.forEach(useItem => {
      const eachItem = useItem.positionBase.split(',');
      useItem.positionBase = {lng: eachItem[0], lat: eachItem[1]};
      mapData.push(new BMap.Point(useItem.positionBase.lng * 1, useItem.positionBase.lat * 1));
    });
    const polyline = new BMap.Polyline(
      mapData,
      {strokeWeight: 3, strokeOpacity: 1}
    );
    // 增加折线
    this.mapInstance.addOverlay(polyline);
  }

  /**
   * 添加文本为数字的标注
   * param num
   */
  setLabelPointNumber(num: number) {
    const opts = {
      offset: new BMap.Size(5, -10)    // 设置文本偏移量
    };
    const label = new BMap.Label(num, opts);  // 创建文本标注对象
    label.setStyle({
      padding: '1px 3px',
      background: '#fff',
      fontSize: '8px',
      border: '1px solid #fff',
      borderRadius: '30px',
      width: '15px',
      height: '15px',
      opacity: '0.75'
    });
    return label;
  }

}
