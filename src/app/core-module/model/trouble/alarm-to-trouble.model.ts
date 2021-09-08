/**
 * 告警转故障
 */
export class AlarmToTroubleModel {
  /***
   * 告警id
   */
  public alarmId?: string;
  /**
   * 产品id
   */
  public productId?: string;
  public deviceProductId?: string;

  /**
   * 项目id
   */
  public projectId?: string;

  /**
   * 设施区域id
   */
  public deviceAreaId?: string;

  /**
   * 设施区域code
   */
  public deviceAreaCode?: string;

  /**
   * 设备
   */
  public equipment?: ToTroubleEquipment[];
}

/**
 * 设备
 */
export class ToTroubleEquipment {
  /**
   * 设备产品id
   */
  public equipmentProductId?: string;

  /**
   * 设备区域id
   */
  public equipmentAreaId?: string;

  /**
   * 设备区域code
   */
  public equipmentAreaCode?: string;
  /**
   * 设备模型
   */
  public equipmentModel?: string;
}
