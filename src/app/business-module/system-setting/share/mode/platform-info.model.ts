import { CloudPlatformTypeEnum } from 'src/app/core-module/enum/product/product.enum';
import { ProtocolTypeEnum } from '../enum/protocol-type.enum';
import { DeviceTypeEnum } from 'src/app/core-module/enum/facility/facility.enum';

export class PlatformInfoModel {
  /**
   *  主键ID
   */
  platformAppId: number;
  /**
   * 平台类型
   */
  platformType: CloudPlatformTypeEnum;
  /**
   * 平台APP（产品）ID
   */
  appId: string;
  /**
   * 核心秘钥
   */
  secretKey: string;
  /**
   * 应用(产品)名称
   */
  appName: string;
  /**
   * 厂商id
   */
  manufacturerId: string;
  /**
   * 厂商名称
   */
  manufacturerName: string;
  /**
   * 设施类型
   */
  deviceType: DeviceTypeEnum;
  /**
   * 型号
   */
  model: string;
  /**
   * 协议类型
   */
  protocolType: ProtocolTypeEnum;
  /**
   * 平台地址
   */
  address: string
}
