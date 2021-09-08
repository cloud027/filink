import {QueryConditionModel} from './query-condition.model';
import {ExportColumnListModel} from './export-column-list.model';
import {ExportTypeEnum} from '../enum/export-type-enum';

/**
 * 导出参数请求模型
 */
export class ExportRequestModel {
  /**
   * 导出行内容
   */
  columnInfoList: ExportColumnListModel[];
  /**
   * 导出类型
   */
  excelType: ExportTypeEnum;
  /**
   * 列表导出条件
   */
  queryCondition: QueryConditionModel;

  /**
   * 不需要后台进行查询的导出的数据
   */
  objectList?: any[];

  constructor(columnInfoList?, excelType?, queryCondition?) {
    this.columnInfoList = columnInfoList || [];
    this.excelType = excelType || ExportTypeEnum.xls;
    this.queryCondition = queryCondition || new QueryConditionModel();
  }
}
