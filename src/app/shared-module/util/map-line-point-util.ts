import {Injectable} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {BMapPlusService} from '../service/map-service/b-map/b-map-plus.service';
import {FiLinkModalService} from '../service/filink-modal/filink-modal.service';
import {GMapPlusService} from '../service/map-service/g-map/g-map-plus.service';
import {IndexLanguageInterface} from '../../../assets/i18n/index/index.language.interface';
import {LanguageEnum} from '../enum/language.enum';
import {CommonUtil} from './common-util';
import * as lodash from 'lodash';

declare let BMap: any;   // 一定要声明BMap，要不然报错找不到BMap
declare let BMapLib: any;
declare const BMAP_NORMAL_MAP: any;
declare const BMAP_SATELLITE_MAP: any;
declare const BMAP_ANCHOR_BOTTOM_RIGHT: any;
declare const OBMap_ANCHOR_TOP_LEFT: any;
declare const BMAP_ANCHOR_TOP_LEFT: any;

/**
 * 地图划线分点操作
 */
@Injectable()
export class MapLinePointUtil {
  public mapService: BMapPlusService | GMapPlusService;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // Marker集合
  public markerArr = [];

  constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
  ) {
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
  }

  /**
   * 根据维度获取该弧度
   */
  public rad(d: number): number {
    return d * Math.PI / 180.0;
  }

  /**
   * 根据弧度获取该角度
   */
  public deg(x: number): number {
    return x * 180 / Math.PI;
  }

  /**
   * 根据两点经纬度获取角度偏移量
   * (lng_a, lat_a)A经纬坐标
   * (lng_b, lat_b)B经纬坐标
   */
  public getAngle(lng_a, lat_a, lng_b, lat_b): number {
    const a = this.rad(90 - lat_b);
    const b = this.rad(90 - lat_a);
    const AOC_BOC = this.rad(lng_b - lng_a);
    const cosc = Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(AOC_BOC);
    const sinc = Math.sqrt(1 - cosc * cosc);
    const sinA = Math.sin(a) * Math.sin(AOC_BOC) / sinc;
    const A = this.deg(Math.asin(sinA));
    let res = 0;
    if (lng_b > lng_a && lat_b > lat_a) {
      res = A;
    } else if (lng_b > lng_a && lat_b < lat_a) {
      res = 180 - A;
    } else if (lng_b < lng_a && lat_b < lat_a) {
      res = 180 - A;
    } else if (lng_b < lng_a && lat_b > lat_a) {
      res = 360 + A;
    } else if (lng_b > lng_a && lat_b === lat_a) {
      res = 90;
    } else if (lng_b < lng_a && lat_b === lat_a) {
      res = 270;
    } else if (lng_b === lng_a && lat_b > lat_a) {
      res = 0;
    } else if (lng_b === lng_a && lat_b < lat_a) {
      res = 180;
    }
    return res;
  }

  /**
   * 根据经纬度计算距离
   * (lng_a, lat_a)A经纬坐标
   * (lng_b, lat_b)B经纬坐标
   */
  public getDistance(lng_a, lat_a, lng_b, lat_b): number {
    const radLat1 = this.rad(lat_a);
    const radLat2 = this.rad(lat_b);
    const a = radLat1 - radLat2;
    const b = this.rad(lng_a) - this.rad(lng_b);
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    // 大地坐标系资料WGS-84 长半径a=6378137
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10;
    // 返回米数
    return s;
  }


  /**
   * 根据一个经纬度及距离角度，算出另外一个经纬度
   * @param lng 经度
   * @param lat 纬度
   * @param  brng 方位角 45 ---- 正北方：000°或360° 正东方：090° 正南方：180° 正西方：270°
   * @param dist 距离(米)
   * @param marker 是否画点
   */
  public getLonAndLat(lng: number, lat: number, brng: number, dist: number, marker: boolean): any {
    // 大地坐标系资料WGS-84 长半径a=6378137 短半径b=6356752.3142 扁率f=1/298.2572236
    const a = 6378137;
    const b = 6356752.3142;
    const f = 1 / 298.257223563;

    const lon1 = lng;
    const lat1 = lat;
    const s = dist;
    const alpha1 = this.rad(brng);
    const sinAlpha1 = Math.sin(alpha1);
    const cosAlpha1 = Math.cos(alpha1);
    const tanU1 = (1 - f) * Math.tan(this.rad(lat1));
    const cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
    const sigma1 = Math.atan2(tanU1, cosAlpha1);
    const sinAlpha = cosU1 * sinAlpha1;
    const cosSqAlpha = 1 - sinAlpha * sinAlpha;
    const uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    let sigma = s / (b * A), sigmaP = 2 * Math.PI;
    let sinSigma = 0;
    let cosSigma = 0;
    let cos2SigmaM = 0;
    while (Math.abs(sigma - sigmaP) > 1e-12) {
      cos2SigmaM = Math.cos(2 * sigma1 + sigma);
      sinSigma = Math.sin(sigma);
      cosSigma = Math.cos(sigma);
      const deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
        B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
      sigmaP = sigma;
      sigma = s / (b * A) + deltaSigma;
    }
    const tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
    const lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
      (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp));
    const lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
    const C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    const L = lambda - (1 - C) * f * sinAlpha *
      (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    const lngLatObj = {lng: lon1 + this.deg(L), lat: this.deg(lat2)};
    return lngLatObj;
  }

  /**
   * 获取经纬度平行线(p1:起始点，p2:结束点，re:是否双线，width：宽距)
   */
  public getParallelLines(p1: { lng: number, lat: number }, p2: { lng: number, lat: number }, re: boolean, width: number): any {
    // 获取角度
    let angle = this.getAngle(p1.lng, p1.lat, p2.lng, p2.lat);
    if (angle >= 0 && angle < 90) {
      angle = angle + 90;
    } else if (angle >= 90 && angle < 180) {
      angle = angle + 90;
    } else if (angle >= 180 && angle < 270) {
      angle = angle - 90;
    } else if (angle >= 270 && angle < 360) {
      angle = angle - 90;
    }
    angle = re ? angle + 180 : angle;
    // 两个平行画线的偏移点，
    const st = this.getLonAndLat(p1.lng, p1.lat, angle, width, false);
    const nd = this.getLonAndLat(p2.lng, p2.lat, angle, width, false);
    // 返回偏移向量的起始点和结束点
    return {st: st, nd: nd};
  }

  /**
   * 画单线操作（spacing：间距，quantity：点，width：宽距，st：第一个点，nd：第二个点）
   */
  public autoLinePointSingle(spacing: number, quantity: Array<any>, width: number, st: { lng: number, lat: number }, nd: { lng: number, lat: number }, mapService: any) {
    // 设置起始点和结束点
    const p1 = new BMap.Point(st.lng, st.lat);
    const p2 = new BMap.Point(nd.lng, nd.lat);
    this.markerArr = [];
    // 获取起始点和结束点的距离，比较间隔距离是否可行
    // if ((quantity.length - 1) * spacing <= this.getDistance(p1.lng, p1.lat, p2.lng, p2.lat)) {
    // 平行线的起始点
    const parallelLine = this.getParallelLines(p1, p2, false, width).st;
    for (let i = 0; i < quantity.length; i++) {
      this.createMapPoint(mapService, quantity, i, parallelLine, spacing, p1, p2);
    }
    return this.markerArr;
    // } else {
    //   this.$message.error(this.indexLanguage.adjustmentCoordinateErrorMsg);
    // }
  }

  /**
   * 画双线操作（spacing：间距，quantity：点，width：宽距，st：第一个点，nd：第二个点）
   */
  public autoLinePointBoth(spacing: number, quantity: Array<any>, width: number, st: { lng: number, lat: number }, nd: { lng: number, lat: number }, mapService: any) {
    // 设置起始点和结束点
    const p1 = new BMap.Point(st.lng, st.lat);
    const p2 = new BMap.Point(nd.lng, nd.lat);
    this.markerArr = [];
    const length = quantity.length % 2 === 0 ? quantity.length / 2 : Math.floor(quantity.length / 2) + 1;
    // 获取起始点和结束点的距离，比较双向间隔距离是否可行
    // if (length * spacing <= this.getDistance(p1.lng, p1.lat, p2.lng, p2.lat)) {
    // 两个平行线的起始点
    const parallelLineSt = this.getParallelLines(p1, p2, false, width).st;
    const parallelLineNd = this.getParallelLines(p1, p2, true, width).st;
    for (let i = 0; i < quantity.length / 2; i++) {
      this.createMapPoint(mapService, quantity, i, parallelLineSt, spacing, p1, p2);
    }
    for (let i = 0; i < quantity.length / 2 - (quantity.length % 2); i++) {
      this.createMapPoint(mapService, quantity, (i + length), parallelLineNd, spacing, p1, p2, length);
    }
    return this.markerArr;
    // } else {
    //   this.$message.error(this.indexLanguage.adjustmentCoordinateErrorMsg);
    // }
  }

  /**
   * 创建排布后的设施或设备点
   * @param mapService 地图实例
   * @param quantity 当前点
   * @param i 当前循环
   * @param parallelLine 线
   * @param spacing 间距
   * @param p1 起点
   * @param p2 终点
   */
  public createMapPoint(mapService, quantity, i, parallelLine, spacing, p1, p2, length?) {
    mapService.updateMarker('hide', quantity[i]);
    // 区分单线或双线
    if (length) {
      i -= length;
    }
    // 平行线起始点开始间隔做点
    const point = this.getLonAndLat(parallelLine.lng, parallelLine.lat, this.getAngle(p1.lng, p1.lat, p2.lng, p2.lat), spacing * i + quantity['space'], false);
    if (length) {
      i += length;
    }
    const points = mapService.createPoint(point.lng, point.lat);
    let iconUrl = '';
    if (quantity[i].deviceId) {
      // 运维视图下设施点
      iconUrl = CommonUtil.getFacilityIconUrl('24-32', quantity[i].deviceType, quantity[i].deviceStatus);
    } else if (quantity[i].pointId) {
      // 项目规划视图下设施点
      iconUrl = CommonUtil.getFacilityPointIconUrl('24-32', quantity[i].deviceType, quantity[i].pointStatus);
    } else {
      // 运维视图下设备点
      iconUrl = CommonUtil.getEquipmentTypeIconUrl('24-32', quantity[i].equipmentType, quantity[i].deviceStatus);
    }
    const icon = mapService.toggleIcon(iconUrl);
    this.markerArr.push(mapService.createNewMarker(points, icon, null, quantity[i]));
    this.markerArr.forEach(item => {
      mapService.mapInstance.addOverlay(item);
    });
    return this.markerArr;
  }

  /**
   * 单边排布
   * 根据线段与点数量，返回每条线段应排布几个点
   * @param data 点
   * @param list 线段数量和距离（M）
   * @param spacing 点与点之间的间距（M）
   */
  public lineSegmentArrangement(data, list, spacing, isDouble?) {
    const dataList = [];
    // 获取线段总数之和
    const num = this.verificationLine(list);
    // 如果线段总数之和小于线段间隔，至少排布一个坐标点
    if (num < spacing) {
      dataList.push({
        data: [data[0]]
      });
      dataList[0].data.space = 0;
    } else {
      // 线的循环
      for (let l = 0; l < list.length; l++) {
        dataList.push({
          data: []
        });
        // 点的循环
        for (let i = 0, o = 0; i < data.length; i++, o++) {
          // 第一条线段计算从零开始排布，要加一个spacing
          const LineLength = l ? list[l].length : list[l].length + Number(spacing);
          if ((o + 1) * spacing < LineLength) {
            if (data[i + 1] && isDouble) {
              dataList[l].data.push(data[i], data[i + 1]);
              data.splice(0, 2);
            } else {
              dataList[l].data.push(data[i]);
              data.splice(0, 1);
            }
            i -= 1;
          } else {
            // 第一条线段计算空闲值, 实际距离要小一个spacing，要减一
            const spaceLength = l ? (list[l].length - (o * spacing)) : (list[l].length - ((o - 1) * spacing));
            if (l < list.length) {
              // 多余计算
              dataList[l].data.space = list[l].length > spacing ? (spacing - spaceLength) : spacing - list[l].length;
              // 把本条线段多出来的线归于下一条线段
              if (list[l + 1]) {
                const space = spaceLength + list[l + 1].length;
                list[l + 1].length = space;
              }
            }
            break;
          }
        }
      }
      // 保留每条线段多余的距离到下条线段
      for (let j = dataList.length; j--; j > 0) {
        if (j >= 1) {
          dataList[j].data.space = 10;
        } else {
          dataList[j].data.space = 0;
        }
      }
    }
    return dataList;
  }

  /**
   * 双边排布
   * 根据线段与点数量，返回每条线段两边应排布几个点
   * @param data 点
   * @param list 线段数量和距离（M）
   * @param spacing 点与点之间的间距（M） / 2
   */
  public doubleLineSegmentArrangement(data, list, spacing) {
    return this.lineSegmentArrangement(data, list, spacing, true);
  }

  /**
   * 线段长度之和
   * @param data 点
   * @param list 线段数量和距离（M）
   * @param spacing 点与点之间的间距（M） / 2
   */
  public verificationLine(list) {
    const newList = [];
    list.forEach(item => {
      newList.push(item.length);
    });
    const sum = newList.reduce((prev, curr) => {
      return prev + curr;
    });
    return sum;
  }

  /**
   * 因优化需求，坐标调整只绘制线段范围内的坐标点，不再弹出提示
   * @param data 点
   * @param list 线段数量和距离（M）
   * @param spacing 点与点之间的间距（M） / 2
   */
  public spliceData(spacing, list, data, isDouble?) {
    const newData = lodash.cloneDeep(data);
    const newList = [];
    list.forEach(item => {
      newList.push(item.length);
    });
    const sum = newList.reduce((prev, curr) => {
      return prev + curr;
    });
    let count = Math.floor(sum / spacing);
    if (isDouble && (count % 2 === 1)) {
      count += 1;
    }
    let num = data.splice(0, count);
    // 如果个数为0，画线情况下至少排一个
    if (!count) {
      num = data.splice(0, 1);
    }
    if (num.length < newData.length) {
      const languageType = JSON.parse(localStorage.getItem('localLanguage'));
      if (languageType === `CN`) {
        // 中文提示
        this.$message.info(`画线长度不足，预计排布${newData.length}个，实际排布${num.length}个`);
      } else {
        // 英文提示
        this.$message.info(`The length of the drawing line is not enough, it is expected to arrange ${newData.length}, and the actual arrangement is ${num.length}`);
      }
    }
    return num;
  }
}
