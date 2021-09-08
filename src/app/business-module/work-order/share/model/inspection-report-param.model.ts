/**
 * 巡检报告接口入参
 */
export class InspectionReportParamModel {
  /**
   * 工单id
   */
  public procId?: string;
  /**
   * 设施名称
   */
  public deviceName?: string;
  /**
   * 页码
   */
  public pageNum?: number;
  /**
   * 分页大小
   */
  public pageSize?: number;
  /**
   * 设施id
   */
  public deviceId?: string;
  /**
   * 设备id
   */
  public equipmentId?: string;
  /**
   * 设备类型
   */
  public equipmentType?: string;
  /**
   *  挂载点
   */
  public mountPosition?: number;
}
