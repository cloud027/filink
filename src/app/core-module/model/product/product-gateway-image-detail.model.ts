/**
 * 产品网关图详情数据模型
 */
import {ProductFileModel} from './product-file.model';
import {ProductGatewayPositionModel} from './product-gateway-position.model';

export class ProductGatewayImageDetailModel {
  /**
   * 产品id
   */
  public productId: string;
  /**
   * 地图文件地址
   */
  public fileFullPath: string;
  /**
   * 点位信息
   */
  public  portInfoList: ProductGatewayPositionModel[] = [];
  /**
   * 文件信息
   */
  public productFileList: ProductFileModel[] = [];
}
