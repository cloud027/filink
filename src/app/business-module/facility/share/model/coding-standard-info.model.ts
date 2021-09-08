/**
 * 新增编码标准数据模型
 */
export class CodingStandardInfoModel {
  /**
   * 名称
   */
  public codingRuleName: string;
  /**
   * 资产类型
   */
  public typeCodeList: string[];
  /**
   * 编码范围
   */
  public scopeType: string;
  /**
   * 区域
   */
  public scopeCodeList: string[];
  /**
   * 备注
   */
  public remark: string;
  /**
   * 可选字段集
   */
  public fieldCodeList: string[];
}

/**
 * 新增编码标准第二步数据模型
 */
export class CodingStandardSecondInfoModel {
  /**
   * 一级
   */
  public firstLevel: string;
  /**
   * 二级
   */
  public secondLevel: string;
  /**
   * 三级
   */
  public thirdLevel: string;
  /**
   * 四级
   */
  public fourthLevel: string;
  /**
   * 五级
   */
  public fifthLevel: string;
  /**
   * 编码内容
   */
  public codingContent: string;
  /**
   * 编码示例
   */
  public codingExample: string;
}
