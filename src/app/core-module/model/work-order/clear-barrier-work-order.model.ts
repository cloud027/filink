import {WorkOrderDeviceModel} from './work-order-device.model';
import {WorkOrderMaterielModel} from './work-order-materiel.model';
import {InspectionEquipmentInfoModel} from './inspection-equipment-info.model';
import {ClearBarrierEvaluateModel} from './clear-barrier-evaluate.model';
import {SelectTypesModel} from './select-types.model';
import {DepartmentUnitModel} from './department-unit.model';
import {SelectModel} from '../../../shared-module/model/select.model';
import {WorkOrderStatusEnum} from '../../enum/work-order/work-order-status.enum';
import {EquipmentTypeEnum} from '../../enum/equipment/equipment.enum';

export class ClearBarrierWorkOrderModel {
  /**
   * 工单id
   */
  public procId?: string;
  /**
   * 工单名称
   */
  public title?: string;
  /**
   * 状态
   */
  public status?: WorkOrderStatusEnum;
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
   * 设备列表
   */
  public equipment?: InspectionEquipmentInfoModel[];
  /**
   * 设施区域id
   */
  public deviceAreaId?: string;
  /**
   * 设施区域名称
   */
  public deviceAreaName?: string;
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
  public dataResourceName?: string;
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
   *物料实体
   */
  public materiel?: WorkOrderMaterielModel[];
  /**
   *拼接退单原因
   */
  public concatSingleBackReason?: string;
  /**
   *转派原因
   */
  public turnReason?: string;
  /**
   * 工单评价
   */
  public evaluateInfo?: ClearBarrierEvaluateModel[];
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
   * 单位
   */
  public procRelatedDepartments: DepartmentUnitModel[];
  /**
   * 设备ID
   */
  public equipmentId: string;
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
  public equipmentTypeName?: string | SelectModel[];
  /**
   * 设备类型图标
   */
  public equipClass?: string;

  /**
   * 设施对象
   */
  public deviceObject?: WorkOrderDeviceModel;
  /**
   * 设备容器
   */
  public equipmentList?: WorkOrderDeviceModel[];
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
   * 设备类型集合
   */
  public equipmentTypeList?: SelectTypesModel[];

  /**
   * 来源类型
   */
  public dataResourceType?: string;

  /**
   * 是否勾选
   */
  public checked?: boolean;

  /**
   * 自动派单
   */
  public autoDispatch?: string;

  constructor() {
    this.deviceObject = new WorkOrderDeviceModel();
  }
}
