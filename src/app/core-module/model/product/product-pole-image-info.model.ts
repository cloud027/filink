/**
 * 根据产品id查询杆型图片信息数据模型
 */
import {ProductEquipmentModelModel} from './product-equipment-model.model';
import {ProductFileModel} from './product-file.model';

export class ProductPoleImageInfoModel {

  /**
   * 产品id
   */
   public productId: string;
  /**
   * 底图路径
   */
  public fileFullPath: string;
  /**
   * 设备模型信息
   */
  public pointConfigList: ProductEquipmentModelModel[] = [];
  /**
   *  产品设备文件路径
   */
  public productFileList: ProductFileModel[] = [];
}
