import {MapAbstract} from './map-abstract';
import {DEFAUT_ZOOM, iconSize} from './map.config';
import {GMapDrawingService} from './g-map-drawing.service';
import {CommonUtil} from '../../util/common-util';
import {MapConfig} from '../map/g-map.config';
import {MapConfig as BMapConfig} from '../map/b-map.config';

/**
 * Created by wh1709040 on 2019/2/14.
 *  google地图选择器服务类
 */
declare let google: any;
declare let MarkerClusterer: any;

export class GMapSelectorService extends MapAbstract {
  // 地图实例
  mapInstance;
  // 地图绘制工具
  mapDrawUtil;
  // marker点map
  markersMap = new Map();

  constructor(documentId, simpleConfig?) {
    super();
    if (!simpleConfig) {
      this.createMap(documentId);
    } else {
      this.mapInstance = new google.maps.Map(document.getElementById(documentId), {
        zoom: MapConfig.defaultZoom,
        maxZoom: MapConfig.maxZoom,
        center: {lat: 30, lng: 120},
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
  }

  addMarker(point, id, fn?) {
  }

  createMarker(point, fn?) {
    const status = point.checked ? '0' : '1';
    const url = CommonUtil.getFacilityIconUrl(iconSize, point.deviceType, status);
    const icon = this.toggleIcon(url);
    const position = point.positionBase.split(',');
    const _lat = parseFloat(position[1]);
    const _lng = parseFloat(position[0]);
    super.updateCenterPoint(_lng, _lat);
    const marker = new google.maps.Marker({position: {lat: _lat, lng: _lng}});
    marker.setIcon(icon);
    marker.customData = {id: point.deviceId};
    if (fn) {
      if (fn.length > 0) {
        fn.forEach(item => {
          google.maps.event.addListener(marker, item.eventName, (event) => {
            item.eventHandler({target: marker}, event);
          });
        });
      }
    }

    if (point.deviceId) {
      this.markersMap.set(point.deviceId, {marker: marker, data: point});
    } else {
      this.markersMap.set(point.code, {marker: marker, data: point});
    }

    return marker;
  }

  clearOverlay(overlay) {
    overlay.setMap(null);
  }

  createMap(documentId) {
    this.mapInstance = new google.maps.Map(document.getElementById(documentId), {
      zoom: MapConfig.defaultZoom,
      maxZoom: MapConfig.maxZoom,
      center: {lat: 30, lng: 120},
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
    this.mapDrawUtil = new GMapDrawingService(this.mapInstance);
  }

  getMarkerById(id) {
    return this.markersMap.get(id).marker;
  }

  getMarkerDataById(id) {
    return this.markersMap.get(id).data;
  }

  isInsidePolygon(pt, poly) {
  }

  toggleIcon(url) {
    const icon = new google.maps.MarkerImage(url, new google.maps.Size(18, 30));
    return icon;
  }

  getMarkerMap(): Map<string, any> {
    return this.markersMap;
  }

  /**
   * 聚合点
   * param markers
   */
  addMarkerClusterer(markers, fn?): any {
    const imgPath = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
    const markerClusterer = new MarkerClusterer(this.mapInstance, markers, {averageCenter: true, imagePath: imgPath});
    if (fn.length && fn.length > 0) {
      fn.forEach(item => {
        const eventName = item.eventName.slice(2);
        google.maps.event.addListener(markerClusterer, `cluster${eventName}`, (__event) => {
          // 当超过谷歌地图的最大缩放级别的时候触发聚合点事件 (mouseout除外)
          if ((this.mapInstance.getZoom() >= MapConfig.maxZoom) || eventName === 'mouseout') {
            item.eventHandler(event, __event.getMarkers());
          }
        });
      });
    }
    return markerClusterer;
  }

  setCenterPoint(lat?, lng?, zoom?) {
    this.mapInstance.setCenter(new google.maps.LatLng(lat || (this.maxLat + this.minLat) / 2, lng || (this.maxLng + this.minLng) / 2));
    this.mapInstance.setZoom(zoom || DEFAUT_ZOOM);
  }

  locateToUserCity() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setCenterPoint(position.coords.latitude, position.coords.longitude, DEFAUT_ZOOM);
      }, () => {
      });
    } else {
      // Browser doesn't support Geolocation
    }
  }

  mockData() {
  }

  getLocation(overlays, fn) {
    const lat = overlays.position.lat();
    const lng = overlays.position.lng();
    const latlng = {lat: lat, lng: lng};
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': latlng}, (result) => {
      const _result = {
        address: '',
        point: {lat: lat, lng: lng},
        addressComponents: {
          province: '',
          city: '',
          district: ''
        }
      };
      if (result.length > 0) {
        _result.address = result[0].formatted_address;
        if (result.length >= 3) {
          _result.addressComponents.province = result[result.length - 1].address_components[0].long_name;
          _result.addressComponents.city = result[result.length - 2].address_components[0].long_name;
          _result.addressComponents.district = result[result.length - 3].address_components[0].long_name;
        }
      }
      fn(_result);
    });
  }

  addOverlay(marker) {
    const _marker = new google.maps.Marker({
      position: marker,
      map: this.mapInstance,
    });
    const url = `https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png`;
    _marker.setIcon(this.toggleIcon(url));
    return _marker;
  }

  createPoint(lng, lat) {
    return {lat: lat, lng: lng};
  }

  addMarkerMap(marker) {
    marker.setMap(this.mapInstance);
    // this.mapInstance.addOverlay(marker);
  }

  searchLocation(key, fn) {
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({'address': key}, fn);
  }

  addZoomEnd(fn) {
    this.mapInstance.addListener('zoom_changed', fn);
  }

  addLocationSearchControl(id, resultDomId) {
  }

  getOffset() {
    return {
      offsetX: 0,
      offsetY: 0,
    };
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

  zoomIn(level = 1) {
    const _zoom = this.mapInstance.getZoom() - level;
    if (_zoom >= BMapConfig.maxZoom || _zoom <= BMapConfig.minZoom) {
      return;
    }
    this.mapInstance.setZoom(_zoom);
  }

  zoomOut(level = 1) {
    const _zoom = this.mapInstance.getZoom() + level;
    if (_zoom >= BMapConfig.maxZoom || _zoom <= BMapConfig.minZoom) {
      return;
    }
    this.mapInstance.setZoom(_zoom);
  }
}
