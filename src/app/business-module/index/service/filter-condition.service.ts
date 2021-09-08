import {Injectable, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * 筛选条件变动刷新地图
 */
export class FilterConditionService {
  public eventEmit: any;

  constructor() {
    this.eventEmit = new EventEmitter();
  }
}
