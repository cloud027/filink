import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  ADD_SECURITY_STRATEGY,
  ADJUST_VOLUME_AND_BRIGHTNESS,
  ALARM_LEVEL_LIST,
  APPLY_STATISTICS,
  CAMERA_LOGOUT,
  CHECK_STRATEGY_NAME_EXIST,
  CHECK_USERS,
  CLOUD_CONTROL,
  DELETE_CHANNEL,
  CONTROL_EQUIPMENT_COUNT,
  DELETE_INFO_STRATEGY,
  DELETE_LINKAGE_STRATEGY,
  DISTRIBUTE_LIGHT,
  DISTRIBUTE_BROADCAST,
  DISTRIBUTE_LINKAGE,
  DISTRIBUTE_RELEASE,
  ELECT_CONS_STATISTICS,
  EQUIPMENT_LIST_PAGE,
  EQUIPMENT_STATUS,
  GROUP_CONTROL,
  GROUP_LIST_PAGE,
  GROUP_EQUIPMENT_LIST_PAGE,
  INSTRUCT_DISTRIBUTE,
  LIGHTING_ENABLE_DISABLE,
  LIGHTING_MODIFY_STRATEGY,
  LIGHTING_POLICY_ADD,
  LIGHTING_POLICY_EDIT,
  LIGHTING_POLICY_LIST,
  LIGHTING_RATE_STATISTICS,
  LINKAGE_ADD,
  LINKAGE_DETAILS,
  LINKAGE_EDIT,
  LOOP_LIST_PAGE,
  PRESET_LIST_GET,
  PROGRAM_NAME_REPEAT,
  PROGRAM_STATUS,
  QUERY_CHANNEL_LIST_BY_ID,
  RELEASE_CONTENT_LIST_DELETE,
  RELEASE_CONTENT_LIST_GET,
  RELEASE_CONTENT_STATE_UPDATE,
  RELEASE_POLICY_ADD,
  RELEASE_POLICY_DETAILS,
  RELEASE_POLICY_EDIT,
  RELEASE_PROGRAM_ADD,
  RELEASE_PROGRAM_EDIT,
  RELEASE_PROGRAM_LOOK,
  RELEASE_PROGRAM_LOOKS,
  RELEASE_PROGRAMME_WORK_LIST_GET,
  RELEASE_WORK_ORDER,
  RELEASE_WORK_ORDER_DETAIL,
  RELEASE_WORK_PROGRAM_ADD,
  BROADCAST_POLICY_ADD,
  BROADCAST_POLICY_EDIT,
  BROADCAST_POLICY_DETAILS,
  SECURITY_CONFIGURATION_GET,
  SECURITY_CONFIGURATION_SAVE,
  SECURITY_CONNECTION_CAMERA_GET,
  SECURITY_PASSAGEWAY_LIST_GET,
  SECURITY_POLICY_DETAILS,
  STATISTICS_ALARM_LEVEL,
  STATISTICS_ALARM_LEVEL_TYPE,
  STATISTICS_OF_DEVICE_PLAYBACK_TIME,
  STATISTICS_OF_NUMBER_OF_EQUIPMENT_PROGRAMS_LAUNCHED,
  STATISTICS_OF_WORK_ORDER_INCREMENT,
  STRATEGY_INSTRUCT_DISTRIBUTE,
  UPLOAD_SSL_FILE,
  UPDATE_CHANNEL_STATUS,
  QUERY_EQUIPMENT_DATA_LIST,
  SAVE_CHANNEL,
  EXPORT_PROGRAM_DATA,
  EXPORT_WORK_ORDER_DATA,
  UPDATE_CHANNEL,
  DELETE_FILE,
  EXPORT_STRATEGY_LIST,
  ALARM_LEVEL_LIST_NAME,
  LIST_EQUIPMENT_INFO_FOR_MAP,
  STATISTICS_ALARM_LEVEL_EQUIPMENT,
  EQUIPMENT_OPERATION,
  DELETE_STRATEGY,
  CURRENT_PLAY_PROGRAM,
  LIST_SAME_POSITION_EQUIPMENT_INFO_FOR_MAP,
  QUERY_LIGHT_NUMBER_BY_ID,
  QUERY_EQUIPMENT_STRATEGY,
  QUERY_EQUIPMENT_LOCKLIST,
  QUERY_EQUIPMENT_LOCKOFLIST,
  ADD_UNIFY_AUTH,
  AUDING_TEMP_AUTH_BY_ID,
  AUDING_TEMP_AUTH_BY_IDS,
  BATCH_MODIFY_UNIFY_AUTH_STATUS,
  DELETE_TEMP_AUTH_BY_ID,
  DELETE_TEMP_AUTH_BY_IDS,
  DELETE_UNIFY_AUTH_BY_ID,
  DELETE_UNIFY_AUTH_BY_IDS,
  GET_DEVICE_BY_IDS,
  MODIFY_UNIFY_AUTH,
  QUERY_AUTH_BY_NAME,
  QUERY_TEMP_AUTH_BY_ID,
  QUERY_TEMP_AUTH_LIST,
  QUERY_UNIFY_AUTH_BY_ID,
  QUERY_UNIFY_AUTH_LIST, ENABLED_POLICY, CHECK_EQUIPMENT_POLICY,
  ADD_COLLECT_EQUIPMENTS,
  ADD_COLLECT_DEVICES,
  QUERY_REPORT_ANALYSIS, EXPORT_REPORT_ANALYSIS,
  NEW_EQUIPMENT_LIST_PAGE,
  EQUIPMENT_MAP_LIST_BY_STRATEGY,
  EQUIPMENT_LIST_BY_STRATEGY,
  monitorQueryListDataURL,
  monitorQueryInfoDataURL,
  monitorStatisticsDataByTimeURL,
  monitorWorkInsertURL,
  checkGroupInfoByNameURL,
  addGroupInfoURL,
  moveOutGroupByIdURL,
  addCollectingEquipmentByIdsURL,
  addCollectingDeviceByIdsURL,
  QUERY_HISTORY_LIST,
  STATISTICS_OF_BROADCAST_EQUIPMENT_PROGRAMS_LAUNCHED,
  STATISTICS_OF_BROADCAST_PLAYBACK_TIME,
  STATISTICS_OF_BROADCAST_WORK_ORDER_INCREMENT,
  QUERY_SOUND_RECORD_LIST,
  QUERY_SOUND_RECORD_EQUIPMENT_LIST,
  DELETE_SOUND_RECORD,
  BATCH_SEND_BROADCAST,
  QUERY_BROADCAST_VOLUME_BY_ID,
  BATCH_DOWNLOAD_RECORDS,
  EXPORT_RECORD_LIST,
  QUERY_CALL_DEVICE,
  OPERATE_CALL_DEVICE,
  OPERATE_DEVICE_LIST,
  QUERY_CALL_STATUS, WORKBENCH_QUERY_LIGHT, GET_ALL_SCREEN_SIZE,
} from '../const/application-url.const';
import {ApplicationInterface} from './application.interface';
import {DistributeModel} from '../model/distribute.model';
import {EnableOrDisableModel, PolicyControlModel, ProgramListModel, StrategyListModel} from '../model/policy.control.model';
import {GroupListModel} from '../model/equipment.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ContentEnableModel, ContentListModel} from '../model/content.list.model';
import {ContentExamineModel} from '../model/content.examine.model';
import {EquipmentCountListModel} from '../model/lighting.model';
import {PassagewayModel} from '../model/passageway.model';
import {LoopListModel} from '../../../../core-module/model/loop/loop-list.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {EquipmentFormModel} from '../../../../core-module/model/work-order/equipment-form.model';
import {EquipmentIdsMapRequestModel} from '../model/equipment-ids-map-request.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {AuditingModal, AuthorityModel} from '../model/authority.model';
import {CheckEquipmentParamModel} from '../../../../core-module/model/application-system/check-equipment-param.model';
import {DEVICE_SERVER} from '../../../../core-module/api-service/api-common.config';

@Injectable()
export class ApplicationService implements ApplicationInterface {
  constructor(
    private $http: HttpClient
  ) {
  }

  /**
   * 获取策略控制列表
   * @ param body
   */
  getLightingPolicyList(queryCondition: QueryConditionModel): Observable<ResultModel<PolicyControlModel[]>> {
    return this.$http.post <ResultModel<PolicyControlModel[]>>(`${LIGHTING_POLICY_LIST}`, queryCondition);
  }

  /**
   * 告警列表
   * @ param body
   */
  getAlarmLevelList(queryCondition: QueryConditionModel): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${ALARM_LEVEL_LIST}`, queryCondition);
  }

  /**
   * 告警列表
   * @ param body
   */
  queryAlarmNamePage(queryCondition: QueryConditionModel): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${ALARM_LEVEL_LIST_NAME}`, queryCondition);
  }

  /**
   * 根据设备ID 查询当前设备播放的节目信息
   * @ param id
   */
  queryEquipmentCurrentPlayProgram(id: string): Observable<Object> {
    return this.$http.get(`${CURRENT_PLAY_PROGRAM}/${id}`);
  }

  /**
   * 告警统计
   * @ param body
   */
  getStatisticsAlarmLevel(): Observable<Object> {
    return this.$http.get(`${STATISTICS_ALARM_LEVEL}`);
  }

  /**
   * 告警设备统计
   * @ param body
   */
  getStatisticsEquipmentAlarmLevel(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_ALARM_LEVEL_EQUIPMENT}`, body);
  }

  /**
   * 策略编辑
   * @ param body
   */
  modifyLightStrategy(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LIGHTING_MODIFY_STRATEGY}`, params);
  }

  /**
   * 信息发布策略编辑
   * @ param body
   */
  modifyReleaseStrategy(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${RELEASE_POLICY_EDIT}`, params);
  }

  /**
   * 广播发布策略编辑
   * @ param body
   */
  modifyBroadcastStrategy(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${BROADCAST_POLICY_EDIT}`, params);
  }

  /**
   * 设备列表
   */
  equipmentListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(`${EQUIPMENT_LIST_PAGE}`, queryCondition);
  }

  /**
   * new设备列表
   */
  newEquipmentListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(`${NEW_EQUIPMENT_LIST_PAGE}`, queryCondition);
  }

  /**
   * 根据策略id查询设备列表
   */
  equipmentListByStrategy(queryCondition: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(`${EQUIPMENT_LIST_BY_STRATEGY}`, queryCondition);
  }

  /**
   * 设备指令
   */
  instructDistribute(body: DistributeModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${INSTRUCT_DISTRIBUTE}`, body);
  }

  /**
   * 控制设备详情里面的按钮
   * @ param body
   */
  getOperation(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${EQUIPMENT_OPERATION}`, body);
  }

  /**
   * 工作台亮度调整
   */
  strategyInstructDistribute(body: DistributeModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${STRATEGY_INSTRUCT_DISTRIBUTE}`, body);
  }

  /**
   * 分组指令
   */
  groupControl(body: DistributeModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${GROUP_CONTROL}`, body);
  }

  /**
   * 设备状态统计
   * @ param body
   */
  queryEquipmentStatus(body) {
    return this.$http.post(`${EQUIPMENT_STATUS}`, body);
  }

  /**
   * 分组列表
   * @ param body
   */
  queryGroupInfoList(queryCondition: QueryConditionModel): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(`${GROUP_LIST_PAGE}`, queryCondition);
  }

  /**
   *  查询设备分组
   * @ param queryCondition
   */
  queryEquipmentGroupInfoList(queryCondition: QueryConditionModel): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(`${GROUP_EQUIPMENT_LIST_PAGE}`, queryCondition);
  }


  /**
   * 回路列表
   * @ param body
   */
  loopListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<LoopListModel[]>> {
    return this.$http.post<ResultModel<LoopListModel[]>>(`${LOOP_LIST_PAGE}`, queryCondition);
  }

  /**
   * 照明策略下发
   * @ param body
   */
  distributeLightStrategy(body: Array<{ strategyId: string, strategyType: string | object[] }>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DISTRIBUTE_LIGHT}`, body);
  }

  /**
   * 信息发布策略下发
   * @ param body
   */
  distributeInfoStrategy(body: Array<{ strategyId: string, strategyType: string | object[] }>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DISTRIBUTE_RELEASE}`, body);
  }

  /**
   * 广播发布策略下发
   * @ param body
   */
  distributeBroadcastStrategy(
    body: Array<{ strategyId: string; strategyType: string | object[] }>,
  ): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DISTRIBUTE_BROADCAST}`, body);
  }

  /**
   * 联动策略下发
   * @ param body
   */
  distributeLinkageStrategy(body: { strategyId: string, strategyType: string | object[] }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DISTRIBUTE_LINKAGE}`, body);
  }

  /**
   * 策略导出
   * @ param body
   */
  exportStrategyList(body): Observable<Object> {
    return this.$http.post(`${EXPORT_STRATEGY_LIST}`, body);
  }

  /**
   * 新增联动策略
   * @ param body
   */
  addLinkageStrategy(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LINKAGE_ADD}`, params);
  }

  /**
   * 编辑联动策略
   * @ param body
   */
  modifyLinkageStrategy(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LINKAGE_EDIT}`, params);
  }

  /**
   * 信息发布获取内容列表
   * @ param body
   */
  getReleaseContentList(queryCondition: QueryConditionModel): Observable<ResultModel<ProgramListModel[]>> {
    return this.$http.post<ResultModel<ProgramListModel[]>>(`${RELEASE_CONTENT_LIST_GET}`, queryCondition);
  }

  /**
   * 亮灯率统计
   * @ param body
   */
  getLightingRateStatisticsData(body): Observable<Object> {
    return this.$http.post(`${LIGHTING_RATE_STATISTICS}`, body);
  }

  /**
   * 用电量统计
   * @ param body
   */
  getElectConsStatisticsData(body): Observable<Object> {
    return this.$http.post(`${ELECT_CONS_STATISTICS}`, body);
  }

  /**
   * 工单增量统计
   * @ param body
   */
  findApplyStatisticsByCondition(body): Observable<Object> {
    return this.$http.post(`${APPLY_STATISTICS}`, body);
  }

  /**
   * 信息发布删除列表
   * @ param body
   */
  deleteReleaseContentList(body: { programIdList: Array<string> }): Observable<ResultModel<ContentListModel[]>> {
    return this.$http.post<ResultModel<ContentListModel[]>>(`${RELEASE_CONTENT_LIST_DELETE}`, body);
  }

  /**
   * 策略启用禁用
   * @ param body
   */
  enableOrDisableStrategy(body: EnableOrDisableModel[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LIGHTING_ENABLE_DISABLE}`, body);
  }

  /**
   * 信息发布更新列表状态
   * @ param body
   */
  updateReleaseContentState(body: ContentEnableModel[]): Observable<ResultModel<ContentListModel[]>> {
    return this.$http.post<ResultModel<ContentListModel[]>>(`${RELEASE_CONTENT_STATE_UPDATE}`, body);
  }

  /**
   * 策略详情
   * @ param id
   */
  getLightingPolicyDetails(id: string): Observable<ResultModel<StrategyListModel>> {
    return this.$http.get<ResultModel<StrategyListModel>>(`${LIGHTING_POLICY_EDIT}/${id}`);
  }

  /**
   * 策略详情
   * @ param id
   */
  checkStrategyNameExist(body: { strategyId: string, strategyName: string }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${CHECK_STRATEGY_NAME_EXIST}`, body);
  }

  /**
   * 联动详情
   * @ param id
   */
  getLinkageDetails(id: string): Observable<ResultModel<StrategyListModel>> {
    return this.$http.get<ResultModel<StrategyListModel>>(`${LINKAGE_DETAILS}/${id}`);
  }

  /**
   * 安防策略详情
   * @ param id
   */
  getSecurityPolicyDetails(id: string): Observable<ResultModel<StrategyListModel>> {
    return this.$http.get<ResultModel<StrategyListModel>>(`${SECURITY_POLICY_DETAILS}/${id}`);
  }

  /**
   * 信息发布
   * @ param id
   */
  getReleasePolicyDetails(id: string): Observable<ResultModel<StrategyListModel>> {
    return this.$http.get<ResultModel<StrategyListModel>>(`${RELEASE_POLICY_DETAILS}/${id}`);
  }

  /**
   * 广播发布
   * @ param id
   */
  getBroadcastPolicyDetails(id: string): Observable<ResultModel<StrategyListModel>> {
    return this.$http.get<ResultModel<StrategyListModel>>(`${BROADCAST_POLICY_DETAILS}/${id}`);
  }

  /**
   * 安防策略新增
   * @ param body
   */
  securityPolicyAdd(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ADD_SECURITY_STRATEGY}`, params);
  }

  /**
   * 信息发布新增
   * @ param body
   */
  releasePolicyAdd(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${RELEASE_POLICY_ADD}`, params);
  }

  /**
   * 广播发布新增
   * @ param body
   */
  broadcastPolicyAdd(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${BROADCAST_POLICY_ADD}`, params);
  }

  /**
   * 信息发布编辑列表内容
   * @ param body
   */
  editReleaseProgram(body): Observable<Object> {
    return this.$http.post(`${RELEASE_PROGRAM_EDIT}`, body);
  }

  /**
   * 信息发布通过节目查看节目信息
   * @ param body
   */
  lookReleaseProgram(id: string): Observable<ResultModel<ContentListModel>> {
    return this.$http.get <ResultModel<ContentListModel>>(`${RELEASE_PROGRAM_LOOK}/${id}`);
  }

  /**
   * 查看节目信息
   * @ param body
   */
  lookReleaseProgramIds(body: Array<string>): Observable<ResultModel<ProgramListModel[]>> {
    return this.$http.post<ResultModel<ProgramListModel[]>>(`${RELEASE_PROGRAM_LOOKS}`, body);
  }

  /**
   * 信息新增节目信息
   * @ param body
   */
  addReleaseProgram(body): Observable<Object> {
    return this.$http.post(`${RELEASE_PROGRAM_ADD}`, body);
  }

  /**
   * 信息新增审核(发起审核)
   * @ param body
   */
  addReleaseWorkProgram(body): Observable<Object> {
    return this.$http.post(`${RELEASE_WORK_PROGRAM_ADD}`, body);
  }

  /**
   * 信息发布获取内容审核列表
   * @ param body
   */
  getReleaseProgramWorkList(queryCondition: QueryConditionModel): Observable<ResultModel<ContentExamineModel[]>> {
    return this.$http.post<ResultModel<ContentExamineModel[]>>(`${RELEASE_PROGRAMME_WORK_LIST_GET}`, queryCondition);
  }

  /**
   * 信息发布工单审核操作
   * @ param body
   */
  releaseWorkOrder(body): Observable<Object> {
    return this.$http.post(`${RELEASE_WORK_ORDER}`, body);
  }

  /**
   * 策略新增
   * @ param body
   */
  lightingPolicyAdd(body: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LIGHTING_POLICY_ADD}`, body);
  }

  /**
   * 删除策略
   * @ param body
   */
  deleteStrategy(body: Array<string>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_STRATEGY}`, body);
  }

  /**
   * 删除联动策略
   * @ param body
   */
  deleteLinkageStrategy(body: Array<string>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_LINKAGE_STRATEGY}`, body);
  }

  /**
   * 单控数量和集控数量
   * @ param body
   */
  getControlEquipmentCount(body): Observable<ResultModel<EquipmentCountListModel>> {
    return this.$http.post<ResultModel<EquipmentCountListModel>>(`${CONTROL_EQUIPMENT_COUNT}`, body);
  }

  /**
   * 删除信息发布策略
   * @ param body
   */
  deleteInfoStrategy(body: Array<string>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_INFO_STRATEGY}`, body);
  }

  /**
   * 信息发布通过审核查看审核信息
   * @ param body
   */
  lookReleaseWorkOrder(id): Observable<Object> {
    return this.$http.get(`${RELEASE_WORK_ORDER_DETAIL}/${id}`);
  }

  /**
   * 安防获取通道列表
   * @ param body
   */
  getSecurityPassagewayList(body): Observable<Object> {
    return this.$http.post(`${SECURITY_PASSAGEWAY_LIST_GET}`, body);
  }

  /**
   * 获取配置信息
   * @ param body
   */
  getSecurityConfiguration(id: string): Observable<Object> {
    return this.$http.get(`${SECURITY_CONFIGURATION_GET}/${id}`);
  }

  /**
   * 获取摄像头流地址
   * @ param body
   */
  getSecurityCamera(body): Observable<Object> {
    return this.$http.post(`${SECURITY_CONNECTION_CAMERA_GET}`, body);
  }

  /**
   * 新增/修改配置信息
   * @ param body
   */
  saveSecurityConfiguration(body): Observable<Object> {
    return this.$http.post(`${SECURITY_CONFIGURATION_SAVE}`, body);
  }

  /**
   * 新增通道列表
   * @ param body
   */
  saveChannel(body): Observable<Object> {
    return this.$http.post(`${SAVE_CHANNEL}`, body);
  }

  /**
   * 修改通道列表
   * @ param body
   */
  updateChannel(body): Observable<Object> {
    return this.$http.post(`${UPDATE_CHANNEL}`, body);
  }

  /**
   * 安防上传文件（基础配置专用）
   * @ param body
   */
  uploadSslFile(body): Observable<Object> {
    return this.$http.post(`${UPLOAD_SSL_FILE}`, body);
  }

  /**
   * 删除文件
   * @ param body
   */
  deleteSslFile(body): Observable<Object> {
    return this.$http.post(`${DELETE_FILE}`, body);
  }

  /**
   * 摄像头云台控制
   * @ param body
   */
  cloudControl(body): Observable<Object> {
    return this.$http.post(`${CLOUD_CONTROL}`, body);
  }

  /**
   * 获取预置位列表
   * @ param body
   */
  getPresetList(id): Observable<Object> {
    return this.$http.get(`${PRESET_LIST_GET}/${id}`);
  }

  /**
   * 摄像头流销毁
   * @ param body
   */
  cameraLogout(body): Observable<Object> {
    return this.$http.post(`${CAMERA_LOGOUT}`, body);
  }

  /**
   * 查看节目状态
   * @ param body
   */
  programStatus(body): Observable<Object> {
    return this.$http.post(`${PROGRAM_STATUS}`, body);
  }

  queryScreen() {
    return this.$http.post(`${GET_ALL_SCREEN_SIZE}`, {});
  }

  /**
   * 设备节目投放数量统计
   * @ param body
   */
  launchQuantityStatistics(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_OF_NUMBER_OF_EQUIPMENT_PROGRAMS_LAUNCHED}`, body);
  }

  /**
   * 设备播放时长统计
   * @ param body
   */
  durationStatistics(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_OF_DEVICE_PLAYBACK_TIME}`, body);
  }

  /**
   * 工单增量统计
   * @ param body
   */
  workOrderIncrementStatistics(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_OF_WORK_ORDER_INCREMENT}`, body);
  }

  /**
   * 调整音量/亮度
   * @ param body
   */
  adjustVolumeBrightness(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${ADJUST_VOLUME_AND_BRIGHTNESS}`, body);
  }

  /**
   * 获取审核人列表
   * 不需要参数
   */
  getCheckUsers(id?: string): Observable<Object> {
    if (id) {
      return this.$http.get(`${CHECK_USERS}/${id}`);
    } else {
      return this.$http.get(`${CHECK_USERS}/null`);
    }
  }

  /**
   * 告警级别统计
   * @ param body
   */
  statisticsAlarmLevelType(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_ALARM_LEVEL_TYPE}`, body);
  }

  /**
   * 通道列表删除
   * @ param body
   */
  deleteChannel(body): Observable<Object> {
    return this.$http.post(`${DELETE_CHANNEL}`, body);
  }

  /**
   * 根据通道ID查询通道数据
   * @ param body
   */
  getChannelData(id: string): Observable<ResultModel<PassagewayModel>> {
    return this.$http.get<ResultModel<PassagewayModel>>(`${QUERY_CHANNEL_LIST_BY_ID}/${id}`);
  }

  /**
   * 节目名称唯一校验
   * @ param body
   */
  programNameRepeat(body): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${PROGRAM_NAME_REPEAT}`, body);
  }

  /**
   * 通道列表修改状态
   * @ param body
   */
  updateChannelStatus(body): Observable<Object> {
    return this.$http.post(`${UPDATE_CHANNEL_STATUS}`, body);
  }

  /**
   * 设备列表不带分页
   * @ param body
   */
  queryEquipmentDataList(body): Observable<ResultModel<EquipmentFormModel[]>> {
    return this.$http.post<ResultModel<EquipmentFormModel[]>>(`${QUERY_EQUIPMENT_DATA_LIST}`, body);
  }

  /**
   * 导出节目接口
   */
  public exportProgramData(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EXPORT_PROGRAM_DATA, body);
  }

  /**
   * 导出工单接口
   */
  public exportWorkOrderData(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EXPORT_WORK_ORDER_DATA, body);
  }

  /**
   * 根据设备id 回路id 分组id 查询设备点在地图上的位置
   * param body
   */
  queryListEquipmentInfoForMap(body: EquipmentIdsMapRequestModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(`${LIST_EQUIPMENT_INFO_FOR_MAP}`, body);
  }

  /**
   * 根据设备id 回路id 分组id 查询设备点在地图上的位置
   * param body
   */
  equipmentMapListByStrategy(strategyId: string): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.get<ResultModel<EquipmentListModel[]>>(`${EQUIPMENT_MAP_LIST_BY_STRATEGY}/${strategyId}`);
  }

  /**
   * 根据设备id 回路id 分组id 查询设备点在地图上的位置(同一个点上有多个设备的情况)
   * @param body 设备
   */
  queryListSamePositionEquipmentInfoForMap(body: EquipmentIdsMapRequestModel): Observable<ResultModel<Array<EquipmentListModel[]>>> {
    return this.$http.post<ResultModel<Array<EquipmentListModel[]>>>(`${LIST_SAME_POSITION_EQUIPMENT_INFO_FOR_MAP}`, body);
  }

  /**
   * 根据设备id 查询亮度
   * param body
   */
  queryLightNumberByGroupId(body) {
    return this.$http.post(`${QUERY_LIGHT_NUMBER_BY_ID}`, body);
  }

  /**
   * 统一授权
   * 查询统一授权列表
   * * @param body
   */
  public queryUnifyAuthList(body: QueryConditionModel): Observable<ResultModel<{ data: AuthorityModel[] }>> {
    return this.$http.post<ResultModel<{ data: AuthorityModel[] }>>(`${QUERY_UNIFY_AUTH_LIST}`, body);
  }

  /**
   * 新增统一授权
   * * @param body
   */
  public addUnifyAuth(body: AuthorityModel): Observable<ResultModel<object>> {
    return this.$http.post<ResultModel<object>>(`${ADD_UNIFY_AUTH}`, body);
  }

  /**
   * 根据id查询统一授权
   * @param body 授权id
   */
  public queryUnifyAuthById(body: string): Observable<ResultModel<AuthorityModel>> {
    return this.$http.get<ResultModel<AuthorityModel>>(`${QUERY_UNIFY_AUTH_BY_ID}/${body}`);
  }


  /**
   * 修改统一授权
   * @param body 授权任务信息
   */
  public modifyUnifyAuth(body: AuthorityModel): Observable<ResultModel<object>> {
    return this.$http.post<ResultModel<object>>(`${MODIFY_UNIFY_AUTH}`, body);
  }

  /**
   * 删除授权
   * @param body 单个授权任务id
   */
  public deleteUnifyAuthById(body: string): Observable<ResultModel<object>> {
    return this.$http.post<ResultModel<object>>(`${DELETE_UNIFY_AUTH_BY_ID}/${body}`, null);
  }

  /**
   * 批量删除授权
   * @param body 授权id集合
   */
  public deleteUnifyAuthByIds(body: string[]): Observable<Object> {
    return this.$http.post(`${DELETE_UNIFY_AUTH_BY_IDS}`, body);
  }

  /**
   * 启用/禁用
   * @param body 权限
   */
  public batchModifyUnifyAuthStatus(body): Observable<Object> {
    return this.$http.post(`${BATCH_MODIFY_UNIFY_AUTH_STATUS}`, body);
  }


  /**
   * 临时授权
   * 查询临时授权列表
   * @param body 查询条件
   */
  public queryTempAuthList(body: QueryConditionModel): Observable<ResultModel<{ data: AuthorityModel[] }>> {
    return this.$http.post<ResultModel<{ data: AuthorityModel[] }>>(`${QUERY_TEMP_AUTH_LIST}`, body);
  }

  /**
   * 根据授权id查询临时授权
   * @param id 授权id
   */
  public queryTempAuthById(id: string): Observable<ResultModel<AuthorityModel>> {
    return this.$http.get<ResultModel<AuthorityModel>>(`${QUERY_TEMP_AUTH_BY_ID}/${id}`);
  }

  /**
   * 单个审核
   * @param body 授权id
   */
  public audingTempAuthById(body: AuditingModal): Observable<ResultModel<object>> {
    return this.$http.post<ResultModel<object>>(`${AUDING_TEMP_AUTH_BY_ID}`, body);
  }

  /**
   * 批量审核
   * @param body 授权id
   */
  public audingTempAuthByIds(body: AuditingModal): Observable<ResultModel<object>> {
    return this.$http.post<ResultModel<object>>(`${AUDING_TEMP_AUTH_BY_IDS}`, body);
  }

  /**
   * 删除临时授权
   * @param id 授权id
   */
  public deleteTempAuthById(id: string): Observable<Object> {
    return this.$http.get(`${DELETE_TEMP_AUTH_BY_ID}/${id}`);
  }

  /**
   * 批量删除
   * @param body 授权id
   */
  public deleteTempAuthByIds(body): Observable<Object> {
    return this.$http.post(`${DELETE_TEMP_AUTH_BY_IDS}`, body);
  }

  /**
   * 根据设施ids查询设备信息
   * @param body 设施ids
   */
  getDeviceByIds(body: string[]): Observable<Object> {
    return this.$http.post(`${GET_DEVICE_BY_IDS}`, body);
  }

  /**
   * 根据名字查询授权
   * @param body 授权任务名称
   */
  public queryAuthByName(body): Observable<Object> {
    return this.$http.post(`${QUERY_AUTH_BY_NAME}`, body);
  }

  /**
   * 查询设备当前是否有播放策略
   * @param equipmentId 设备id
   */
  queryEquipmentCurrentPlayStrategy(equipmentId): Observable<Object> {
    return this.$http.get(`${QUERY_EQUIPMENT_STRATEGY}/${equipmentId}`);
  }

  /**
   * 查询锁设施列表
   */
  public deviceListOfLockByPage(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(QUERY_EQUIPMENT_LOCKLIST, body);
  }

  /**
   * 设施列表请求
   */
  public deviceListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${QUERY_EQUIPMENT_LOCKOFLIST}`, queryCondition);
  }

  /**
   * 启用时检查模式
   */
  checkEnable(body: CheckEquipmentParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ENABLED_POLICY, body);
  }

  /**
   * 新增策略时检查设备的模式提示
   */
  checkEquipmentOnAdd(body: CheckEquipmentParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(CHECK_EQUIPMENT_POLICY, body);
  }

  addCollectingEquipmentByIds(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ADD_COLLECT_EQUIPMENTS, body);
  }

  addCollectingDeviceByIds(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ADD_COLLECT_DEVICES, body);
  }

  /**
   * 查询智慧照明报表分析数据
   * @param body 查询条件
   */
  queryReportAnalysisData(body) {
    return this.$http.post(QUERY_REPORT_ANALYSIS, body);
  }

  // 报表导出
  reportAnalysisExport(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EXPORT_REPORT_ANALYSIS, body);
  }

  /**
   * 照明工作台查询用电量的接口
   */
  workBenchQueryElectricityConsumption(body) {
    return this.$http.post<ResultModel<any>>(WORKBENCH_QUERY_LIGHT, body);
  }

  /**
   * 获取审核工单历史流程
   * param body
   */
  queryHistoryList(body) {
    return this.$http.post(`${QUERY_HISTORY_LIST}`, body);
  }

  /**
   * 广播节目投放数量统计
   * @ param body
   */
  getBroadcastProgramStatisticsData(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_OF_BROADCAST_EQUIPMENT_PROGRAMS_LAUNCHED}`, body);
  }

  /**
   * 广播播放时长统计
   * @ param body
   */
  durationBroadcastStatistics(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_OF_BROADCAST_PLAYBACK_TIME}`, body);
  }

  /**
   * 广播工单增量统计
   * @ param body
   */
  workOrderBroadcastIncrementStatistics(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_OF_BROADCAST_WORK_ORDER_INCREMENT}`, body);
  }

  querySoundRecordList(body): Observable<Object> {
    return this.$http.post(`${QUERY_SOUND_RECORD_LIST}`, body);
  }

  querySoundRecordEquipmentList(body): Observable<Object> {
    return this.$http.post(`${QUERY_SOUND_RECORD_EQUIPMENT_LIST}`, body);
  }

  deleteSoundRecord(body): Observable<Object> {
    return this.$http.post(`${DELETE_SOUND_RECORD}`, body);
  }

  instructBroadcastDistribute(body): Observable<Object> {
    return this.$http.post(`${BATCH_SEND_BROADCAST}`, body);
  }

  queryBroadcastVolumeById(body): Observable<Object> {
    return this.$http.post(`${QUERY_BROADCAST_VOLUME_BY_ID}`, body);
  }

  batchDownLoadRecords(body): Observable<Object> {
    return this.$http.post(`${BATCH_DOWNLOAD_RECORDS}`, body);
  }

  /**
   * 导出历史录音接口
   */
  exportRecordList(body): Observable<Object> {
    return this.$http.post(`${EXPORT_RECORD_LIST}`, body);
  }

  // 一键呼叫
  /**
   * 查询一键呼叫设备
   * @ param body
   */
  callingEquipmentsByPage(body): Observable<Object> {
    return this.$http.post(`${QUERY_CALL_DEVICE}`, body);
  }

  /**
   * 操作一键呼叫设备
   * @ param body
   */
  callingEquipmentinstructDistribute(body): Observable<Object> {
    return this.$http.post(`${OPERATE_CALL_DEVICE}`, body);
  }

  // 设备名称模糊查询
  queryEquipmentByName(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(
      `${DEVICE_SERVER}/equipmentInfo/queryEquipmentByName`,
      body,
    );
  }

  queryCallStatus(body): Observable<Object> {
    return this.$http.post(`${QUERY_CALL_STATUS}`, body);
  }

  /**
   * 查询设施
   * @ param body
   */
  querydeviceList(body): Observable<Object> {
    return this.$http.post(`${OPERATE_DEVICE_LIST}`, body);
  }

  // -----------------------------------环境监测--------------------------------------------------------
  /** 环境监测列表数据获取 */
  monitorQueryListData_API(body): Observable<Object> {
    return this.$http.post(`${monitorQueryListDataURL}`, body);
  }

  /** 环境监测基本信息：获取最近一次气象仪上报数据，展示在工作台中 */
  monitorQueryInfoData_API(body: { idList: string[] }): Observable<Object> {
    return this.$http.post(`${monitorQueryInfoDataURL}`, body);
  }

  /** 监测点数据  */
  monitorStatisticsDataByTime_API(body: {
    equipmentId: string
    startTime: number
  }): Observable<Object> {
    return this.$http.post(`${monitorStatisticsDataByTimeURL}`, body);
  }

  /** 环境监测工单增量统计 */
  monitorWorkInsert_API(body): Observable<Object> {
    return this.$http.post(`${monitorWorkInsertURL}`, body);
  }

  /** 校验分组名称是否重复 */
  checkGroupInfoByName_API(body: {
    groupName: string
    groupId: string
  }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${checkGroupInfoByNameURL}`, body);
  }

  /** 新增分组 */
  public addGroupInfo_API(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(addGroupInfoURL, body);
  }

  /** 移除分组 */
  public moveOutGroupById_API(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(moveOutGroupByIdURL, body);
  }

  /** 批量关注设备 */
  addCollectingEquipmentByIds_API(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(addCollectingEquipmentByIdsURL, body);
  }

  /** 批量关注设施 */
  addCollectingDeviceByIds_API(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(addCollectingDeviceByIdsURL, body);
  }

  // -----------------------------------环境监测--------------------------------------------------------
}
