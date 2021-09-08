import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * 列表选中设备变化
 */
export class SelectTableEquipmentChangeService {
  public eventEmit: any;
  constructor() {
    this.eventEmit = new EventEmitter();
  }
}
