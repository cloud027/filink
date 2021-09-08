import {SelectModel} from '../../../shared-module/model/select.model';

export class AlarmConfirmWorkOrderModel {
  /**
   *工单编码
   */
  public  procId?: string;

  /**
   *是否删除
   */
  public  deleted?: string;

  /**
   *创建人
   */
  public  createUser?: string;

  /**
   *创建时间
   */
  public  createTime?;

  /**
   *修改人
   */
  public  updateUser?: string;

  /**
   *修改时间
   */
  public  updateTime?;

  /**
   *设施编号
   */
  public  deviceId?: string;

  /**
   *设施名称
   */
  public  deviceName?: string;

  /**
   *区域编号
   */
  public  deviceAreaId?: string;
  /**
   * 区域code
   */
  public deviceAreaCode?: string;

  /**
   *区域名称
   */
  public  deviceAreaName?: string;
  /**
   * 设备
   */
  public equipment?: any;
  public equipmentList?: any;

  /**
   *设施类型
   */
  public deviceType?: string;
  public deviceTypeName?: string | SelectModel[];
  public deviceClass?: string;

  /**
   *责任单位编号
   */
  public  accountabilityDept?: string;

  /**
   *责任单位名称
   */
  public  accountabilityDeptName?: string;

  /**
   *流程类型
   */
  public  procType?: string;

  /**
   *流程标题
   */
  public  title?: string;

  /**
   *责任人
   */
  public  assign?: string;

  /**
   *单位类型 0 人 1 部门
   */
  public  deptType?: string;

  /**
   *单据状态
   * (assigned:待指派;
   * pending:待处理;
   * processing:处理中;
   * completed:已完成;
   * singleBack:已退单;
   * turnProcess 已转派)
   */
  public status?: string;
  public statusClass?: string;
  public statusName?: string | SelectModel[];

  /**
   *退单原因(0、其他；1、误报)
   */
  public  singleBackReason?: string;

  /**
   *自定义退单原因
   */
  public  singleBackUserDefinedReason?: string;

  /**
   *处理方案
   * 0-自定义（对应故障原因-其他），
   * 1-报修（对应故障原因-人为损坏，道路施工，盗穿）
   * 2 - 现场销障（对应故障原因-销障）
   */
  public  processingScheme?: string;

  /**
   *自定义处理方案
   */
  public  processingUserDefinedScheme?: string;

  /**
   *期望完工时间
   */
  public expectedCompletedTime?: number | Date;

  /**
   *开始时间
   */
  public  beginTime?: number;

  /**
   *剩余天数
   */
  public lastDays?: number | string;
  public lastDayClass?: string;

  /**
   *备注
   */
  public  remark?: string;

  /**
   *故障原因
   * （0，
   * "其他",1、"人为损坏",
   * 2、
   * "道路施工",
   *
   * 3，"盗穿",
   * 4、
   * "销障"）
   */
  public  errorReason?: string;

  /**
   *自定义故障原因
   */
  public  errorUserDefinedReason?: string;

  /**
   *工单来源 1 手动新增  2 巡检任务新增 3 告警新增 4 故障新增
   */
  public  procResourceType?: string;

  /**
   *转派原因
   */
  public  turnReason?: string;

  /**
   *工单超时是否已经通知   0未通知 1 已通知
   */
  public  told?: string;

  /**
   *关联告警编号
   */
  public  refAlarmId?: string;

  /**
   *关联告警名称
   */
  public  refAlarmName?: string;

  /**
   *关联告警code
   */
  public  refAlarmCode?: string;

  /**
   * 告警类别
   */
  public alarmClassification?: string;

  /**
   *确认退单  0 未确认 1 已确认
   */
  public  checkSingleBack?: string;

  /**
   *是否创建告警 0 未创建  1 已创建
   */
  public  createAlarm?: string;

  /**
   *重新生成工单id（已重新生成工单，会有新工单id）
   */
  public  regenerateId?: string;

  /**
   *维护建议
   */
  public  maintenanceAdvice?: string;

  /**
   *是否审核 0 没审核  1 审核通过 2 审核不通过
   */
  public  checkProc?: string;

  /**
   *是否审核 0 没审核费用  1 费用审核通过 2 费用审核不通过
   */
  public  checkCost?: string;

  /**
   *审核流程意见
   */
  public  checkProcAdvice?: string;

  /**
   *审核费用意见
   */
  public  checkCostAdvice?: string;

  /**
   *评价分数
   */
  public  evaluatePoint?: number | string;

  /**
   *多租户id
   */
  public  tenantId?: string;

  /**
   *车辆信息
   */
  public car: object;

  /**
   *物料信息
   */
  public materiel: object;

  /**
   *设备id
   */
  public  equipmentId?: string;

  /**
   *设备名称
   */
  public equipmentName?: string;

  /**
   *设备类型
   */
  public equipmentType?: string;
  public equipmentTypeList?: string[];
  public equipmentTypeName?: string;

  /**
   *待确定原因
   */
  public  uncertainReason?: string;

  /**
   *实际告警原因
   */
  public  realityAlarmReason?: string;

  /**
   * 权限部门
   */
  public  permissionDept?: string;

  /**
   * 流程id
   */
  public  instanceId?: string;
  /**
   * 按钮状态
   */
  public isShowDeleteIcon?: boolean;
  public isShowEditIcon?: boolean;
  public isShowTransfer?: boolean;
  public isShowRevertIcon?: boolean;
  public isShowAssignIcon?: boolean;
  public isShowTurnBackConfirmIcon?: boolean;
  /**
   * 责任人
   */
  public assignName?: string;
  /**
   * 自动派单
   */
  public autoDispatch?: string;
  /**
   * 剩余天数样式
   */
  public rowStyle?: {color: string};
  /**
   * 车辆信息
   */
  public carName?: string;
  /**
   * 退单原因
   */
  public concatSingleBackReason?: string;
  /**
   * 带确定原因
   */
  public confirmReason?: string;
  /**
   *  告警原因
   */
  public realAlarmReason?: string;
  /**
   * 完成时间
   */
  public completeTime?: string | number;
  public realityCompletedTime?: string | number;
  /**
   * 物料
   */
  public materielName?: string;
  /**
   * 进度
   */
  public progressSpeed?: number;
  /**
   * 费用
   */
  public costInformation?: string;
  public cost?: string;
  /**
   * 评价
   */
  public evaluateDetailInfo?: string;
  /**
   * 图标class
   */
  public picture?: string;
  public typeName?: string;
  public starClass?: string;

  constructor() {
    this.progressSpeed = 0;
  }
}
