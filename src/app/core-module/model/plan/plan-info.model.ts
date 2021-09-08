/**
 * 规划信息实体类
 */
export class PlanInfoModel {
  /**
   * 规划id
   */
  public planId: string;

  /**
   * 规划名称
   */
  public planName: string;

  /**
   * 规划编号
   */
  public planCode: string;

  /**
   * 规划规模
   */
  public scaleNumber: number;

  /**
   * 已建设数量
   */
  public alreadyBuiltNumber: number;

  /**
   * 建设中数量
   */
  public beingBuiltNumber: number;

  /**
   * 预计完成时间
   */
  public planFinishTime: number | Date;

  /**
   * 地图横坐标
   */
  public xPosition: string;

  /**
   * 地图纵坐标
   */
  public yPosition: string;

  /**
   * 规划区域名称
   */
  public areaName: string;

  /**
   * 部门code
   */
  public deptCode: string;

  /**
   * 创建时间,规划录入日期
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
}
