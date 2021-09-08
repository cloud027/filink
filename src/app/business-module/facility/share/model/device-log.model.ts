/**
 * 设施日志列表数据模型
 */
export class DeviceLogModel {

  /**
   * 日志id
   */
  public logId: string;

  /**
   * 日志名称
   */
  public logName: string;

  /**
   * 类型
   */
  public type: string;

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
   * 设施编号
   */
  public deviceCode: string;

  /**
   * 设施名称
   */
  public deviceName: string;

  /**
   * 设备Id
   */
  private equipmentId: string;
  /**
   * 设备名称
   */
  private  equipmentName: string;
  /**
   * 设备类型
   */
  private equipmentType: string;
  /**
   * 节点对象
   */
  private  nodeObject: string;
  /**
   * 区域id
   */
  private areaId: string;
  /**
   * 区域名称
   */
  private areaName: string;
  /**
   * 创建时间
   */
  private currentTime: number;
  /**
   * 备注
   */
  private remarks: string;

}
