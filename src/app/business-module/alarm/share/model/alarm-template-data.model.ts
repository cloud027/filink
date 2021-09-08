import {PageCondition, SortCondition} from '../../../../shared-module/model/query-condition.model';

/**
 * 模板查询数据模型
 */
export class AlarmTemplateDataModel {
  // 分页条件
  public pageCondition: PageCondition;
  // 排序条件
  public sortCondition?: SortCondition;
  constructor(pageCondition, sortCondition?) {
    this.pageCondition = pageCondition;
    this.sortCondition = sortCondition;
  }
}
