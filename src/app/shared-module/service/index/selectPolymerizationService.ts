import {Injectable, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * 首页选择分组
 */
export class SelectPolymerizationService {
  public eventEmit: EventEmitter<any>;

  constructor() {
    this.eventEmit = new EventEmitter();
  }
}
