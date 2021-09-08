import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MapScreenInterface} from './mapScreen.interface';
import {Observable} from 'rxjs';
import {
  GET_ALL_CITYINFO, GET_ALL_PROVINCE, GET_AREA, GET_ALL_SCREEN, EDIT_SCREEN_NAME, GET_CURRENT_ALARM,
  GET_DEVICE_TYPE_COUNT, GET_DEVICE_STATUS_COUNT, GET_ALARM_CURRENT_LIST, GET_SCREEN_DEVICE_GROUP,
  GET_ALARM_INCREMENT, GET_DEVICE_BY_IDS
} from '../screen-map-request-url';


@Injectable()
export class MapScreenService implements MapScreenInterface {
  constructor(private $http: HttpClient) {
  }

  queryGetArea(city): Observable<Object> {
    return this.$http.post(`${GET_AREA}`, {areaCode: city});
  }

  getAllProvince(): Observable<Object> {
    return this.$http.get(`${GET_ALL_PROVINCE}`);
  }

  getAllCityInfo(): Observable<Object> {
    return this.$http.get(`${GET_ALL_CITYINFO}`);
  }

  getALLScreen(): Observable<object> {
    return this.$http.get(`${GET_ALL_SCREEN}`);
  }

  editScreenName(body): Observable<Object> {
    return this.$http.post(`${EDIT_SCREEN_NAME}`, body);
  }

  getCurrentAlarm(): Observable<Object> {
    return this.$http.get(`${GET_CURRENT_ALARM}`);
  }

  getDeviceTypeCount(): Observable<Object> {
    return this.$http.get(`${GET_DEVICE_TYPE_COUNT}`);
  }

  getDeviceStatusCount(): Observable<Object> {
    return this.$http.get(`${GET_DEVICE_STATUS_COUNT}`);
  }

  getAlarmCurrentList(body): Observable<Object> {
    return this.$http.post(`${GET_ALARM_CURRENT_LIST}`, body);
  }

  getScreenDeviceGroup(body): Observable<Object> {
    return this.$http.post(`${GET_SCREEN_DEVICE_GROUP}`, body);
  }

  getAlarmIncrement(sufix): Observable<Object> {
    return this.$http.post(`${GET_ALARM_INCREMENT}/${sufix}`, {});
  }

  getDeviceByIds(ids): Observable<Object> {
    return this.$http.post(`${GET_DEVICE_BY_IDS}`, ids);
  }
}
