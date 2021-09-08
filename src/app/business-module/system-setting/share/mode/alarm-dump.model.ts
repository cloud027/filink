/**
 * 证书信息
 */
export class AlarmDumpModel {
  /**
   * 触发条件
   */
  public triggerCondition: string;
  /**
   * 转储条数为10000-1000000
   */
  public turnOutNumber: string;
  /**
   * 启用告警转储
   */
  public enableDump: string;
  /**
   * 转储数量阈值10000-1000000
   */
  public dumpQuantityThreshold: string;
  /**
   * 转储位置
   */
  public dumpPlace: string;
  /**
   * 转储后操作
   */
  public dumpOperation: string;
  /**
   * 转储时间间隔为1-24
   */
  public dumpInterval: string;
}
