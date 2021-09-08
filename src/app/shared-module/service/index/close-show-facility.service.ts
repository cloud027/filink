import {Injectable, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloseShowFacilityService {
  public eventEmit;

  constructor() {
    this.eventEmit = new EventEmitter();
  }
}
