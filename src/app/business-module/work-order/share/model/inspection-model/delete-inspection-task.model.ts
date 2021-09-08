/**
 *删除巡检模板
 */
export class DeleteInspectionTaskModel {
  /**
   * 是否已删除
   */
  isDeleted?: string;
  deleted?: string;
  /**
   * 任务id集合
   */
  inspectionTaskIds?: string[];
}
