import { Injectable} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * 监听批量启用禁用策略结果
 */
@Injectable()
export class EnableStrategyResultService {
  private refresh = new Subject<any>();
  refreshStrategyList = this.refresh.asObservable();

  refreshChange(data: any) {
    this.refresh.next(data);
  }
}
