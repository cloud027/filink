import {Observable} from 'rxjs';
import {Result} from '../../../../shared-module/entity/result';

export interface MapInterface {
  /**
   * 查询所有设施列表
   * returns {Observable<Object>}
   */
  getALLFacilityList(): Observable<Result>;

  /**
   * 查询所有设施列表(基本数据，key值简化)
   * returns {Observable<Object>}
   */
  getALLFacilityListBase(): Observable<Object>;

  /**
   * 查询所有设施列表(key值简化)
   * returns {Observable<Object>}
   */
  getALLFacilityListSimple(): Observable<Object>;

  /**
   * 查询所有区域列表
   * returns {Observable<Object>}
   */
  getALLAreaList(): Observable<Object>;


  /**
   * 获取设施类型配置信息
   * returns {Observable<Object>}
   */
  getALLFacilityConfig(): Observable<Object>;

  /**
   * 修改用户地图设施类型配置的设施类型启用状态
   * param body
   * returns {Observable<Object>}
   */
  modifyFacilityTypeConfig(body): Observable<Object>;

  /**
   * 修改用户地图设施类型配置的设施图标尺寸
   * param body
   * returns {Observable<Object>}
   */
  modifyFacilityIconSize(body): Observable<Object>;

  /**
   * 收藏设施
   * param id {string} 设施id
   * returns {Observable<Object>}
   */
  collectFacility(id): Observable<Object>;

  /**
   * 取消收藏设施
   * param id {string} 设施id
   * returns {Observable<Object>}
   */
  unCollectFacility(id): Observable<Object>;

  /**
   * 获取收藏设施统计
   * returns {Observable<Object>}
   */
  getCollectFacilityListStatistics(): Observable<Object>;

  /**
   * 获取收藏设施列表
   * param body
   * returns {Observable<Object>}
   */
  getCollectFacilityList(body): Observable<Object>;

  /**
   * 获取所有收藏设施列表
   * param body
   * returns {Observable<Object>}
   */
  getAllCollectFacilityList(): Observable<Object>;

  /**
   * 查询当前用户区域列表
   * param body
   * returns {Observable<Object>}
   */
  getALLAreaListForCurrentUser(): Observable<Object>;

  /**
   * 查询当前用户区域列表
   * param id
   * returns {Observable<Object>}
   */
  findDeviceId(id): Observable<Object>;


  /**
   * 查询设施当前告警各级别数量
   * param body
   * returns {Observable<Object>}
   */
  getQueryAlarmLevelGroups(body): Observable<Object>;

  /**
   * 查询当前告警各级别数量
   * returns {Observable<Object>}
   */
  queryAlarmCurrentLevelGroup(): Observable<Object>;

  /**
   * 操作记录
   * param body
   * returns {Observable<Object>}
   */
  findOperateLog(body): Observable<Object>;

  /**
   * 查询告警设施Top10
   * returns {Observable<Object>}
   */
  queryScreenDeviceIdsGroup(): Observable<Object>;

  /**
   * 查询告警设施Top10名称
   * param body
   * returns {Observable<Object>}
   */
  queryDeviceByIds(body): Observable<Object>;

  /**
   * 查询各设施状态数量
   * returns {Observable<Object>}
   */
  queryUserDeviceStatusCount(): Observable<Object>;

  /**
   *  工单增量
   * param body
   * returns {Observable<Object>}
   */
  queryHomeProcAddListCountGroupByDay(body): Observable<Object>;

  /**
   *  查询各设施状态数量
   * param body
   * param id
   * returns {Observable<Object>}
   */
  queryAlarmDateStatistics(id, body): Observable<Object>;

  /**
   * 查询繁忙TOP
   * returns {Observable<Object>}
   */
  queryUserUnlockingTopNum(): Observable<Object>;

  /**
   *  根据光缆ID查询光缆所有设施
   * param id
   * returns {Observable<Object>}
   */
  queryDeviceInfoListByOpticCableId(id): Observable<Object>;

  /**
   *  根据设备id询端口使用率
   * param id
   * returns {Observable<Object>}
   */
  queryDeviceUsePortStatistics(id): Observable<Object>;

  /**
   *  根据Id 查询设施接口信息
   * param id
   * returns {Observable<Object>}
   */
  queryHomeDeviceById(id): Observable<Object>;

  /**
   * 首次加载
   * returns {Observable<Object>}
   */
  queryHomeDeviceArea(): Observable<Object>;

  /**
   *  首页大数据刷新
   * param id
   * returns {Observable<Object>}
   */
  refreshHomeDeviceAreaHuge(params): Observable<Object>;

  /**
   * 首页数据刷新
   * returns {Observable<Object>}
   */
  refreshHomeDeviceArea(): Observable<Object>;

  /**
   * 批量操作
   * returns {Observable<Object>}
   */
  instructDistribute(body): Observable<Object>;

  /**
   * 获取右侧详情卡亮度,或者音量初始值
   * returns {Observable<Object>}
   */
  getLightnessVoice(body): Observable<Object>;

  /**
   * 设施坐标调整保存
   */
  deviceUpdateCoordinates(body): Observable<Object>;

  /**
   * 设备坐标调整保存
   */
  equipmentUpdateCoordinates(body): Observable<Object>;

  /**
   * 设备在线率统计图
   */
  equipmentOnlineRateStatistics(body): Observable<Object>;


  /**
   * 故障类型统计图
   */
  troubleTypeStatistics(body): Observable<Object>;


  /**
   * 规划数据统计图
   */
  planStatistics(body): Observable<Object>;


  /**
   * 项目数据统计图
   */
  projectStatistics(body): Observable<Object>;


  /**
   * 工单类型统计图
   */
  workOrderStatistics(body): Observable<Object>;


  /**
   * 设备总能耗统计图
   */
  equipmentTotalEnergyConsumptionStatistics(body): Observable<Object>;


  /**
   * 设备传输有效率统计图
   */
  equipmentTransmissionEfficiencyStatistics(body): Observable<Object>;


  /**
   * 故障率分析统计图
   */
  troubleRateStatistics(body): Observable<Object>;

}
