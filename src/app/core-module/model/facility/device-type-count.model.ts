import {DeviceTypeEnum} from '../../enum/facility/facility.enum';


export class DeviceTypeCountModel {
  /**
   * 设施总数
   */
  public deviceNum: number;
  /**
   * 设施类型
   */
  public deviceType: DeviceTypeEnum;
  /**
   * 设施类型
   */
  public statisticObj: DeviceTypeEnum;
  /**
   * 设施总数
   */
  public statisticNum: number;
  /**
   * 设施状态
   */
  public deviceStatus: string;
}
