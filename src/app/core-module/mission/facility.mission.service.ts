import {Subject} from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * Created by xiaoconghu on 2019/5/14.
 */
@Injectable()
export class FacilityMissionService {
  /**
   * 刷新数据主题
   * type {Subject<any>}
   */
  private refreshSub = new Subject<any>();
  /**
   * 用于监听数据变化
   * type {Observable<any>}
   */
  refreshChangeHook = this.refreshSub.asObservable();

  /**
   * 用于提交数据
   * param data
   */
  refreshChange(data: any) {
    this.refreshSub.next(data);
  }
}
