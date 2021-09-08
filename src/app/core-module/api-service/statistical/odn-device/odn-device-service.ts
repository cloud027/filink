import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {STATISTICAL_URL} from '../statistical-request-url';
import {OdnDeviceInterface} from './odn-device.interface';

@Injectable()
export class OdnDeviceService implements OdnDeviceInterface {

  constructor(private $http: HttpClient) {
  }

  queryAreaOdnDevice(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.queryDeviceDtoForPageSelection, body);
  }

  jumpFiberPortStatistics(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.jumpFiberPortStatistics, body);
  }

  // 单设备端口状态统计
  queryDevicePortStatistics(id): Observable<Object> {
    return this.$http.get(`${STATISTICAL_URL.devicePortStatistics}/${id}`);
  }

  meltFiberPortStatistics(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.meltFiberPortStatistics, body);
  }

  discPortStatistics(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.discPortStatistics, body);
  }

  framePortStatistics(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.framePortStatistics, body);
  }


  inner(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.jumpConnectionInCabinet, body);
  }

  outer(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.jumpConnectionOutCabinet, body);
  }

  queryTemplateTop(id): Observable<Object> {
    return this.$http.get(`${STATISTICAL_URL.queryTemplateTop}/${id}`);
  }

  opticalFiber(): Observable<Object> {
    return this.$http.get(STATISTICAL_URL.opticalFiber);
  }

  opticalFiberSection(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.opticalFiberSection, body);
  }

  exportJumpFiberPortStatistics(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportJumpFiberPortStatistics, body);
  }

  exportMeltFiberPortStatistics(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportMeltFiberPortStatistics, body);
  }

  exportDiscPortStatistics(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportDiscPortStatistics, body);
  }

  exportFramePortStatistics(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportFramePortStatistics, body);
  }

  exportOpticalFiber(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportOpticalFiber, body);
  }

  exportJumpConnectionOutCabinet(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportJumpConnectionOutCabinet, body);
  }

  exportOpticalFiberSection(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportOpticalFiberSection, body);
  }

  exportCoreStatistics(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportCoreStatistics, body);
  }

  exportJumpConnectionInCabinet(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.exportJumpConnectionInCabinet, body);
  }

  coreStatistics(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.coreStatistics, body);
  }
}
