/**
 * 巡检对象请求条件
 */
import {SortCondition} from '../../../shared-module/model/query-condition.model';

export class InspectionObjectInfoModel {
  /**
   * 排序条件
   */
  sortCondition: SortCondition;
  /**
   * 设施容器
   */
  deviceIdList: string[];
}
