/**
 * 告警增量统计后台返回结果模型
 */
export class AlarmSourceIncrementalModel {
  /**
   * id
   */
  public id: string;

  /**
   * 设施id
   */
  public deviceId: string;

  /**
   * 时间
   */
  public groupTime: string;

  /**
   * 数量
   */
  public count: number;

  /**
   * 类型
   */
  public type: string;
}
