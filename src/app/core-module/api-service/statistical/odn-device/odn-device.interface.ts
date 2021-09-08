import {Observable} from 'rxjs';

export interface OdnDeviceInterface {
  /**
   * 查询区域下的Odn设施
   */
  queryAreaOdnDevice(body): Observable<Object>;

  /**
   * Odn跳纤侧端口统计
   */
  jumpFiberPortStatistics(body): Observable<Object>;

  /**
   * Odn跳纤侧端口统计导出
   */
  exportJumpFiberPortStatistics(body): Observable<Object>;

  /**
   * 熔接侧端口统计
   */
  meltFiberPortStatistics(body): Observable<Object>;

  /**
   * 熔接侧端口统计导出
   */
  exportMeltFiberPortStatistics(body): Observable<Object>;

  /**
   * 盘统计
   */
  discPortStatistics(body): Observable<Object>;

  /**
   * 盘统计导出
   */
  exportDiscPortStatistics(body): Observable<Object>;

  /**
   * 框统计
   */
  framePortStatistics(body): Observable<Object>;

  /**
   * 框统计导出
   */
  exportFramePortStatistics(body): Observable<Object>;

  /**
   * 柜内跳接
   */
  inner(body): Observable<Object>;

  /**
   * 柜内跳接导出
   */
  exportJumpConnectionInCabinet(body): Observable<Object>;

  /**
   * 柜间跳接
   */
  outer(body): Observable<Object>;

  /**
   * 柜间跳接导出
   */
  exportJumpConnectionOutCabinet(body): Observable<Object>;

  /**
   * 查询设施框、盘信息
   */
  queryTemplateTop(id): Observable<Object>;

  /**
   * 光缆统计
   */
  opticalFiber(): Observable<Object>;

  /**
   * 光缆统计导出
   */
  exportOpticalFiber(body): Observable<Object>;

  /**
   * 光缆段统计
   */
  opticalFiberSection(body): Observable<Object>;

  /**
   * 光缆段统计导出
   */
  exportOpticalFiberSection(body): Observable<Object>;

  /**
   * 纤芯统计
   */
  coreStatistics(body): Observable<Object>;

  /**
   * 纤芯统计导出
   */
  exportCoreStatistics(body): Observable<Object>;
}


