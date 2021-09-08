import {DeviceTypeEnum} from '../enum/facility/facility.enum';

/**
 * 地图区域数据过滤条件
 */
export class MapAreaFilterModel {
  /**
   * 区域code集合
   */
  area: string[]  =  [];
  /**
   * 设施类型集合
   */
  device: DeviceTypeEnum[];
}
