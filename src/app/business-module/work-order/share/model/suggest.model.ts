/**
 * 运维建议
 */
export class SuggestModel {
  /**
   * 告警编码
   */
  alarmCode?: string;
  /**
   * id
   */
  id?: string;
  /**
   * 告警原因
   */
  breakdownReason?: string;
  /**
   * 维护方案
   */
  maintenanceProgramAdvise?: string;
  /**
   * 需求建议
   */
  resourceNeedAdvise?: string;
  /**
   * 占比
   */
  percentage?: number;
  /**
   * 建议
   */
  public planSuggest?: string;
  /**
   * 资源
   */
  public resourcesSuggest?: string;
  /**
   * 类型
   */
  public name?: string;
}

