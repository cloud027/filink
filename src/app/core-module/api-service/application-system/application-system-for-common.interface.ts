import {Observable} from 'rxjs';
import {EquipmentListModel} from '../../model/equipment/equipment-list.model';
import {ResultModel} from '../../../shared-module/model/result.model';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';

export interface ApplicationSystemForCommonInterface {
  /**
   * 分组控制指令下发
   * @ param body
   */
  groupControl(body): Observable<Object>;

  /**
   * instructDistribute
   * @ param body
   */
  instructDistribute(body): Observable<Object>;

  /**
   * 获取配置信息
   * @ param body
   */
  getSecurityConfiguration(body): Observable<Object>;

  /**
   * 获取预置位列表
   * @ param body
   */
  getPresetList(body): Observable<Object>;

  /**
   * 安防获取通道列表
   * @ param body
   */
  getSecurityPassagewayList(body): Observable<Object>;

  /**
   * 根据设备ID 查询当前设备播放的节目信息
   * @ param id
   */
  queryEquipmentCurrentPlayProgram(id: string): Observable<Object>;

  /**
   * 工单增量统计
   * @ param body
   */
  findApplyStatisticsByCondition(body): Observable<Object>;
  /**
   * 设备列表
   * @ param body
   */
  equipmentListByPage(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>>;
}
