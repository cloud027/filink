import {PointModel} from './point.model';

/**
 * 设施城市信息
 */
export class CityInfoModel {
  /**
   * 省
   */
  public province: string;
  /**
   * 城市
   */
  public city: string;
  /**
   * 街道
   */
  public district: string;
  /**
   * 经纬明细
   */
  public detailInfo: PointModel = new PointModel();
}
