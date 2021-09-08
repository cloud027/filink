/**
 * 产品网关点位数据模型
 */
import {PortTypeEnum} from '../../enum/product/product.enum';

export class ProductGatewayPositionModel {
  /**
   * 坐标id
   */
  public pointConfigId: string;
  /**
   * 横坐标
   */
  public xposition: string;
  /**
   * 纵坐标
   */
  public yposition: string;
  /**
   * 端口名称
   */
  public portName: string;
  /**
   * 端口类型通信与电力标识
   */
  public portFlag: PortTypeEnum;
  /**
   * 端口类型WAN
   */
  public portType: string;
  /**
   * 波特率
   */
  public baudRate:  string;
  /**
   * 检验方式
   */
  public checkWay: string;
  /**
   * 数据位
   */
  public dataBit: string;
  /**
   * 停止位
   */
  public stopBit: string;
  /**
   * 流控
   */
  public fluidControl: string;
  /**
   * 端口号
   */
  public portNumber: string;
  /**
   * 端口图片地址
   */
  public pointImage: string;
}
