import {BMapBaseService} from './b-map/b-map-base.service';
import {GMapBaseService} from './g-map/g-map-base.service';
import {GMapPlusService} from './g-map/g-map-plus.service';
import {BMapPlusService} from './b-map/b-map-plus.service';

declare const MAP_TYPE;

export class MapServiceUtil {
  /**
   * 判断点是否在所选区域里面
   * param pt  具体的点
   * param poly 所选区域
   * returns {boolean}
   */
  public static isInsidePolygon(pt, poly) {
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
   * 获取基础版地图
   */
  public static getBaseMap(): BMapBaseService | GMapBaseService {
    if (MAP_TYPE === 'baidu') {
      return new BMapBaseService();
    } else {
      return new GMapBaseService();
    }
  }

  /**
   * 获取plus版地图
   */
  public static getPlusMap(): BMapPlusService | GMapPlusService {
    if (MAP_TYPE === 'baidu') {
      return new BMapPlusService();
    } else {
      return new GMapPlusService();
    }
  }

  /**
   * 获取窗口视图经纬度
   */
  public static getWindowIsArea(mapInstance): { longitude: number, latitude: number }[] {
    // 获取可视区域
    const bs = mapInstance.getBounds();
    // 可视区域左下角
    const bssw = bs.getSouthWest();
    // 可视区域右上角
    const bsne = bs.getNorthEast();
    return [
      {
        longitude: bssw.lng,
        latitude: bssw.lat
      },
      {
        longitude: bsne.lng,
        latitude: bsne.lat
      }
    ];
  }
}

