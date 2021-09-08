import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * 设备列表/分组列表地图定位
 */
export class PositionService {

  public eventEmit: EventEmitter<any>;

  constructor() {
    this.eventEmit = new EventEmitter();
  }
}
