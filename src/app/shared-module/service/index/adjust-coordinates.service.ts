import {Injectable, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * 首页选择坐标调整
 */
export class AdjustCoordinatesService {
  public eventEmit: EventEmitter<any>;

  constructor() {
    this.eventEmit = new EventEmitter();
  }
}
