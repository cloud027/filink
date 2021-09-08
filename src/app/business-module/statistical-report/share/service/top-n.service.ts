import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TopNUrl} from '../const/top-n-url';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {TopDeviceModel} from '../model/top/top-device.model';
import {TopNAlarmModel} from '../model/top/top-n-alarm.model';
import {AlarmTopResultModel} from '../model/top/alarm-top-result.model';
import {TopWorkModel} from '../model/top/top-work.model';
import {SelectModel} from '../../../../shared-module/model/select.model';

@Injectable()
export class TopNService {

  constructor(private $http: HttpClient) {
  }

  /**
   * 查询传感次数top
   * param body
   */
  queryDeviceSensorTopNum(body): Observable<Object> {
    return this.$http.post(TopNUrl.queryDeviceSensorTopNum, body);
  }

  /**
   * 查询设施信息
   * param body 设施idList
   */
  getDeviceByIds(body: [string]): Observable<ResultModel<TopDeviceModel[]>> {
    return this.$http.post<ResultModel<TopDeviceModel[]>>(TopNUrl.getDeviceByIds, body);
  }

  /**
   * 查询端口top
   * param body
   */
  queryTopListDeviceCountGroupByDevice(body): Observable<Object> {
    return this.$http.post(TopNUrl.queryTopListDeviceCountGroupByDevice, body);
  }

  /**
   * 导出工单top
   * param body
   */
  procClearTopListStatisticalExport(body: TopWorkModel): Observable<Object> {
    return this.$http.post(TopNUrl.procClearTopListStatisticalExport, body);
  }

  /**
   * 导出工单设备类型top
   */
  exportOrderEquipment(body: TopWorkModel): Observable<Object> {
    return this.$http.post(TopNUrl.exportOrderEquipment, body);
  }

  /**
   * 查询告警top
   * param body
   */
  queryAlarmTop(body: TopNAlarmModel): Observable<ResultModel<AlarmTopResultModel[]>> {
    return this.$http.post<ResultModel<AlarmTopResultModel[]>>(TopNUrl.queryAlarmTop, body);
  }

  /**
   * 查询开锁top
   * param body
   */
  queryUnlockingTopNum(body): Observable<Object> {
    return this.$http.post(TopNUrl.queryUnlockingTopNum, body);
  }

  /**
   * 查询端口top
   * param body
   */
  queryPortTopN(body): Observable<Object> {
    return this.$http.post(TopNUrl.queryPortTopN, body);
  }

  /**
   * 导出开锁次数top
   * param body
   */
  exportUnlockingTopNum(body): Observable<Object> {
    return this.$http.post(TopNUrl.exportUnlockingTopNum, body);
  }

  /**
   * 导出设施传感值top
   * param body
   */
  exportDeviceSensorTopNum(body): Observable<Object> {
    return this.$http.post(TopNUrl.exportDeviceSensorTopNum, body);
  }

  /**
   * 导出端口top
   * param body
   */
  exportPortTopNumber(body): Observable<Object> {
    return this.$http.post(TopNUrl.exportPortTopNumber, body);
  }

  /**
   * 导出设施top
   * param body
   */
  exportDeviceTop(body): Observable<Object> {
    return this.$http.post(TopNUrl.exportDeviceTop, body);
  }

  /**
   * 故障次数导出设施
   */
  exportTroubleDevice(body): Observable<Object> {
    return this.$http.post(TopNUrl.exportTroubleDevice, body);
  }

  /**
   * 故障次数导出设备
   */
  exportTroubleEquipment(body): Observable<Object> {
    return this.$http.post(TopNUrl.exportTroubleEquipment, body);
  }

  /**
   * 故障类型
   */
  getTroubleType(): Observable<ResultModel<SelectModel[]>> {
    return this.$http.get<ResultModel<SelectModel[]>>(TopNUrl.queryTroubleType);
  }

  /**
   * 故障次数统计
   */
  statisticsFailure(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(TopNUrl.queryTroubleTimes, body);
  }

  /**
   * 使用设备id获取设备
   */
  queryEquipmentByIds(body): Observable<ResultModel<any>> {
  return this.$http.post<ResultModel<any>>(TopNUrl.queryEquipById, body);
}
}
