import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {STATISTICAL_URL} from '../statistical-request-url';
import {TopNInterface} from './top-n.interface';

@Injectable()
export class TopNService implements TopNInterface {

  constructor(private $http: HttpClient) {
  }

  queryDeviceSensorTopNum(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.queryDeviceSensorTopNum, body);
  }

  getDeviceByIds(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.getDeviceByIds, body);
  }

  queryTopListDeviceCountGroupByDevice(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.queryTopListDeviceCountGroupByDevice, body);
  }

  procClearTopListStatisticalExport(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.procClearTopListStatisticalExport, body);
  }

  queryAlarmTop(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.queryAlarmTop, body);
  }

  queryUnlockingTopNum(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.queryUnlockingTopNum, body);
  }

  queryPortTopN(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.queryPortTopN, body);
  }

  exportUnlockingTopNum(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportUnlockingTopNum, body);
  }

  exportDeviceSensorTopNum(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportDeviceSensorTopNum, body);
  }

  exportPortTopNumber(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportPortTopNumber, body);
  }

  exportDeviceTop(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportDeviceTop, body);
  }
}
