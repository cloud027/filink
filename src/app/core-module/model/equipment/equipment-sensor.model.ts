/**
 * 设备传敢值数据模型
 */
export class EquipmentSensorModel {
  /**
   * id
   */
  public id: string;
  /**
   *  名称
   */
  public name: string;
  /**
   * 单位
   */
  public unit: string = '';
  /**
   * 图标
   */
  public icon: string;
  /**
   * 值
   */
  public statusValue: string = '';
  /**
   * 默认值
   */
  public defaultVal: string;
  /**
   * 值1转换
   */
  public val1: string;
  /**
   * 值0转换
   */
  public val0: string;

}
