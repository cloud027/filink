/**
 * 保存模板
 *
 * @author xiaoconhu
 * @date 2019/5/22
 */
export class TemplateReqModel {
  /**
   * 关系id
   */
  public relationId;
  /**
   * 箱模板走向
   */
  public boxTrend: number;
  /**
   * 箱模板编号规则
   */
  public boxCodeRule: number;

  /**
   * 框模板走向
   */
  public frameTrend: number;
  /**
   * 框模板编号规则
   */
  public frameCodeRule: number;

  /**
   * 盘模板走向
   */
  public discTrend: number;
  /**
   * 盘模板编号规则
   */
  public discCodeRule: number;
  /**
   * 箱模板id
   */
  public boxTemplateId: string;
  /**
   * 模板名称
   */
  public boxName: string;
}
