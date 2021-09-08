import {Observable} from 'rxjs';

export interface MapScreenInterface {
  /**
   *查询地区信息
   */
  queryGetArea(body): Observable<Object>;

  /**
   * 获取所有的省
   * returns {Observable<Object>}
   */
  getAllProvince(): Observable<Object>;

  /**
   * 获取所有的城市信息
   * returns {Observable<Object>}
   */
  getAllCityInfo(): Observable<Object>;

  /**
   * 获取所有的大屏列表
   * returns {Observable<Object>}
   */
  getALLScreen(): Observable<object>;

  /**
   * 修改大屏名称
   * returns {Observable<Object>}
   */
  editScreenName(body): Observable<Object>;

  /**
   * 获取当前告警类型
   * returns {Observable<Object>}
   */
  getCurrentAlarm(): Observable<Object>;

  /**
   * 获取各种设施类型数量
   * returns {Observable<Object>}
   */
  getDeviceTypeCount(): Observable<Object>;

  /**
   * 获取各种设施状态数量
   * returns {Observable<Object>}
   */
  getDeviceStatusCount(): Observable<Object>;

  /**
   * 获取当前告警列表
   * param body
   * returns {Observable<Object>}
   */
  getAlarmCurrentList(body): Observable<Object>;

  /**
   * 查询告警设施topN
   * param body
   * returns {Observable<Object>}
   */
  getScreenDeviceGroup(body): Observable<Object>;

  /**
   * 查询告警增量数据
   * returns {Observable<Object>}
   */
  getAlarmIncrement(sufix): Observable<Object>;

  /**
   * 根据设施ids 查询设施信息
   * returns {Object}
   */
  getDeviceByIds(ids): Observable<Object>;
}
