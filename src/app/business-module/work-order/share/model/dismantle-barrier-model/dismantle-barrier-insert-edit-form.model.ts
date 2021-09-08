import {
  DismantleTypeEnum,
  DismantleWarnTroubleEnum,
} from '../../enum/dismantle-barrier.config.enum';
/** 拆除工单的新增和修改 model */
export class DismantleBarrierInsertEditFormModel {
  // 工单 id
  procId?: string;
  /** 工单名称 */
  title: string;
  /** 任务描述 */
  taskDescribe: string;
  /** 设施区域 id */
  deviceAreaId: string;
  /** 设施区域 区域名称 */
  deviceAreaName: string;
  /** 设施区域 区域code */
  deviceAreaCode: string;
  /** 拆除设施/设备 */
  removeType: DismantleTypeEnum = DismantleTypeEnum.device;
  /** (拆除)设施id */
  deviceId: string;
  /** (拆除)设施名称 */
  deviceName: string;
  /** (拆除)设施类型 */
  deviceType: string;
  /** (拆除)设施型号 */
  deviceModel: string;
  /** (拆除)设施编码 */
  deviceCode: string;
  /** 拆除点位 只有当拆除类型选择 设备的时候需要必填 */
  equipmentInfoList?: EquipmentInfoList[];
  /** 关联故障/告警 */
  refType: DismantleWarnTroubleEnum = DismantleWarnTroubleEnum.warn;
  /** 关联的id */
  refId: string;
  /** 关联的名称 */
  refName: string;
  /** 车牌信息(车牌号) */
  carNo?: string;
  /** 物料信息 */
  material: string;
  /** 责任单位编号 */
  accountabilityDept: string;
  /** 责任单位 名称 */
  accountabilityDeptName: string;
  /** 责任单位 id */
  accountabilityDeptId: string;
  /** 期望完工时间 */
  expectedCompletedTime: number;
  /** 备注 */
  remark: string;
  autoDispatch: string;
}

/** 拆除点位 选择的设备 */
export class EquipmentInfoList {
  /**
   * 设备id
   */
  equipmentId: string;

  /**
   * 设备名称
   */
  equipmentName: string;

  /**
   * 设备类型
   */
  equipmentType: string;

  /** 资产编码 */
  equipmentCode: string;

  /** 展示的 设备id */
  sequenceId: string;

  /**
   * 设备点位
   */
  position: string;

  /**
   * 所属设施id
   */
  deviceId: string;
}
