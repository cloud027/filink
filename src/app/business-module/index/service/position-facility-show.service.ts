import {Injectable, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * 其他模块跳转首页，设施分层刷新
 */
export class PositionFacilityShowService {
  public eventEmit: any;

  constructor() {
    this.eventEmit = new EventEmitter();
  }
}
