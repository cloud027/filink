/**
 * 智慧杆信息实体类
 */
export class WisdomPointInfoModel {

  /**
   * 智慧杆id
   */
  public pointId: string;

  /**
   * 智慧杆名称
   */
  public pointName: string;

  /**
   * 智慧杆型号
   */
  public pointModel: string;

  /**
   * 设施类型
   */
  public pointType: string;

  /**
   * 智慧杆状态
   */
  public pointStatus: string;
  /**
   * 状态图标
   */
  statusIconClass: string;

  /**
   * 所属规划id
   */
  public planId: string;

  /**
   * 所属项目id
   */
  public projectId: string;

  /**
   * 区域名称
   */
  public areaName: string;

  /**
   * 区域code
   */
  public areaCode: string;

  /**
   * 地图横坐标
   */
  public xPosition: string;

  /**
   * 地图纵坐标
   */
  public yPosition: string;

  /**
   * 创建时间
   */
  public createTime: number;

  /**
   * 创建人
   */
  public createUser: string;

  /**
   * 更新时间
   */
  public updateTime: number;

  /**
   * 更新人
   */
  public updateUser: string;

  /**
   * 租户id
   */
  public tenantId: string;

  /**
   * 所属产品id
   */
  public productId: string;
  /**
   * 经纬度
   */
  public xposition?: string;
  public yposition?: string;

  /**
   * 产品型号 与点位型号一致
   */
  public productModel?: string | null;

  /**
   * 所属规划名字
   */
  public planName: string;
  /**
   * 供应商
   */
  public supplierName?: string | null;
  /**
   * 详细地址
   */
  public address: string;
  public checked?: boolean;
}
