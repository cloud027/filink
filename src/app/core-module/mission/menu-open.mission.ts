import {Subject} from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * Created by xiaoconghu on 2020/7/17.
 */
@Injectable()
export class MenuOpenMissionService {
  /**
   * 菜单展开事件
   * type {Subject<any>}
   */
  private menuOpen = new Subject<any>();
  /**
   * 用于监听数据变化
   * type {Observable<any>}
   */
  menuOpenChangeHook = this.menuOpen.asObservable();

  /**
   * 用于提交数据
   * param data
   */
  menuOpenChange(data: any) {
    this.menuOpen.next(data);
  }
}
