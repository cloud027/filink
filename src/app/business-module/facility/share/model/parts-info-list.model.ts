/**
 * 配件列表数据模型
 */
export class PartsInfoListModel {
  /**
   * 配件id
   */
   public  partId: string;
  /**
   * 配件名称
   */
  public  partName: string;
  /**
   * 配件类型
   */
  public  partType: string;
  /**
   * 配件类型名称
   */
  public  partTypeName: string;
  /**
   * 配件code
   */
  public  partCode: string;
  /**
   * 备注
   */
  public  remark: string;
  /**
   * 保管人
   */
  public  trustee: string;
  /**
   * 单位名称
   */
  public  department: string;
  /**
   * 创建时间
   */
  public  createTime: string;
  /**
   * 更新时间
   */
  public  updateTime: string;
  /**
   * 创建时间时间戳
   */
  public  cTime: number;
  /**
   * 更新时间时间戳
   */
  public  uTime: number;
  /**
   * 单位code数组
   */
  public  accountabilityUnit: string[];
  /**
   * 一级部门id
   */
  public levelOneDeptId: string;
}
