/**
 * 鬼狐预设置列表实体类
 */
export class ModelSetModel {
  /**
   * 规划下点位的型号
   */
  productModel: string;

  /**
   * 规划点位型号
   */
  public pointModel: string;

  /**
   * 产品id
   */
  productId: string;

  /**
   * 规划id
   */
  public planId: string;

  /**
   * 规划名字
   */
  public planName: string;

  /**
   * 供应商
   */
  public supplierName: string;

  /**
   * 是否被选中
   */
  public checked?: boolean;
}
