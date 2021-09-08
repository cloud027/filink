import {Injectable, EventEmitter} from '@angular/core';

@Injectable(
  {providedIn: 'root'}
)
export class OperationService {
  public eventEmit: any;

  constructor() {
    this.eventEmit = new EventEmitter();
  }
}
