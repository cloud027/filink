import {Observable} from 'rxjs';

export interface DeviceStatisticalInterface {
  /**
   * 查询设施数量统计
   */
  queryDeviceNumber(body): Observable<Object>;

  /**
   * 查询设施状态统计
   */

  queryDeviceStatus(body): Observable<Object>;

  /**
   * 查询设施部署状态统计
   */
  queryDeviceDeployStatus(body): Observable<Object>;

  /**
   * 设施传感值统计
   */
  queryDeviceSensor(body): Observable<Object>;

  /**
   * 设备传感值统计
   * param body
   */
  queryEquipmentSensor(body): Observable<Object>;

  /**
   * 设施数量导出
   */
  exportDeviceCount(body): Observable<Object>;

  /**
   * 设施状态导出
   */
  exportDeviceStatusCount(body): Observable<Object>;

  /**
   * 设施部署状态导出
   */
  exportDeployStatusCount(body): Observable<Object>;

  // todo 缺设施状态和部署状态导出
}


