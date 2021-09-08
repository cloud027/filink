import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/index';

@Injectable()
export class IndexMissionService {
  // 巡检工单
  private workSub = new Subject<any>();
  workChangeHook = this.workSub.asObservable();

  // 销账工单
  private clearBarrierSub = new Subject<any>();
  clearBarrierChangeHook = this.clearBarrierSub.asObservable();

  // 设施
  private facilitySub = new Subject<any>();
  facilityChangeHook = this.facilitySub.asObservable();

  facilityChange(data: any) {
    this.facilitySub.next(data);
  }

  workChange(data: any) {
    this.workSub.next(data);
  }

  clearBarrierChange(data: any) {
    this.clearBarrierSub.next(data);
  }

  closeClearBarrierChange() {
    this.clearBarrierSub.next();
    this.clearBarrierSub.complete();
  }
}
