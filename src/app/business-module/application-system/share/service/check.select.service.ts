import {Subject} from 'rxjs';

/**
 *
 */
export class CheckSelectService {
  /**
   * 刷新数据主题
   * type {Subject<any>}
   */
  private checkSelectSub = new Subject<any>();
  /**
   * 用于监听数据变化
   * type {Observable<any>}
   */
  checkSelectOnChange = this.checkSelectSub.asObservable();

  /**
   * 用于提交数据
   * param data
   */
  checkSelectChange(data: any) {
    this.checkSelectSub.next(data);
  }
}
