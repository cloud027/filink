/**
 * Created by xiaoconghu on 2019/1/15.
 */
import {OperatorEnum} from '../enum/operator.enum';

/**
 * 分页条件
 */
export class PageCondition {
  /**
   * 当前页
   */
  pageNum: number;
  /**
   * 一页多少条
   */
  pageSize: number;

  constructor(pageNum: number, pageSize: number) {
    this.pageNum = pageNum;
    this.pageSize = pageSize;
  }
}

/**
 * 过滤条件
 */
export class FilterCondition {
  /**
   * 过滤字段
   */
  filterField: string;
  /**
   * 操作符
   */
  operator: OperatorEnum | string;
  /**
   * 过滤值
   */
  filterValue: any;
  /**
   * 用于render自动定义搜索的名称回显
   */
  filterName?: any;
  /**
   * 初始值
   */
  initialValue?: any;
  /**
   * 过滤类型 用于方便数据转换
   */
  filterType?: string;
  /**
   * 用于时间段
   */
  extra?: string;

  constructor(filterField?: string, operator?: OperatorEnum, filterValue?: any) {
    this.filterField = filterField;
    this.operator = operator;
    this.filterValue = filterValue;
  }
}

/**
 * 排序条件
 */
export class SortCondition {
  sortField: string;
  sortRule: string;
}

/**
 * 查询条件
 */
export class QueryConditionModel {


  pageCondition: PageCondition;
  filterConditions: FilterCondition[] = [];
  sortCondition: SortCondition;
  bizCondition: any;

  constructor() {
    this.pageCondition = new PageCondition(1, 10);
    this.sortCondition = new SortCondition();
    this.bizCondition = {};
  }
}

