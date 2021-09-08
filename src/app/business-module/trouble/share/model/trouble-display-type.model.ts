/**
 * 故障类型模型
 */

import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';

export class TroubleDisplayTypeModel {
  /**
   * 设施总数
   */
  public deviceNum: number;
  /**
   * 设施类型
   */
  public deviceType: DeviceTypeEnum;
  /**
   * 设施类型code
   */
  public statisticObj: DeviceTypeEnum;
  /**
   * 设备总数
   */
  public statisticNum: number;
}
