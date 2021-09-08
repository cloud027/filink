import {Injectable, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * 首页地图定位
 */
export class PositionService {
  public eventEmit: any;

  constructor() {
    this.eventEmit = new EventEmitter();
  }
}
