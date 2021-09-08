import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DeviceReportUrl} from '../const/device-report-url';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {DeviceReqModel} from '../model/device/device-req.model';
@Injectable()
export class DeviceStatisticalService {

  constructor(private $http: HttpClient) {
  }

  /**
   * 查询设施数量
   * param body
   */
  queryDeviceNumber(body: DeviceReqModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(DeviceReportUrl.queryDeviceNumber, body);
  }

  /**
   * 统计设施状态
   * param body
   */
  queryDeviceStatus(body: DeviceReqModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(DeviceReportUrl.queryDeviceStatus, body);
  }

  /**
   * 统计部署状态
   * param body
   */
  queryDeviceDeployStatus(body: DeviceReqModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(DeviceReportUrl.queryDeviceDeployStatus, body);
  }

  /**
   * 统计设施传感值
   * param body
   */
  queryDeviceSensor(body: DeviceReqModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(DeviceReportUrl.queryDeviceSensorValues, body);
  }

  /**
   * 导出统计设施数量
   * param body
   */
  exportDeviceCount(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(DeviceReportUrl.exportDeviceCount, body);
  }

  /**
   * 导出统计设施部署状态
   * param body
   */
  exportDeployStatusCount(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(DeviceReportUrl.exportDeployStatusCount, body);
  }

  /**
   * 导出统计设施状态
   * param body
   */
  exportDeviceStatusCount(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(DeviceReportUrl.exportDeviceStatusCount, body);
  }
}
