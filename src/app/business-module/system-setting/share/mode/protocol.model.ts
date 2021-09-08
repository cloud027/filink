import {CertificateModel} from './certificate.model';

/**
 * 协议
 */
export class ProtocolModel {
  /**
   * 证书信息
   */
  public certificateFile: CertificateModel;
  /**
   * ip地址
   */
  public ip: string;
  /**
   * 最大值
   */
  public maxActive: string;
}


