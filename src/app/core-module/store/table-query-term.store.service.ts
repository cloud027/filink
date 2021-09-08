import {Injectable} from '@angular/core';
import {FilterCondition} from '../../shared-module/model/query-condition.model';

/**
 * 列表缓存查询条件服务类
 */
@Injectable()
export class TableQueryTermStoreService {
  /**
   * 查询条件存储map
   */
  private queryTermMap = new Map<string, Map<string, FilterCondition>>();

  /**
   * 更新数据
   * param primaryKey
   * param queryTerm
   */
  public updateQueryTerm(primaryKey: string, queryTerm: Map<string, FilterCondition>): void {
    this.queryTermMap.set(primaryKey, queryTerm);
  }

  /**
   * 应用数据
   * param primaryKey
   */
  public applyQueryTerm(primaryKey: string): Map<string, FilterCondition> {
    return this.queryTermMap.get(primaryKey);
  }

  /**
   * 清空数据
   */
  public clearQueryTerm(): void {
    this.queryTermMap.clear();
  }


}
