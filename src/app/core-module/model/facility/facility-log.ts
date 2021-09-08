/**
 * 设备日志数据模型
 */
export class FacilityLog {
  /**
   * 日志id
   */
  public logId: string;
  /**
   * 日志名称
   */
  public logName: string;
  /**
   * 日志类型
   */
  public logType: string;
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 设施类型
   */
  public deviceType: string;
  /**
   * 设备类型
   */
  public equipmentType: string;
  /**
   * 资产编码
   */
  public deviceCode: string;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 节点对象
   */
  public nodeObject: string;
  /**
   * 区域名称
   */
  public areaName: string;
  /**
   * 当前时间
   */
  public currentTime: string;
  /**
   * 备注
   */
  public remarks: string;
  /**
   * 图标样式
   */
  public iconClass: string;
}
