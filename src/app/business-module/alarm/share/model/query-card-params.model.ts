import {FilterCondition} from '../../../../shared-module/model/query-condition.model';

/**
 * 选择设施模型
 */
export class QueryCardParamsModel {
  /**
  * 类型
  */
  public statisticsType: string;
  /**
  * 查询条件
  */
  public filterConditions: FilterCondition[];
}
