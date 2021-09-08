import {Observable} from 'rxjs';
import {LockModel} from '../../model/facility/lock.model';
import {ResultModel} from '../../../shared-module/model/result.model';
import {ControlModel} from '../../model/facility/control.model';
import {CommonInstructModel} from '../../model/application-system/common-instruct.model';

export interface LockInterface {
  /**
   * 查询电子锁主控信息
   * param id
   * returns {Observable<Object>}
   */
  getLockControlInfo(id: string): Observable<ResultModel<Array<ControlModel>>>;

  /**
   * 查询设备电子锁主控信息
   * param id
   * returns {Observable<Object>}
   */
  getLockControlInfoForEquipment(id: string): Observable<ResultModel<Array<ControlModel>>>;

  /**
   * 查询电子锁信息
   * param id
   * returns {Observable<ResultModel<Array<LockModel>>>}
   */
  getLockInfo(id: string): Observable<ResultModel<Array<LockModel>>>;

  /**
   * 查询设备电子锁信息
   * param id
   * returns {Observable<ResultModel<Array<LockModel>>>}
   */
  getLockInfoForEquipment(id: string): Observable<ResultModel<LockModel[]>>;

  /**
   * 获取主控配置
   * param body
   * returns {Observable<Object>}
   */
  getPramsConfig(body): Observable<Object>;

  /**
   * 设置主控配置
   * param body
   * returns {Observable<Object>}
   */
  setControl(body): Observable<Object>;

  /**
   * 远程开锁
   * param body
   * returns {Observable<ResultModel<string>>}
   */
  openLock(body: { deviceId: string, doorNumList: string[] }): Observable<ResultModel<string>>;

  /**
   * 设备开锁（指令下发）
   * param body
   */
  instructDistribute(body: CommonInstructModel): Observable<ResultModel<string>>;

  /**
   * 更新设施状态
   * returns {Observable<Object>}
   */
  updateDeviceStatus(body): Observable<Object>;

  /**
   * 查询单个设施一段时间内的开锁次数
   * param body
   * returns {Observable<Object>}
   */
  queryUnlockingTimesByDeviceId(body): Observable<Object>;

  /**
   * 删除主控
   * param body
   * returns {Observable<Object>}
   */
  deleteLockAndControlById(body): Observable<Object>;
}
