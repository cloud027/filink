/**
 * 迁移数据模型
 */
export class MigrationModel {
  /**
   * 配件id
   */
  public  deviceIds?: any[];
  public  equipmentIds?: any[];
  public  areaName?: string;
  public  parentId?: string;
  public  accountabilityUnit?: any;
  /**
   * 配件名称
   */
  public  areaId: string;
  /**
   * 配件类型
   */
  public  areaCode?: string;
  /**
   * 配件类型名称
   */
  public  company?: string;
  /**
   * 配件code
   */
  public  migrationReason?: string;
}
