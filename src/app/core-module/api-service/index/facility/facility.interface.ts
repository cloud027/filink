import {Observable} from 'rxjs';

export interface FacilityInterface {
  /**
   * 设备监控信息监控状态
   */
  queryPerformData(body): Observable<Object>;

  /**
   * 分组列表
   */
  queryPerformData(body): Observable<Object>;

  /**
   * 向已有分组中添加设备设施
   */
  addToExistGroupInfo(body): Observable<Object>;

  /**
   * 新增分组信息
   */
  addGroupInfo(body): Observable<Object>;

  /**
   * 检测分组名
   */
  checkGroupInfoByName(id): Observable<Object>;

  /**
   * 根据设施id查询杆体示意图
   */
  getPoleInfoByDeviceId(body): Observable<Object>;

  /**
   * 根据设施id查询设施信息
   */
  queryDeviceInfo(body): Observable<Object>;

  /**
   * 批量获取设备详细信息
   */
  queryEquipmentInfoList(body): Observable<Object>;
}
