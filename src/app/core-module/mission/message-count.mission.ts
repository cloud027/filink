import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class MessageCountMission {
  private messageCount = new Subject<number>();
  /**
   * 用于监听数据变化
   * type {Observable<any>}
   */
  public messageCountChangeHook = this.messageCount.asObservable();

  /**
   * 用于提交数据
   * param data
   */
  messageCountChange(data: number) {
    this.messageCount.next(data);
  }
}
