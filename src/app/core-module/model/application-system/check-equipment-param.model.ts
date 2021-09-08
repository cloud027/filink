/**
 * 校验设备模式
 */
export class CheckEquipmentParamModel {
  /**
   * 设备id集合
   */
  public equipmentIdList?: string[];

  /**
   * 策略的类型
   */
  public mode?: string;

  /**
   *  设备id
   */
  public equipmentId?: string;

  /**
   * 策略id
   */
  public strategyId?: string;
}
