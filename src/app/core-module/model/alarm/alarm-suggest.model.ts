/**
 * 告警建议模型
 */
export class AlarmSuggestModel {
  /**
   * 告警code
   */
  public alarmCode: string;
  /**
   * 原因
   */
  public breakdownReason: string;
  /**
   * id
   */
  public id: string;
  /**
   * 建议
   */
  public maintenanceProgramAdvise: string;
  /**
   * 百分比
   */
  public percentage: number | string;
  /**
   * 资源建议
   */
  public resourceNeedAdvise: string;
}
