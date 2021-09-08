import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ExportColumnListModel} from '../../../../shared-module/model/export-column-list.model';

export class ExcelExportModel {
  public excelType: number;
  public queryCondition: QueryConditionModel;
  public taskId: string;
  public columnInfoList?: ExportColumnListModel[];
  public objectList?: any[];
}
