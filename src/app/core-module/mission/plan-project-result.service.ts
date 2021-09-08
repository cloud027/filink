import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * 监听项目点位更新结果服务
 */
@Injectable()
export class PlanProjectResultService {
  private refresh = new Subject<any>();
  /**
   * 用于监听数据变化
   * type {Observable<any>}
   */
  refreshChangeHook = this.refresh.asObservable();
  /**
   * 用于提交数据
   * param data
   */
  refreshChange(data: any) {
    this.refresh.next(data);
  }
}
