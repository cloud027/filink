/**
 * 过滤图片列表数据模型
 */
export class ImageFilterModel {
  /**
   * 图片名称
   */
  public picName: string;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 资产编码
   */
  public deviceCode: string;
  /**
   * 区域名称
   */
  public areaName: string;
  /**
   * 设备名称
   */
  public equipmentName: string;
  /**
   * 来源
   */
  public resource: string;
  /**
   * 区域id
   */
   public areaId: string;
  /**
   * 设施id
   */
  public deviceIds: string[];
  /**
   * 设备id
   */
  public equipmentIds: string[];
  /**
   * 设施类型
   */
  public deviceTypes: string[];
  /**
   * 开始时间
   */
  public startTime: number;
  /**
   * 结束时间
   */
  public endTime: number;
}
