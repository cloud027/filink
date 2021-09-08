import {DeviceTypeEnum} from '../../enum/facility/facility.enum';

/**
 * 选择设施模型
 */
export class SelectDeviceModel {
  /**
   * 设施id
   */
  public deviceId?: string;
  /**
   * 设施名称
   */
  public deviceName?: string;
  /**
   * 设施类型
   */
  public deviceType?: DeviceTypeEnum;
  /**
   * 区域Id
   */
  public areaId?: string;
  /**
   * 区域名称
   */
  public area?: string;
  /**
   * 区域名称
   */
  public areaCode?: string;

  /**
   * 产品id
   */
  public productId?: string;
  public deviceProductId?: string;

  /**
   * 项目id
   */
  public projectId?: string;
  constructor() {
    this.deviceId = '';
    this.deviceName = '';
    this.deviceType = null;
    this.areaId = '';
    this.area = '';
    this.areaCode = '';
  }
}
