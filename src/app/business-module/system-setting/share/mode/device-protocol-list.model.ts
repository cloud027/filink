import {SelectModel} from '../../../../shared-module/model/select.model';
import {CloudPlatformTypeEnum} from '../../../../core-module/enum/product/product.enum';

export class DeviceProtocolListModel {
  /**
   * 设施协议ID（UUID）
   */
  public protocolId: string;

  /**
   * 设施协议文件名称
   */
  public protocolName: string;

  /**
   * 产品id
   */
  public productId: string;

  /**
   * 设备型号
   */
  public equipmentModel: string;
  /**
   * 接入方式
   */
  public accessWay: string;
  /**
   * 供应商
   */
  public supplier: string;
  /**
   * 供应商名称
   */
  public supplierName: string;
  /**
   * 设备类型
   */
  public equipmentType: string | SelectModel[];
  /**
   * 设备图标
   */
  public iconClass: string;
  /**
   * 设施协议文件名称
   */
  public fileName: string;

  /**
   * 设施协议文件长度
   */
  public fileLength: string;

  /**
   * 文件下载路径
   */
  public fileDownloadUrl: string;

  /**
   * 硬件版本
   */
  public hardwareVersion: string;

  /**
   * 软件版本
   */
  public softwareVersion: string;

  /**
   * 设备配置文件名称
   */
  public equipmentConfigFileName: string;

  /**
   * 设备配置文件长度
   */
  public equipmentConfigFileLength: string;

  /**
   * 设备配置文件下载路径
   */
  public equipmentConfigFileDownloadUrl: string;


  /**
   * 是否删除（0未删除 1已删除）
   */
  public isDeleted: string;

  /**
   * 创建人
   */
  public createUser: string;

  /**
   * 创建时间
   */
  public createTime: string;

  /**
   * 更新人
   */
  public updateUser: string;

  /**
   * 更新时间
   */
  public updateTime: string;

  /**
   * 旧的协议id
   */
  public oldProtocolId: string;
  /**
   * ssl文件名称
   */
  public sslCertificateFileName: string;
  /**
   * ssl文件下载路径
   */
  public sslCertificateFileDownloadUrl: string;
  /**
   * 第三方客户端地址
   */
  public thirdPartyClientAddr: string;
  /**
   * 第三方服务地址
   */
  public thirdPartyServiceAddr: string;
  /**
   * 平台类型
   */
  public platformType: CloudPlatformTypeEnum;
  /**
   * 产品的appId
   */
  public appId: string;
}
