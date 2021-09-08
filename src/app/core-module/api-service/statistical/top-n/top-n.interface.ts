import {Observable} from 'rxjs';

export interface TopNInterface {
  /**
   * 查询传感值TopN
   */
  queryDeviceSensorTopNum(body): Observable<Object>;

  /**
   * 根据Id查询设施详情
   */
  getDeviceByIds(body): Observable<Object>;

  /**
   * 工单TopN
   */
  queryTopListDeviceCountGroupByDevice(body): Observable<Object>;

  /**
   * 工单Topn列表导出
   */
  procClearTopListStatisticalExport(body): Observable<Object>;

  /**
   * 告警TopN
   */
  queryAlarmTop(body): Observable<Object>;

  /**
   * 开锁次数TopN
   */
  queryUnlockingTopNum(body): Observable<Object>;

  /**
   * Odn设施TopN
   */
  queryPortTopN(body): Observable<Object>;

  /**
   * 开锁次数列表导出
   * param body
   */
  exportUnlockingTopNum(body): Observable<Object>;

  /**
   * 传感器值topn导出
   */
  exportDeviceSensorTopNum(body): Observable<Object>;

  /**
   * 端口资源topn导出
   */
  exportPortTopNumber(body): Observable<Object>;

  /**
   * 告警topn导出
   */
  exportDeviceTop(body): Observable<Object>;
}


