/**
 * 设备日志列表数据模型
 */
export  class EquipmentLogModel {
  /**
   * 日志Id
   */
  public logId: number;
  /**
   * 日志名称
   */
  public logName: string;
  /**
   * 日志类型
   */
  public logType: number;
  /**
   * 设备Id
   */
  public equipmentId: number;
  /**
   * 设备类型
   */
  public equipmentType: number;
  /**
   * 设备名称
   */
  public equipmentName: string;
  /**
   * 资产编号
   */
  public equipmentCode: string;
  /**
   * 所属设施
   */
  public deviceId: string;
  /**
   * 所属设施名字
   */
  public deviceName: string;
  /**
   * 所属区域id
   */
  public areaId: string;
  /**
   * 所属区域名字
   */
  public areaName: string;
  /**
   * 发生时间
   */
  public creatTime: string;
  /**
   * 附加信息
   */
  public additionalInformation: string;
}
