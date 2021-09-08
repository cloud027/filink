/**
 * 指令下发模型
 */
export class InstructSendModel {
  /**
   * 指令id
   */
  public commandId: string;
  /**
   * 分组id数组
   */
  public groupIds?: string[];
  /**
   *  设备ids
   */
  public equipmentIds?: string[];
  /**
   * 策略id
   */
  public strategyId?: string;
  /**
   * 指令参数
   */
  public param: {};
}
