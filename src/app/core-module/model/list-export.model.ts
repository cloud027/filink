import {ExportColumnListModel} from '../../shared-module/model/export-column-list.model';
import {FilterCondition} from '../../shared-module/model/query-condition.model';
/**
 * 列表导出模型
 */
export class ListExportModel<T> {
  /**
   * 过滤条件
   */
  queryTerm: FilterCondition[] = [];
  /**
   * 列表选中项
   */
  selectItem?: T;
  /**
   * 列表导出行数据
   */
  columnInfoList: ExportColumnListModel[];
  /**
   * 导出类型
   */
  excelType: number;
}
