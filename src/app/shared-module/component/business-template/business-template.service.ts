import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class BusinessTemplateService {
  public eventEmit: any;

  constructor() {
    this.eventEmit = new EventEmitter();
  }
}
