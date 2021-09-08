import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class BusinessFacilityService {
  public eventEmit: any;

  constructor() {
    this.eventEmit = new EventEmitter();
  }

}
