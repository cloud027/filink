import {
  DismantleTypeEnum,
  DismantleWarnTroubleEnum,
} from '../../enum/dismantle-barrier.config.enum';

import { WorkOrderDeviceModel } from '../../../../../core-module/model/work-order/work-order-device.model';

import { EquipmentTypeEnum } from '../../../../../core-module/enum/equipment/equipment.enum';
import { SelectTypesModel } from '../../../../../core-module/model/work-order/select-types.model';
import { SourceTypeEnum } from '../../../share/enum/clear-barrier-work-order.enum';
import { SelectModel } from '../../../../../shared-module/model/select.model';
/** 拆除工单的 详情 model */
export class DismantleBarrierWorkOrderModel {
  /**
   * 工单id
   */
  public procId?: string;
  /**
   * 工单名称
   */
  public title?: string;
  /** 任务描述 */
  taskDescribe: string;
  /** 拆除设备 设施 */
  removeType: DismantleTypeEnum;

  /** 关联故障/告警 */
  refType: DismantleWarnTroubleEnum;
  /** 关联的id */
  refId: string;
  /** 关联的名称 */
  refName: string;
  /** 物料信息 */
  material: string;

  /**
   * 设备id
   */
  equipmentId: string;

  /** 设备资产编码 */
  equipmentCode: string;
  /** 设施的资产编码 */
  deviceCode: string;

  /** 点位 展示的设备id */
  sequenceId: string;
  /**
   * 设备点位
   */
  removePosition: string;

  /** 设施对象 */
  public deviceObject?: WorkOrderDeviceModel = new WorkOrderDeviceModel();
  /**
   * 状态
   */
  public status?: string;
  /**
   * 状态名称
   */
  public statusName?: string | SelectModel[];
  /**
   *状态class
   */
  public statusClass?: string;
  /**
   *工单的关闭状态
   */
  public closed?: string;
  /**
   *行样式
   */
  public rowStyle?: object;
  /**
   *剩余天数class
   */
  public lastDaysClass?: string;
  /**
   * 设施id
   */
  public deviceId?: string;
  /**
   * 设施名称
   */
  public deviceName?: string;
  /**  设施型号 */
  deviceModel: string;

  /** 退单原因 */
  singleBackUserDefinedReason: string;
  /**
   * 设施类型编码
   */
  public deviceType?: string;
  /**
   * 设施类型编码
   */
  public deviceTypeName?: string | SelectModel[];
  /**
   * 设施图标
   */
  public deviceClass?: string;
  /**
   * 设施区域id
   */
  public deviceAreaId?: string;
  /**
   * 设施区域名称
   */
  public deviceAreaName?: string;
  equipmentInfoList?: any;
  /***
   * 创建时间
   */
  public createTime?: number;
  /**
   * 告警id
   */
  public refAlarmId: string;
  /**
   * 关联告警名称
   */
  public refAlarmName?: any;
  /**
   * 关联告警名称
   */
  public refAlarm?: string;
  /**
   * 关联告警编码
   */
  public refAlarmCode?: string;
  /**
   * 责任单位id
   */
  public accountabilityDept?: string;
  /**
   * 责任单位
   */
  public accountabilityDeptName?: string;
  /** 责任单位 id */
  accountabilityDeptId: string;
  /**
   * 责任人
   */
  public assign?: string;
  /**
   * 责任人姓名
   */
  public assignName?: string;
  /**
   * 期望完工
   */
  public expectedCompletedTime?: number | string;
  /**
   * 剩余天数
   */
  public lastDays?: number;
  /**
   * 备注
   */
  public remark?: string;
  /**
   *流程类型
   */
  public procType?: string;
  /**
   * 关联故障
   */
  public troubleId?: string;
  /**
   * 关联故障名称
   */
  public troubleName?: string;
  /**
   * 关联故障code
   */
  public troubleCode?: string;
  /**
   * 设备名称
   */
  public equipmentName?: string;
  /**
   * 设备类型
   */
  public equipmentType?: EquipmentTypeEnum;
  /**
   *工单来源类型
   */
  public procResourceType?: string;
  /**
   *车辆名称
   */
  public carName?: string;
  /**
   *物料名称
   */
  public materielName?: string;
  /**
   *拼接退单原因
   */
  public concatSingleBackReason?: string;
  /**
   *转派原因
   */
  public turnReason?: string;
  /**
   * 费用信息
   */
  public costName?: string;
  public cost?: string;
  /**
   * 实际完工时间
   */
  public realityCompletedTime?: string;
  /**
   * 告警/故障名称
   */
  public refAlarmFaultName?: string;
  /**
   * 按钮禁用
   */
  public isShowTurnBackConfirmIcon?: boolean;
  public isShowWriteOffOrderDetail?: boolean;
  public isShowTransfer?: boolean;
  /**
   * 关联告警或故障
   */
  public refAlarmAndFaultName?: string;
  /**
   * 设备类型名称
   */
  public equipmentTypeName?: string | { label: string; code: any }[];
  /**
   * 设备类型图标
   */
  public equipClass?: string;
  /**
   * 评价分数
   */
  public evaluatePoint?: string;
  /**
   * 进度
   */
  public progressSpeed?: number;
  /**
   * 评价信息
   */
  public evaluateDetailInfo?: string;
  /**
   * 工单ID
   */
  public regenerateId?: string;
  /**
   * 是否展示删除图片
   */
  public isShowDeleteIcon?: boolean;
  /**
   * 是否展示编辑图片
   */
  public isShowEditIcon?: boolean;
  /**
   * 是否展示待处理图片
   */
  public isShowRevertIcon?: boolean;
  /**
   * 是否展示指派图片
   */
  public isShowAssignIcon?: boolean;
  /**
   * 是否展示指派图片
   */
  public isCheckSingleBack?: number;

  /**
   * 区域code 获取
   */
  public areaCode?: string;

  /**
   * 区域code 获取
   */
  public deviceAreaCode?: string;

  /**
   * 拆除点位 的表格 设备容器
   */
  public equipmentList?: RemovePointTableModel[] = [];

  /**
   * 工单评价
   */
  public evaluateInfo?: EvaluateModel[];
  /**
   * 设备列表
   */
  public equipment?: InspectionEquipmentInfoModel[];

  /**
   * 设备类型集合
   */
  public equipmentTypeList?: SelectTypesModel[];
  /**
   * 来源类型
   */
  public dataResourceType?: SourceTypeEnum;
  /**
   * 自动派单
   */
  public autoDispatch?: string;
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
  equipmentType: EquipmentTypeEnum;

  /**
   * 设备点位
   */
  position: string;

  /**
   * 所属设施id
   */
  deviceId: string;
}

/** 销账评价 */
class EvaluateModel {
  /**
   * 评价类型
   */
  public type: string;
  /**
   * 评价分数
   */
  public evaluatePoint: string;
  /**
   * 评价信息
   */
  public evaluateInfo: string;
}

/** 巡检任务关联设备实体类 */
class InspectionEquipmentInfoModel {
  /**
   * 关联设施id
   */
  public deviceId?: string;
  /**
   * 设备id
   */
  public equipmentId?: string;
  /**
   * 设备名称
   */
  public equipmentName?: string;
  /**
   * 设备类型
   */
  public equipmentType?: string;
  /**
   * 设备编号
   */
  public equipmentCode?: string;
  /**
   * 基础定位
   */
  public positionBase?: string;
  /**
   * 详细地址
   */
  public address?: string;
}

/** 拆除点位 的表格 model */
export class RemovePointTableModel {
  /** 设备id */
  equipmentId: string;
  /** 设备点位 */
  mountPosition: string;

  /** 设备类型 */
  equipmentType: EquipmentTypeEnum;
  /**
   * 类型名称
   */
  public typeName?: string | SelectModel[];
  /** 设备名称 */
  equipmentName: string;

  /** 展示的 设备 id */
  sequenceId: string;
  /** 资产编码 */
  equipmentCode: string;

  /** 样式 */
  styleColor?: string;
}
