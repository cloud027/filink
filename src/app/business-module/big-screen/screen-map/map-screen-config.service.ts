import {CommonUtil} from '../../../shared-module/util/common-util';
import {styleJson} from '../screen-map/map-style-config';
import {mapIconConfig} from '../../../shared-module/service/map-service/map.config';

declare const BMap: any;
declare const BMapLib: any;

export class MapScreenConfigService {
  /** Map 对象 */
  mapInstance;
  /** 标注，聚合点 */
  markerClusterer;
  /** makers点 */
  makers = [];
  /** 湖北省包含的polygon多边形 */
  polygons = [];
  /** 图标大小 */
  iconSize = mapIconConfig.defaultIconSize;
  _iconSize;

  constructor(documentId, simpleCity) {
    this.createMap(documentId, simpleCity);
  }

  createMap(documentId, simpleCity) {
    // 创建Map实例
    this.mapInstance = new BMap.Map(documentId, {enableMapClick: false});
    // 个性化地图样式设置
    this.mapInstance.setMapStyle({styleJson: styleJson});
    // 禁止拖动
    this.mapInstance.disableDragging();
    // 禁止点击
    this.mapInstance.disableDoubleClickZoom();
    this.mapInstance.dragabled = false;
    // 描绘城市
    this.creatCity(simpleCity, this.mapInstance);
    // 添加聚合点
    this.markerClusterer =  new BMapLib.MarkerClusterer(this.mapInstance, {
      markers: this.makers, styles: []
    });
  }

  /**
   * 构建地图
   */
  creatCity(city: any, map: any) {
    // point点
    let pointArray = [];
    // 市区绘图样式（边界线）
    const config = {strokeWeight: 2, strokeColor: '#98e2ff', fillColor: '#0e3c6d', fillOpacity: 0.01};
    for (let i = 0; i < city.length; i++) {
      const cityData = city[i].boundary.split('|');
      // 市区中心点经纬度
      const centerData = {
        lng: city[i].center.split(',')[0],
        lat: city[i].center.split(',')[1]
      };
      city[i]['centerData'] = centerData;
      city[i]['cityData'] = cityData;
      // 描边
      for (let j = 0; j < city[i].cityData.length; j++) {
        const ply = new BMap.Polygon(city[i]['cityData'][j], config);
        // 存储多边形，用于后面点是否在湖北省的判断
        this.polygons.push(ply);
        // 添加省市多边形边界
        map.addOverlay(ply);
        pointArray = pointArray.concat(ply.getPath());
      }
      // 在中心点添加市区名称
      this.creatCityName(city[i].areaName, city[i]['centerData']['lng'], city[i]['centerData']['lat'], map);
    }
    // 设置视图
    map.setViewport(pointArray);
  }

  /**
   * 创建城市名称
   */
  creatCityName(name, lng, lat, map) {
    const opts = {
      position: new BMap.Point(lng, lat),    // 指定文本标注所在的地理位置
      offset: new BMap.Size(-10, -10)    // 设置文本偏移量
    };
    const label = new BMap.Label(name, opts);  // 创建文本标注对象
    // 标签样式
    label.setStyle({
      color: '#a6aec3',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      border: 'none',
      padding: '0 5px',
      fontSize: '.5em',
      height: '10px',
      lineHeight: '20px',
    });
    // 设置标签名称
    label.setTitle(name);
    // 添加标签覆盖物
    map.addOverlay(label);
  }

  createSize(width, height) {
    return new BMap.Size(width, height);
  }

  /**
   * 图标实例
   */
  getIcon(url, size) {
    const icon = new BMap.Icon(url, size);
    icon.setImageSize(size);
    return icon;
  }

  /**
   *  添加maker点，及点聚合
   */
  createMakers(deviceList) {
    // 清除上次的makers点
    this.markerClusterer.clearMarkers(this.makers);
    this.makers = [];
    let pt = null;
    let i = 0;
    const size = this.iconSize.split('-');
    this._iconSize = this.createSize(size[0], size[1]);

    for (; i < deviceList.length; i++) {
      const pos = deviceList[i].positionBase.split(',');
      pt = new BMap.Point(pos[0], pos[1]);
      const marker = new BMap.Marker(pt);
      const imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, deviceList[i].deviceType, deviceList[i].deviceStatus);
      const _icon = this.getIcon(imgUrl, this._iconSize);
      marker.setIcon(_icon);
      this.makers.push(marker);
    }
    this.markerClusterer.addMarkers(this.makers);
  }

  /**
   * 根据地理坐标获取对应的覆盖物容器的坐标，此方法用于自定义覆盖物
   */
  pointToOverlayPixel(lng, lat) {
    return this.mapInstance.pointToOverlayPixel(this.createPoint(lng, lat));
  }

  /**
   * 创建点
   */
  createPoint(lng, lat) {
    return new BMap.Point(lng, lat);
  }

  /**
   * 获取地图相对网页的偏移
   */
  getOffset() {
    return {
      offsetX: this.mapInstance.offsetX,
      offsetY: this.mapInstance.offsetY,
    };
  }

  /**
   * 判断消息推送的点是否在湖北省内
   */
  isPointInHuBei(lng, lat) {
    const point = new BMap.Point(lng, lat);
    let flag = false;
    this.polygons.forEach(item => {
      flag = flag || this.isPointInPolygon(point, item);
    });
    return flag;
  }

  /**
   * 判断点是否多边形内
   * param {Point} point 点对象
   * param {Polyline} polygon 多边形对象
   * returns {Boolean} 点在多边形内返回true,否则返回false
   */
  isPointInPolygon(point, polygon) {
    // 检查类型
    if (!(point instanceof BMap.Point) || !(polygon instanceof BMap.Polygon)) {
      return false;
    }
    // 首先判断点是否在多边形的外包矩形内，如果在，则进一步判断，否则返回false
    const polygonBounds = polygon.getBounds();
    if (!this.isPointInRect(point, polygonBounds)) {
      return false;
    }
    const pts = polygon.getPath(); // 获取多边形点
    //  下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
    // 基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
    // 多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。
    const N = pts.length;
    const boundOrVertex = true; // 如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
    let intersectCount = 0; // cross points count of x
    const precision = 2e-10; // 浮点类型计算时候与0比较时候的容差
    let p1, p2; // neighbour bound vertices
    const p = point; // 测试点

    p1 = pts[0]; // left vertex
    for (let i = 1; i <= N; ++i) { // check all rays
      if (p.equals(p1)) {
        return boundOrVertex; // p is an vertex
      }
      p2 = pts[i % N]; // right vertex
      if (p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)) { // ray is outside of our interests
        p1 = p2;
        continue; // next ray left point
      }
      if (p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)) { // ray is crossing over by the algorithm (common part of)
        if (p.lng <= Math.max(p1.lng, p2.lng)) { // x is before of ray
          if (p1.lat === p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) { // overlies on a horizontal ray
            return boundOrVertex;
          }
          if (p1.lng === p2.lng) { // ray is vertical
            if (p1.lng === p.lng) { // overlies on a vertical ray
              return boundOrVertex;
            } else { // before ray
              ++intersectCount;
            }
          } else { // cross point on the left side
            const xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng; // cross point of lng
            if (Math.abs(p.lng - xinters) < precision) { // overlies on a ray
              return boundOrVertex;
            }
            if (p.lng < xinters) { // before ray
              ++intersectCount;
            }
          }
        }
      } else { // special case when ray is crossing through the vertex
        if (p.lat === p2.lat && p.lng <= p2.lng) { // p crossing over p2
          const p3 = pts[(i + 1) % N]; // next vertex
          if (p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)) { // p.lat lies between p1.lat & p3.lat
            ++intersectCount;
          } else {
            intersectCount += 2;
          }
        }
      }
      p1 = p2; // next ray left point
    }
    if (intersectCount % 2 === 0) {// 偶数在多边形外
      return false;
    } else { // 奇数在多边形内
      return true;
    }
  }

  /**
   * 判断点是否在矩形内
   * param {Point} point 点对象
   * param {Bounds} bounds 矩形边界对象
   * returns {Boolean} 点在矩形内返回true,否则返回false
   */
  isPointInRect(point, bounds) {
    // 检查类型是否正确
    if (!(point instanceof BMap.Point) || !(bounds instanceof BMap.Bounds)) {
      return false;
    }
    const sw = bounds.getSouthWest(); // 西南脚点
    const ne = bounds.getNorthEast(); // 东北脚点
    return (point.lng >= sw.lng && point.lng <= ne.lng && point.lat >= sw.lat && point.lat <= ne.lat);
  }
}
