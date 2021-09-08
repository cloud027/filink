import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * 地图所选设施/设备
 */
export class SelectFacilityChangeService {

  public eventEmit: any;

  constructor() {
    this.eventEmit = new EventEmitter();
  }
}
