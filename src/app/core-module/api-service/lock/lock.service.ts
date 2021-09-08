import {LockInterface} from './lock.interface';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LOCK_URL} from './lock-request-url';
import {LockModel} from '../../model/facility/lock.model';
import {ResultModel} from '../../../shared-module/model/result.model';
import {ControlModel} from '../../model/facility/control.model';
import {CommonInstructModel} from '../../model/application-system/common-instruct.model';

@Injectable()
export class LockService implements LockInterface {
  constructor(private $http: HttpClient) {
  }

  getLockControlInfo(id: string): Observable<ResultModel<Array<ControlModel>>> {
    return this.$http.get<ResultModel<Array<ControlModel>>>(`${LOCK_URL.GET_LOCK_CONTROL_INFO}/${id}`);
  }

  getLockControlInfoForEquipment(id: string): Observable<ResultModel<Array<ControlModel>>> {
    return this.$http.get<ResultModel<Array<ControlModel>>>(`${LOCK_URL.GET_LOCK_CONTROL_INFO_FOR_EQUIPMENT}/${id}`);
  }

  getLockInfo(id: string): Observable<ResultModel<LockModel[]>> {
    return this.$http.get<ResultModel<Array<LockModel>>>(`${LOCK_URL.GET_LOCK_INFO}/${id}`);
  }

  getLockInfoForEquipment(id: string): Observable<ResultModel<LockModel[]>> {
    return this.$http.get<ResultModel<Array<LockModel>>>(`${LOCK_URL.GET_LOCK_INFO_FOR_EQUIPMENT}/${id}`);
  }

  getPramsConfig(body): Observable<Object> {
    return this.$http.get(`${LOCK_URL.GET_PRAMS_CONFIG}/${body}`);
  }

  setControl(body): Observable<Object> {
    return this.$http.post(`${LOCK_URL.SET_CONTROL}`, body);
  }

  openLock(body: { deviceId: string, doorNumList: string[] }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LOCK_URL.OPEN_LOCK}`, body);
  }

  instructDistribute(body: CommonInstructModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LOCK_URL.instructDistribute}`, body);
  }

  updateDeviceStatus(body): Observable<Object> {
    return this.$http.post(`${LOCK_URL.UPDATE_DEVICE_STATUS}`, body);
  }

  queryUnlockingTimesByDeviceId(body): Observable<Object> {
    return this.$http.post(`${LOCK_URL.QUERY_UNLOCKING_TIMES_BY_DEVICE_ID}`, body);
  }

  deleteLockAndControlById(body): Observable<Object> {
    return this.$http.post(`${LOCK_URL.DELETE_LOCK_AND_CONTROL_BY_ID}`, body);

  }
}
