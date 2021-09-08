/**
 * 巡检报告-巡检项
 */
export class InspectionReportItemModel {
  /**
   * 巡检项id
   */
  public inspectionItemId?: string;
  /**
   * 巡检项名称
   */
  public inspectionItemName?: string;
  /**
   * 是否通过
   */
  public inspectionValue?: string;
  /**
   * 备注
   */
  public remark?: string;
  /**
   * 状态名称
   */
  public statusName?: string;
  /**
   * 图标
   */
  public statusClass?: string;
}
