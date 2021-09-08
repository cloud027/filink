import {Subject} from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * 导入服务用于列表刷新使用
 */
@Injectable()
export class ImportMissionService {
  /**
   * 刷新数据主题
   * type {Subject<any>}
   */
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
