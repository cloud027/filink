/**
 * 表单类设施
 */
import {DeviceTypeEnum} from '../../enum/facility/facility.enum';

export class DeviceFormModel {
  /**
   * 地址
   */
  public address?: string;
  /**
   * 区域编码
   */
  public areaCode?: string;
  /**
   * 区域id
   */
  public areaId?: string;
  /**
   * 设施id
   */
  public deviceId?: string;
  /**
   * 设施名称
   */
  public deviceName?: string;
  /**
   * 设施状态
   */
  public deviceStatus?: string;
  /**
   * 设施类型
   */
  public deviceType?: DeviceTypeEnum;
  public equipmentQuantity?: string;
  public positionBase?: string;
  /**
   * 设施区域id
   */
  public deviceAreaId?: string;
  /***
   * 设施区域名称
   */
  public deviceAreaName?: string;
  /**
   * 巡检任务id
   */
  public inspectionTaskId?: string;
  /**
   * 设施编码
   */
  public deviceCode?: string;
}
