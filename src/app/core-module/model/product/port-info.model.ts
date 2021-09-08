/**
 * 端口数据模型
 */
import {PortTypeEnum} from '../../enum/product/product.enum';

export class PortInfoModel {
  /**
   * 端口名称
   */
  public portName: string;
  /**
   * 端口编号
   */
  public portNumber: string;
  /**
   * 端口类型
   */
  public portType: string;
  /**
   * 端口标识
   */
  public portFlag: PortTypeEnum;
}
