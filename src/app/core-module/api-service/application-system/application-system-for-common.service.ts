import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationSystemForCommonInterface} from './application-system-for-common.interface';
import {InstructSendRequestModel} from '../../model/group/instruct-send-request.model';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../shared-module/model/result.model';
import {
  CLOUD_CONTROL,
  CURRENT_PLAY_PROGRAM,
  GROUP_CONTROL,
  PRESET_LIST_GET,
  SECURITY_CONFIGURATION_GET,
  SECURITY_PASSAGEWAY_LIST_GET,
  A_KEY_APPLY_STATISTICS,
  APPLY_STATISTICS, CHECK_POLICY, GET_INSTRUCTION_LIST, READ_INSTRUCTION, GET_INSTRUCTION_COUNT,
  QUERY_BROADCAST_VOLUME_BY_ID,
  EQUIPMENT_LIST_PAGE, GET_INSTRUCTION_LIST_100,
} from './application-system-request-url';
import {WorkOrderIncreaseModel} from '../../model/application-system/work-order-increase.model';
import {CheckEquipmentParamModel} from '../../model/application-system/check-equipment-param.model';
import {InstructionModel} from '../../model/instruction-model';
import {EquipmentListModel} from '../../model/equipment/equipment-list.model';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';

@Injectable()
export class ApplicationSystemForCommonService implements ApplicationSystemForCommonInterface {
  constructor(private $http: HttpClient) {
  }

  /**
   * 分组控制指令下发
   */
  public groupControl(body: InstructSendRequestModel<{}>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(GROUP_CONTROL, body);
  }

  /**
   * 指令控制
   * @ param body
   */
  public instructDistribute(body): Observable<Object> {
    return this.$http.post(`${CLOUD_CONTROL}`, body);
  }

  /**
   * 获取配置信息
   * @ param body
   */
  getSecurityConfiguration(id: string): Observable<Object> {
    return this.$http.get(`${SECURITY_CONFIGURATION_GET}/${id}`);
  }

  /**
   * 获取预置位列表
   * @ param body
   */
  getPresetList(id): Observable<Object> {
    return this.$http.get(`${PRESET_LIST_GET}/${id}`);
  }

  /**
   * 安防获取通道列表
   * @ param body
   */
  getSecurityPassagewayList(body): Observable<Object> {
    return this.$http.post(`${SECURITY_PASSAGEWAY_LIST_GET}`, body);
  }

  /**
   * 根据设备ID 查询当前设备播放的节目信息
   * @ param id
   */
  queryEquipmentCurrentPlayProgram(id: string): Observable<Object> {
    return this.$http.get(`${CURRENT_PLAY_PROGRAM}/${id}`);
  }

  /**
   * 工单增量统计
   * @ param body
   */
  findApplyStatisticsByCondition(body): Observable<ResultModel<WorkOrderIncreaseModel[]>> {
    return this.$http.post<ResultModel<WorkOrderIncreaseModel[]>>(`${APPLY_STATISTICS}`, body);
  }

  /**
   * 工单增量统计
   * @ param body
   */
  findApplyAKeyToCallStatisticsByCondition(body): Observable<ResultModel<WorkOrderIncreaseModel[]>> {
    return this.$http.post<ResultModel<WorkOrderIncreaseModel[]>>(`${A_KEY_APPLY_STATISTICS}`, body);
  }

  /**
   * 设备配置切换设备模式时检查设备的模式提示
   */
  checkEquipmentModel(body: CheckEquipmentParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(CHECK_POLICY, body);
  }

  /**
   * 获取指令通知列表
   */
  getInstructionNoticeList(body): Observable<ResultModel<InstructionModel[]>> {
    return this.$http.post<ResultModel<InstructionModel[]>>(GET_INSTRUCTION_LIST, body);
  }

  /**
   * 获取指令通知列表
   */
  getTop100InstructResultList(body): Observable<ResultModel<InstructionModel[]>> {
    return this.$http.post<ResultModel<InstructionModel[]>>( GET_INSTRUCTION_LIST_100, body);
  }

  /**
   * 阅读指令
   * @param body 指令
   */
  onReadInstruction(body): Observable<ResultModel<InstructionModel[]>> {
    return this.$http.post<ResultModel<InstructionModel[]>>(READ_INSTRUCTION, body);
  }

  /**
   * 获取未读数量
   */
  getInstructionNoReadCount(): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(GET_INSTRUCTION_COUNT);
  }
  queryBroadcastVolumeById(body): Observable<Object> {
    return this.$http.post(`${QUERY_BROADCAST_VOLUME_BY_ID}`, body);
  }
  /**
   * 设备列表
   */
  equipmentListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(`${EQUIPMENT_LIST_PAGE}`, queryCondition);
  }
}
