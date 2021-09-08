import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {STATISTICAL_URL} from '../../../../core-module/api-service/statistical/statistical-request-url';
import {OdnUrl} from '../const/odn-url';

@Injectable()
export class OdnService {
  constructor(private $http: HttpClient) {
  }
  queryAreaOdnDevice(body): Observable<Object> {
    return this.$http.post(OdnUrl.queryDeviceDtoForPageSelection, body);
  }

  jumpFiberPortStatistics(body): Observable<Object> {
    return this.$http.post(OdnUrl.jumpFiberPortStatistics, body);
  }

  // 单设备端口状态统计
  queryDevicePortStatistics(id): Observable<Object> {
    return this.$http.get(`${OdnUrl.devicePortStatistics}/${id}`);
  }

  meltFiberPortStatistics(body): Observable<Object> {
    return this.$http.post(OdnUrl.meltFiberPortStatistics, body);
  }

  discPortStatistics(body): Observable<Object> {
    return this.$http.post(OdnUrl.discPortStatistics, body);
  }

  framePortStatistics(body): Observable<Object> {
    return this.$http.post(OdnUrl.framePortStatistics, body);
  }


  inner(body): Observable<Object> {
    return this.$http.post(OdnUrl.jumpConnectionInCabinet, body);
  }

  outer(body): Observable<Object> {
    return this.$http.post(STATISTICAL_URL.jumpConnectionOutCabinet, body);
  }

  queryTemplateTop(id): Observable<Object> {
    return this.$http.get(`${OdnUrl.queryTemplateTop}/${id}`);
  }

  opticalFiber(): Observable<Object> {
    return this.$http.get(OdnUrl.opticalFiber);
  }

  opticalFiberSection(body): Observable<Object> {
    return this.$http.post(OdnUrl.opticalFiberSection, body);
  }

  exportJumpFiberPortStatistics(body): Observable<Object> {
    return this.$http.post(OdnUrl.exportJumpFiberPortStatistics, body);
  }

  exportMeltFiberPortStatistics(body): Observable<Object> {
    return this.$http.post(OdnUrl.exportMeltFiberPortStatistics, body);
  }

  exportDiscPortStatistics(body): Observable<Object> {
    return this.$http.post(OdnUrl.exportDiscPortStatistics, body);
  }

  exportFramePortStatistics(body): Observable<Object> {
    return this.$http.post(OdnUrl.exportFramePortStatistics, body);
  }

  exportOpticalFiber(body): Observable<Object> {
    return this.$http.post(OdnUrl.exportOpticalFiber, body);
  }

  exportJumpConnectionOutCabinet(body): Observable<Object> {
    return this.$http.post(OdnUrl.exportJumpConnectionOutCabinet, body);
  }

  exportOpticalFiberSection(body): Observable<Object> {
    return this.$http.post(OdnUrl.exportOpticalFiberSection, body);
  }

  exportCoreStatistics(body): Observable<Object> {
    return this.$http.post(OdnUrl.exportCoreStatistics, body);
  }

  exportJumpConnectionInCabinet(body): Observable<Object> {
    return this.$http.post(OdnUrl.exportJumpConnectionInCabinet, body);
  }

  coreStatistics(body): Observable<Object> {
    return this.$http.post(OdnUrl.coreStatistics, body);
  }
}
