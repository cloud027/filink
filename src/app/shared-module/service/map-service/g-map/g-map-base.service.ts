import {MapBaseAbstract} from '../map-base.abstract';
import {MapConfig} from '../../../component/map/g-map.config';
import {MapConfig as BMapConfig} from '../../../component/map/b-map.config';
import {ObjectTypeEnum} from '../../../../core-module/enum/facility/object-type.enum';

/**
 * Created by xiaoconghu on 2020/6/5.
 */

declare const google: any;
declare const MarkerClusterer: any;

export class GMapBaseService extends MapBaseAbstract {
  private _maxLng;   // 最大经度
  private _minLng;   // 最小经度
  private _maxLat;   // 最大纬度
  private _minLat;   // 最小纬度
  mapInstance;

  createBaseMap(documentId) {
    this.mapInstance = new google.maps.Map(document.getElementById(documentId), {
      zoom: MapConfig.defaultZoom,
      maxZoom: MapConfig.maxZoom,
      mapTypeControl: false,
      draggable: false,
      scrollwheel: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      zoomControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      scaleControl: false,
      streetViewControl: false,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      },
      fullscreenControl: false,
      clickableIcons: false
    });
  }

  getOffset() {
    return {
      offsetX: 0,
      offsetY: 0,
    };
  }

  setZoom(zoom) {
    this.mapInstance.setZoom(zoom);
  }

  zoomIn(level: number = 1) {
    const _zoom = this.getZoom() - level;
    if (_zoom >= BMapConfig.maxZoom || _zoom <= BMapConfig.minZoom) {
      return;
    }
    this.setZoom(_zoom);
  }

  zoomOut(level: number = 1) {
    const _zoom = this.getZoom() + level;
    if (_zoom >= BMapConfig.maxZoom || _zoom <= BMapConfig.minZoom) {
      return;
    }
    this.setZoom(_zoom);
  }

  enableScroll() {

  }

  createPoint(lng, lat) {
    return {lat, lng};
  }

  setCenterAndZoom(lng?, lat?, zoom?) {
    const point = this.createPoint(lng, lat);
    if (zoom) {
      this.mapInstance.setZoom(zoom);
    }
    if (point.lat) {
      this.mapInstance.setCenter(point);
    }
  }

  setMapTypeId(type) {
    this.mapInstance.setMapTypeId(type);
  }

  /**
   * 添加覆盖物
   * param marker
   * returns {any}
   */
  addOverlay(marker) {

  }

  createMarker(device, type = ObjectTypeEnum.facility, fn?: any[]) {

  }

  /**
   * 得到图标尺寸
   */
  getIcon(url, size) {
  }

  /**
   * 回路画线
   */
  public loopDrawLine(data): void {

  }

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

  setLabelPointNumber(num: number) {
  }

  createSize(width, height) {
  }
}
