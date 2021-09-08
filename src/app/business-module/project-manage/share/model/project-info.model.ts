/**
 * 项目信息模型
 */
export class ProjectInfoModel {
  /**
   * 项目名称
   */
  public projectName: string;


  /**
   * 项目id
   */
  public projectId: string;

  /**
   * 项目编号
   */
  public projectCode: string;

  /**
   * 项目规模
   */
  public projectScale: string;

  /**
   * 已建设数量
   */
  public builtCount: number;

  /**
   * 建设中数量
   */
  public buildingCount: number;

  /**
   * 项目状态
   */
  public status: string;

  /**
   * 建设部门
   */
  public builtDept: string;

  /**
   * 项目经理
   */
  public manager: string;

  /**
   * 计划开始时间
   */
  public planStart: any;

  /**
   * 计划结束时间
   */
  public planStop: any;

  /**
   * 设计单位
   */
  public designUnit: string;
  /**
   * 建设单位
   */
  public buildUnit: string;

  /**
   * 监理单位
   */
  public supervisionUnit: string;

  /**
   * 项目状态图标
   */
  public statusIconClass: string;
  /**
   * 坐标
   */
  public positionCenterLatitude?: string;
  public positionCenterLongitude?: string;
}
