import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ExportColumnListModel} from '../../../../shared-module/model/export-column-list.model';

/**
 * 导出配件数据模型
 */
export class ExportPartsModel {

  /**
   * 过滤条件
   */
  public queryCondition: QueryConditionModel;
  /**
   * 选中项
   */
  public columnInfoList: ExportColumnListModel[];
  /**
   * 文件类型
   */
  public excelType: number;
  constructor(queryCondition: QueryConditionModel, columnInfoList: ExportColumnListModel[], excelType: number) {
    this.queryCondition = queryCondition;
    this.columnInfoList = columnInfoList;
    this.excelType = excelType;
  }
}
