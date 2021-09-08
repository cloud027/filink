import {SelectTypesModel} from './select-types.model';
import {SelectModel} from '../../../shared-module/model/select.model';
import {DeviceTypeEnum} from '../../enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../enum/equipment/equipment.enum';
import {WorkOrderStatusEnum} from '../../enum/work-order/work-order-status.enum';

export class InspectionWorkOrderModel {
  /**
   * 工单id
   */
  public procId: string;
  /**
   * 工单名称
   */
  public title: string;
  /**
   * 状态
   */
  public status: WorkOrderStatusEnum;
  /**
   * 按钮是否可用
   */
  public isShowTurnBackConfirmIcon: boolean;
  /**
   * 巡检起始时间
   */
  public inspectionStartTime: number;
  public inspectionStartDate: string;
  /**
   * 巡检结束时间
   */
  public inspectionEndTime: number;
  public inspectionEndDate: string;
  /**
   * 期望完工时间
   */
  public expectedCompletedTime: string;
  public ecTime: number;
  /**
   * 创建时间
   */
  public cTime: number;
  public createTime: string;
  /**
   * 剩余天数
   */
  public lastDays: number | string;
  /**
   * 巡检区域id
   */
  public deviceAreaId: string;
  /**
   * 巡检区域名称
   */
  public deviceAreaName: string;
  /**
   * 区域code
   */
  public deviceAreaCode: string;
  /**
   * 设施类型编码
   */
  public deviceType: DeviceTypeEnum;
  /**
   * 设施类型编码
   */
  public deviceTypeName: string | SelectModel[];
  /**
   * 设施图标
   */
  public deviceClass: string;
  /**
   * 巡检数量
   */
  public inspectionDeviceCount: number;
  /**
   * 责任单位id
   */
  public accountabilityDept: string;
  /**
   * 责任单位
   */
  public accountabilityDeptName: string;
  /**
   * 责任人id
   */
  public assign: string;
  /**
   * 责任人名称
   */
  public assignName: string;
  /**
   * 退单原因
   */
  public concatSingleBackReason: string;
  public singleBackReason: string;
  /**
   * 转派原因
   */
  public turnReason: string;
  /**
   * 进度
   */
  public progressSpeed: string;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 状态
   */
  public statusName: string | SelectModel[];
  /**
   * 状态class
   */
  public statusClass: string;
  /**
   * 样式
   */
  public rowStyle: {};
  /**
   * 样式
   */
  public lastDaysClass: string;
  /**
   * 设备类型
   */
  public equipmentType: EquipmentTypeEnum;
  /**
   * 设备类型集合
   */
  public equipmentTypeList: SelectTypesModel[];
  /**
   * 设备类型名称
   */
  public equipmentTypeName: string;
  /**
   * 设备类型图标
   */
  public equipClass: string;
  /**
   * 只有待指派能删
   */
  public isShowDeleteIcon?: boolean;
  /**
   *  已退单不可编辑
   */
  public isShowEditIcon?: boolean;
  /**
   *  是否可转派
   */
  public isShowTransfer?: boolean;
  /**
   *  待处理可以撤回
   */
  public isShowRevertIcon?: boolean;
  /**
   *  待指派可以指派
   */
  public isShowAssignIcon?: boolean;
}
