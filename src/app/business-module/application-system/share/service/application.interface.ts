import {Observable} from 'rxjs';
import {DistributeModel} from '../model/distribute.model';
import {EnableOrDisableModel, PolicyControlModel, ProgramListModel, StrategyListModel} from '../model/policy.control.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AlarmModel} from '../model/alarm.model';
import {EquipmentCountListModel} from '../model/lighting.model';
import {ContentEnableModel, ContentListModel} from '../model/content.list.model';
import {GroupListModel} from '../model/equipment.model';
import {LoopListModel} from '../../../../core-module/model/loop/loop-list.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {CheckEquipmentParamModel} from '../../../../core-module/model/application-system/check-equipment-param.model';

export interface ApplicationInterface {
  /**
   * 获取策略控制列表
   * @ param body
   */
  getLightingPolicyList(body: QueryConditionModel): Observable<ResultModel<PolicyControlModel[]>>;

  /**
   * 设备指令
   */
  instructDistribute(body: DistributeModel): Observable<ResultModel<string>>;

  /**
   * 控制设备详情里面的按钮
   */
  getOperation(body): Observable<ResultModel<string>>;

  /**
   * 工作台亮度调整
   */
  strategyInstructDistribute(body: DistributeModel): Observable<ResultModel<string>>;

  /**
   * 分组指令
   */
  groupControl(body: DistributeModel): Observable<ResultModel<string>>;

  /**
   * 告警列表
   * @ param body
   */
  getAlarmLevelList(body: QueryConditionModel): Observable<ResultModel<AlarmModel[]>>;

  /**
   * 告警名称
   * @ param body
   */
  queryAlarmNamePage(body: QueryConditionModel): Observable<ResultModel<AlarmModel[]>>;

  /**
   * 根据设备ID 查询当前设备播放的节目信息
   * @ param id
   */
  queryEquipmentCurrentPlayProgram(id: string): Observable<Object>;

  /**
   * 回路列表
   * @ param body
   */
  loopListByPage(body: QueryConditionModel): Observable<ResultModel<LoopListModel[]>>;

  /**
   * 设备状态统计
   * @ param body
   */
  queryEquipmentStatus(body): Observable<Object>;

  /**
   * 告警统计
   * @ param body
   */
  getStatisticsAlarmLevel(): Observable<Object>;

  /**
   * 告警设备统计
   * @ param body
   */
  getStatisticsEquipmentAlarmLevel(body): Observable<Object>;

  /**
   * 亮灯率统计
   * @ param body
   */
  getLightingRateStatisticsData(body): Observable<Object>;

  /**
   * 查看节目信息
   * @ param body
   */
  lookReleaseProgramIds(body: Array<string>): Observable<ResultModel<ProgramListModel[]>>;

  /**
   * 工单增量统计
   * @ param body
   */
  findApplyStatisticsByCondition(body): Observable<Object>;

  /**
   * 用电量统计
   * @ param body
   */
  getElectConsStatisticsData(body): Observable<Object>;

  /**
   * 策略新增
   * @ param body
   */
  lightingPolicyAdd(body: StrategyListModel): Observable<ResultModel<string>>;

  /**
   * 单控数量和集控数量
   * @ param body
   */
  getControlEquipmentCount(body): Observable<ResultModel<EquipmentCountListModel>>;


  /**
   * 删除联动策略
   * @ param body
   */
  deleteLinkageStrategy(body: Array<string>): Observable<ResultModel<string>>;

  /**
   * 删除信息发布策略
   * @ param body
   */
  deleteInfoStrategy(body: Array<string>): Observable<ResultModel<string>>;

  /**
   * 新增联动策略
   * @ param body
   */
  addLinkageStrategy(body: StrategyListModel): Observable<ResultModel<string>>;

  /**
   * 联动编辑策略
   * @ param body
   */
  modifyLinkageStrategy(body: StrategyListModel): Observable<ResultModel<string>>;

  /**
   * 安防策略新增
   * @ param body
   */
  securityPolicyAdd(body): Observable<Object>;

  /**
   * 策略启用禁用
   * @ param body
   */
  enableOrDisableStrategy(body: EnableOrDisableModel[]): Observable<ResultModel<string>>;

  /**
   * 策略编辑
   * @ param body
   */
  modifyLightStrategy(body: StrategyListModel): Observable<ResultModel<string>>;

  /**
   * 删除策略
   * @ param body
   */
  deleteStrategy(body: Array<string>): Observable<ResultModel<string>>;

  /**
   * 信息发布获取内容列表
   * @ param body
   */
  getReleaseContentList(body): Observable<Object>;

  /**
   * 信息发布删除列表
   * @ param body
   */
  deleteReleaseContentList(body: { programIdList: Array<string> }): Observable<ResultModel<ContentListModel[]>>;


  /**
   * 信息发布更新列表状态
   * @ param body
   */
  updateReleaseContentState(body: ContentEnableModel[]): Observable<ResultModel<ContentListModel[]>>;

  /**
   * 照明策略下发
   * @ param body
   */
  distributeLightStrategy(body: Array<{ strategyId: string, strategyType: string | object[] }>): Observable<ResultModel<string>>;

  /**
   * 设备列表
   * @ param body
   */
  equipmentListByPage(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>>;

  /**
   * 分组列表
   * @ param body
   */
  queryGroupInfoList(body: QueryConditionModel): Observable<ResultModel<GroupListModel[]>>;

  /**
   * 根据设备类型查询分组信息
   * @ param body
   */
  queryEquipmentGroupInfoList(body: QueryConditionModel): Observable<ResultModel<GroupListModel[]>>;

  /**
   * 信息发布策略下发
   * @ param body
   */
  distributeInfoStrategy(body: Array<{ strategyId: string, strategyType: string | object[] }>): Observable<ResultModel<string>>;

  /**
   * 联动策略下发
   * @ param body
   */
  distributeLinkageStrategy(body: { strategyId: string, strategyType: string | object[] }): Observable<ResultModel<string>>;

  /**
   * 策略导出
   * @ param body
   */
  exportStrategyList(body): Observable<Object>;

  /**
   * 验证策略名称是否存在
   * @ param name
   */
  checkStrategyNameExist(body: { strategyId: string, strategyName: string }): Observable<ResultModel<string>>;

  /**
   * 策略详情接口
   * @ param id
   */
  getLightingPolicyDetails(id: string): Observable<ResultModel<StrategyListModel>>;

  /**
   * 安防策略详情
   * @ param id
   */
  getSecurityPolicyDetails(id: string): Observable<ResultModel<StrategyListModel>>;

  /**
   * 联动策略详情
   * @ param id
   */
  getLinkageDetails(id: string): Observable<ResultModel<StrategyListModel>>;

  /**
   * 信息发布
   * @ param id
   */
  getReleasePolicyDetails(id: string): Observable<ResultModel<StrategyListModel>>;

  /**
   * 信息发布编辑列表内容
   * @ param body
   */
  editReleaseProgram(body): Observable<Object>;

  /**
   * 信息发布通过节目查看节目信息
   * @ param body
   */
  lookReleaseProgram(body: string): Observable<ResultModel<ContentListModel>>;

  /**
   * 信息新增节目信息
   * @ param body
   */
  addReleaseProgram(body): Observable<Object>;

  /**
   * 信息发布
   * @ param body
   */
  releasePolicyAdd(body: StrategyListModel): Observable<ResultModel<string>>;

  /**
   * 信息策略编辑
   * @ param body
   */
  modifyReleaseStrategy(body: StrategyListModel): Observable<ResultModel<string>>;

  /**
   * 信息新增审核(发起审核)
   * @ param body
   */
  addReleaseWorkProgram(body): Observable<Object>;

  /**
   * 信息发布获取内容审核列表
   * @ param body
   */
  getReleaseProgramWorkList(body): Observable<Object>;

  /**
   * 信息发布工单审核操作
   * @ param body
   */
  releaseWorkOrder(body): Observable<Object>;

  /**
   * 信息发布通过审核查看审核信息
   * @ param body
   */
  lookReleaseWorkOrder(body): Observable<Object>;

  /**
   * 安防获取通道列表
   * @ param body
   */
  getSecurityPassagewayList(body): Observable<Object>;

  /**
   * 获取配置信息
   * @ param body
   */
  getSecurityConfiguration(body): Observable<Object>;

  /**
   * 获取摄像头流地址
   * @ param body
   */
  getSecurityCamera(body): Observable<Object>;

  /**
   * 新增/修改配置信息
   * @ param body
   */
  saveSecurityConfiguration(body): Observable<Object>;

  /**
   * 新增通道列表
   * @ param body
   */
  saveChannel(body): Observable<Object>;

  /**
   * 修改通道列表
   * @ param body
   */
  updateChannel(body): Observable<Object>;

  /**
   * 安防上传文件（基础配置专用）
   * @ param body
   */
  uploadSslFile(body): Observable<Object>;

  /**
   * 删除文件
   * @ param body
   */
  deleteSslFile(body): Observable<Object>;

  /**
   * 摄像头云台控制
   * @ param body
   */
  cloudControl(body): Observable<Object>;

  /**
   * 摄像头云台控制
   * @ param body
   */
  getPresetList(body): Observable<Object>;

  /**
   * 摄像头流销毁
   * @ param body
   */
  cameraLogout(body): Observable<Object>;

  /**
   * 查看节目状态
   * @ param body
   */
  programStatus(body): Observable<Object>;

  /**
   * 设备节目投放数量统计
   * @ param body
   */
  launchQuantityStatistics(body): Observable<Object>;

  /**
   * 设备播放时长统计
   * @ param body
   */
  durationStatistics(body): Observable<Object>;

  /**
   * 工单增量统计
   * @ param body
   */
  workOrderIncrementStatistics(body): Observable<Object>;

  /**
   * 调整音量/亮度
   * @ param body
   */
  adjustVolumeBrightness(body): Observable<Object>;

  /**
   * 获取审核人列表
   */
  getCheckUsers(id: string): Observable<Object>;

  /**
   * 告警级别统计
   * @ param body
   */
  statisticsAlarmLevelType(body): Observable<Object>;

  /**
   * 通道列表删除
   * @ param body
   */
  deleteChannel(body): Observable<Object>;

  /**
   * 根据通道ID查询通道数据
   * @ param body
   */
  getChannelData(body): Observable<Object>;

  /**
   * 节目名称唯一校验
   * @ param body
   */
  programNameRepeat(body): Observable<Object>;

  /**
   * 通道列表修改状态
   * @ param body
   */
  updateChannelStatus(body): Observable<Object>;

  /**
   * 导出节目接口
   * @ param body
   */
  exportProgramData(body): Observable<Object>;

  /**
   * 导出工单接口
   * @ param body
   */
  exportWorkOrderData(body): Observable<Object>;
  /**
   * 获取审核工单历史流程
   * @ param body
   */
  queryHistoryList(body): Observable<Object>;
  /**
   * 信息发布
   * @ param body
   */
  broadcastPolicyAdd(body: StrategyListModel): Observable<ResultModel<string>>;

  /**
   * 广播策略编辑
   * @ param body
   */
  modifyBroadcastStrategy(body: StrategyListModel): Observable<ResultModel<string>>;

  /**
   *  广播策略新增审核(发起审核)
   * @ param body
   */
  // addBroadcastWorkProgram(body): Observable<Object>;
  getBroadcastProgramStatisticsData(body): Observable<Object>;
  durationBroadcastStatistics(body): Observable<Object>;
  workOrderBroadcastIncrementStatistics(body): Observable<Object>;
  querySoundRecordList(body): Observable<Object>;
  querySoundRecordEquipmentList(body): Observable<Object>;
  deleteSoundRecord(body): Observable<Object>;
  instructDistribute(body): Observable<Object>;
  queryBroadcastVolumeById(body): Observable<Object>;
  batchDownLoadRecords(body): Observable<Object>;
  exportRecordList(body): Observable<Object>;
  queryCallStatus(body): Observable<Object>;

  /**
   *  启用时检查模式
   */
  checkEnable(body: CheckEquipmentParamModel): Observable<Object>;

  /**
   * 新增策略时检查设备的模式提示
   */
  checkEquipmentOnAdd(body: CheckEquipmentParamModel): Observable<Object>;
  addCollectingEquipmentByIds(body: string[]): Observable<Object>;
  addCollectingDeviceByIds(body: string[]): Observable<Object>;

}
