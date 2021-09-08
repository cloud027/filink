/**
 * 规则条件
 */
export class RuleConditionModel {
  /**
   * 属性
   */
  public property: string;
  /**
   * 根原因告警属性
   */
  public rootCauseAlarmAttribute: string;
  /**
   * 操作符
   */
  public operator: string;
  /**
   * 值
   */
  public propertyValue: string;
  /**
   * 相关告警属性
   */
  public relevanceAlarmProperties: string;
  /**
   * 规则条件组装
   */
  public ruleCondition: string;
  /**
   * 规则id
   */
  public id: string;
  /**
   * 相关告警名称
   */
  public relevanceAlarmName: string;
  /**
   * 相关告警id
   */
  public relevanceAlarmNameId: string;
  constructor() {
    this.property = '1';
    this.rootCauseAlarmAttribute = '';
    this.operator = '1';
    this.propertyValue = '1';
    this.relevanceAlarmProperties = '';
  }
}
