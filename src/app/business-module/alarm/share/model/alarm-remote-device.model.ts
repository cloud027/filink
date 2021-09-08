import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';

/**
 * 告警远程通知设施信息
 */

export class AlarmRemoteDeviceModel {
  /**
   * 远程通知id
   */
  public ruleId?: string;
  /**
   * 设施id
   */
  public deviceId?: string;
  /**
   * 设施名称
   */
  public deviceName?: string;
  /**
   * 设施类型id
   */
  public deviceTypeId?: string | SelectModel;
  /**
   * 设施图标
   */
  public iconClass?: string;
  /**
   * 设施类型
   */
  public deviceType?: DeviceTypeEnum;
}
