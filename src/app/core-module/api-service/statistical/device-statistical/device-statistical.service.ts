import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DeviceStatisticalInterface} from './device-statistical.interface';
import {STATISTICAL_URL} from '../statistical-request-url';

@Injectable()
export class DeviceStatisticalService implements DeviceStatisticalInterface {

  constructor(private $http: HttpClient) {
  }

  queryDeviceNumber(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.queryDeviceNumber, body);
  }

  queryDeviceStatus(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.queryDeviceStatus, body);
  }

  queryDeviceDeployStatus(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.queryDeviceDeployStatus, body);
  }

  queryDeviceSensor(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.queryDeviceSensorValues, body);
  }

  queryEquipmentSensor(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.queryEquipmentSensorValues, body);
  }

  exportDeviceCount(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportDeviceCount, body);
  }

  exportDeployStatusCount(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportDeployStatusCount, body);
  }

  exportDeviceStatusCount(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportDeviceStatusCount, body);
  }
}
