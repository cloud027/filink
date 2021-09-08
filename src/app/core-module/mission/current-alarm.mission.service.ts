import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AlarmQueryTypeEnum} from '../enum/alarm/alarm-query-type.enum';

@Injectable({
  providedIn: 'root'
})
export class CurrentAlarmMissionService {

  private subject = new Subject<any>();

  sendMessage(message: AlarmQueryTypeEnum) {
    this.subject.next( message );
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
