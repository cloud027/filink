/**
 * 巡检任务关联设备实体类
 */

export class InspectionEquipmentInfoModel {
  /**
   * 关联设施id
   */
  public deviceId?: string;
  /**
   * 设备id
   */
  public equipmentId?: string;
  /**
   * 设备名称
   */
  public equipmentName?: string;
  /**
   * 设备类型
   */
  public equipmentType?: string;
  /**
   * 设备编号
   */
  public equipmentCode?: string;
  /**
   * 基础定位
   */
  public positionBase?: string;
  /**
   * 详细地址
   */
  public address?: string;
}
