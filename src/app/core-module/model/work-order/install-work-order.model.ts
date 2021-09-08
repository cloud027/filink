import {SelectModel} from '../../../shared-module/model/select.model';

/**
 * 安装工单列表
 */
export class InstallWorkOrderModel {
  /**
   * 工单id
   */
  procId?: string;
  id?: string;

  /**
   * 工单名称
   */
  title?: string;

  /**
   * 任务描述
   */
  describe?: string;
  taskDesc?: string;

  /**
   * 设施类型
   */
  deviceType?: string;
  deviceTypeName?: string | SelectModel[];
  deviceClass?: string;

  /**
   * 设施名称
   */
  deviceName?: string;
  devicesName?: object;
  /**
   * 设施id
   */
  deviceId?: string;

  /**
   * 设施型号
   */
  deviceModel?: string;

  /**
   * 设备类型
   */
  equipmentType?: string;
  /**
   * 设备类型集合
   */
  equipmentTypeClass?: string;
  equipmentTypeName?: string | SelectModel[];

  /**
   * 设备名称
   */
  equipmentName?: string;
  /**
   * 设备id
   */
  equipmentId?: string;

  /**
   * 设备型号
   */
  equipmentModel?: string;

  /**
   * 安装点位
   */
  pointPosition?: string | number;

  /**
   * 设施区域
   */
  deviceAreaId?: string;
  /**
   * 区域code
   */
  deviceAreaCode?: string;

  /**
   *区域名称
   */
  deviceAreaName?: string;
  // 表单用区域
  deviceArea?: object;
  /**
   * 设备
   */
  equipment?: any;
  equipmentList?: any;

  /**
   * 期望完工时间
   */
  planCompletedTime?: string | number | Date;

  /**
   * 实际完工时间
   */
  realityCompletedTime?: string | number | Date;

  /**
   * 物料信息
   */
  materialsInformation?: string;
  /**
   * 车辆信息
   */
  carInfo?: string;
  /**
   * 费用信息
   */
  cost?: {cost: string | number, remark: string};
  costInfo?: string;

  /**
   * 负责单位编号
   */
  accountabilityDept?: string | object;
  accountabilityDeptCode?: string;
  /**
   *责任单位名称
   */
  accountabilityDeptName?: string;

  /**
   * 负责人
   */
  assign?: string;
  /**
   * 责任人
   */
  assignName?: string;

  /**
   * 备注
   */
  remark?: string;
  /**
   *单据状态
   * (assigned:待指派;
   * pending:待处理;
   * processing:处理中;
   * completed:已完成;
   * singleBack:已退单;
   * turnProcess 已转派)
   */
  status?: string;
  statusClass?: string;
  statusName?: string | SelectModel[];
  /**
   *剩余天数
   */
  lastDays?: number | string;
  latsDayClass?: string;
  /**
   * 剩余天数样式
   */
  lastDayClass?: string;
  /**
   * 列表操作按钮状态
   */
  isShowDeleteIcon?: boolean;
  isShowEditIcon?: boolean;
  isShowTransfer?: boolean;
  isShowRevertIcon?: boolean;
  isShowAssignIcon?: boolean;
  isShowTurnBackConfirmIcon?: boolean;

  /**
   * 自动派单
   */
  autoDispatch?: string;
  autoDispatchStr?: string;
  /**
   * 行样式
   */
  rowStyle?: {color: string};
  /**
   * 是否新增设备
   */
  isGenerateEquipment?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 资产编码
   */
  assetCode?: string;
  /**
   * 原资产编码
   */
  oldEquipmentPropertyCode?: string;
  /***
   * 安装资产编码
   */
  installEquipmentPropertyCode?: string;
  /**
   * 退单原因
   */
  singleBackReason?: string;
  singleBackUserDefinedReason?: string;
  /**
   * 转派原因
   */
  turnReason?: string;
  /**
   * 实际开始时间
   */
  startTime?: string;
  /**
   * 工单类型
   */
  procType?: string;

}
