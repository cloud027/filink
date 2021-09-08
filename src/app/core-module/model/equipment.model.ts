/**
 * 设备
 */
export class EquipmentModel {
  /**
   * 设备id
   */
  public equipmentId?: string;
  /**
   * 设备名称
   */
  public equipmentName?: string;
  /**
   * 设备名称
   */
  public equipmentType?: string;
  /**
   * 产品id
   */
  public productId?: string;
  public equipmentProductId?: string;
  /**
   * 区域id
   */
  public areaId?: string;
  public equipmentAreaId?: string;
  /**
   * 区域code
   */
  public areaCode?: string;
  public equipmentAreaCode?: string;
  /**
   * 项目id
   */
  public projectId?: string;
  /**
   * 设备型号
   */
  public equipmentModel?: string;
  /**
   * 挂载点位
   */
  public mountPosition?: string | number;

}
