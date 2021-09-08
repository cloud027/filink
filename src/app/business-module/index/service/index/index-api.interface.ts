import {Observable} from 'rxjs';

/**
 * 首页服务接口
 */
export interface IndexApiInterface {
  /**
   * 查询首页全部区域
   * returns {Observable<Object>}
   */
  areaListByPage(body): Observable<Object>;
  /**
   * 获取设施列表
   * returns {Observable<Object>}
   */
  queryDeviceList(body): Observable<Object>;

  /**
   * 查询设备列表
   * returns {Observable<Object>}
   */
  queryEquipmentList(body): Observable<Object>;

  /**
   * 查询设施详情
   * returns {Observable<Object>}
   */
  queryDeviceById(body): Observable<Object>;

  /**
   * 查询设备详情卡设备信息
   * returns {Observable<Object>}
   */
  queryHomeEquipmentInfoById(id): Observable<Object>;

  /**
   * 查询设施详情卡设备信息
   * returns {Observable<Object>}
   */
  queryEquipmentListByDeviceId(body): Observable<Object>;

  /**
   * 查询首页设施的区域点
   * returns {Observable<Object>}
   */
  queryDevicePolymerizationList(body): Observable<Object>;
  /**
   * 根据区域id查询区域下所有设施信息
   * returns {Observable<Object>}
   */
  queryDevicePolymerizations(body): Observable<Object>;

  /**
   * 获取分组信息
   * returns {Observable<Object>}
   */
  queryGroupInfoList(body): Observable<Object>;


  /**
   * 获取全量的区域数据，包括子集
   * returns {Observable<Object>}
   */
  listAreaByAreaCodeList(body): Observable<Object>;

  /**
   * 批量操作
   * returns {Observable<Object>}
   */
  instructDistribute(body): Observable<Object>;

  /**
   * 查询信息屏屏播放节目
   * returns {Observable<Object>}
   */
  queryProgramList(body): Observable<Object>;

  /**
   * 获取左侧列表规划树数据
   * returns {Observable<Object>}
   */
  getPlanNames(body): Observable<Object>;

  /**
   * 获取左侧列表项目树数据
   * returns {Observable<Object>}
   */
  getProjectNames(body): Observable<Object>;

  /**
   * 获取左侧列表智慧杆类型数据
   * returns {Observable<Object>}
   */
  getPoleModel(body): Observable<Object>;

  /**
   * 获取左侧规划列表数据
   * returns {Observable<Object>}
   */
  getPlanPoleList(body): Observable<Object>;

  /**
   * 获取左侧项目列表数据
   * returns {Observable<Object>}
   */
  getProjectPoleList(body): Observable<Object>;

  /**
   * 规划获取智慧杆型号
   * returns {Observable<Object>}
   */
  projectDtaGetPoleModel(body): Observable<Object>;

}

