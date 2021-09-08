import {AREA_POINT_CONST} from '../const/index/map.const';
import {MapAreaFilterModel} from './map-area-filter.model';

/**
 * 地图区域点请求参数模型
 */
export class MapAreaRequestModel {
  /**
   * 区分地图区域点数据
   */
  polymerizationType: string;
  /**
   * 过滤条件
   */
  filterConditions: MapAreaFilterModel;

  constructor(polymerizationType?) {
    this.polymerizationType = polymerizationType || AREA_POINT_CONST;
  }
}
