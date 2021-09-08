import {Observable} from 'rxjs';

export interface SmartInterface {
  /**
   * 创建模板
   * param body
   */
  createTemplate(body);

  /**
   * 查询模板详情
   * param body
   */
  queryDetailedTemplate(body);

  /**
   * 查询所有模板
   * param body
   */
  queryAllTemplate(body);

  /**
   * 实景图查询
   * param body
   */
  queryRealPosition(body);

  /**
   * 获取框信息
   * param id
   */
  queryRealPositionByFrame(id);

  /**
   * 获取端口信息
   * param id
   */
  queryPortInfoByPortId(id);

  /**
   * 获取智能标签信息
   * param body
   */
  querySmartInfo(body);

  /**
   * 更新设施专属业务信息
   * param body
   * returns {Observable<Object>}
   */
  uploadFacilityBusinessInfo(body): Observable<Object>;

  /**
   * 通过id查询设施专属业务信息
   * param deviceId
   * param deviceType
   * returns {Observable<Object>}
   */
  queryFacilityBusInfoById(deviceId, deviceType): Observable<Object>;

  /**
   * 查询对端端口信息
   * param body
   */
  queryJumpFiberInfoByPortInfo(body);
}
