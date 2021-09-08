/**
 * 工单详情
 */
import {DeviceFormModel} from '../../../../../core-module/model/work-order/device-form.model';
import {DepartmentUnitModel} from '../../../../../core-module/model/work-order/department-unit.model';
import {SelectTemplateModel} from '../template/select-template.model';
import {EquipmentFormModel} from '../../../../../core-module/model/work-order/equipment-form.model';
import {MaterielModel} from '../../../../trouble/share/model/materiel.model';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {WorkOrderStatusEnum} from '../../../../../core-module/enum/work-order/work-order-status.enum';

export class InspectionWorkOrderDetailModel {
  /**
   * 工单id
   */
  public procId: string;
  /**
   * 工单名称
   */
  public title: string;
  /**
   * 工单类型
   */
  public procResourceType: string;
  /**
   * 状态
   */
  public status: WorkOrderStatusEnum;
  /**
   * 单位
   */
  public procRelatedDepartments: DepartmentUnitModel[];
  /**
   * 巡检起始时间
   */
  public inspectionStartTime: number | Date | string;
  public inspectionStartDate: string;
  /**
   * 巡检结束时间
   */
  public inspectionEndTime: number | Date | string;
  public inspectionEndDate: string;
  /**
   * 期望完工时间
   */
  public expectedCompletedTime: Date | number;
  public ecTime: number;
  /**
   * 创建时间
   */
  public cTime: number;
  public createTime: number | string;
  /**
   * 剩余天数
   */
  public lastDays: number | string;
  /**
   * 剩余天数class
   */
  public latsDayClass: string;
  /**
   * 巡检区域id
   */
  public deviceAreaId: string;
  /**
   * 巡检区域code
   */
  public deviceAreaCode: string;
  /**
   * 巡检区域名称
   */
  public deviceAreaName: string;
  /**
   * 设施类型编码
   */
  public deviceType: DeviceTypeEnum;
  /**
   * 设施类型编码
   */
  public deviceTypeName: string;
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
  public progressSpeed: string | number;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 类型
   */
  public contentType: string;
  /**
   * 部门列表
   */
  public deptList: DepartmentUnitModel[];
  /**
   * 设施列表
   */
  public deviceList: DeviceFormModel[];
  /**
   * 设别列表
   */
  public equipmentList: EquipmentFormModel[];
  /**
   * 设施名称
   */
  public deviceName: string | SelectModel[];
  /**
   * 设施图标
   */
  public deviceIcon: string;
  /**
   * 巡检区域id
   */
  public inspectionAreaId: string;
  /**
   * 巡检区域名称
   */
  public inspectionAreaName: string;
  /**
   * 巡检任务id
   */
  public inspectionTaskId: string;
  /**
   * 任务名称
   */
  public inspectionTaskName: string;
  /**
   * 任务状态
   */
  public inspectionTaskStatus: string;
  /**
   * 任务类型
   */
  public inspectionTaskType: string;
  /**
   * 生成多工单
   */
  public isMultipleOrder: string;
  /**
   * 启用状态
   */
  public opened: string;
  /**
   * 巡检全集
   */
  public isSelectAll: string;
  public selectAll: string;
  /**
   * 期望用时
   */
  public procPlanDate: number;
  /**
   * 周期
   */
  public taskPeriod: string;
  /**
   * 巡检模板
   */
  public template: SelectTemplateModel;
  /**
   * 开始时间
   */
  public startTime: number;
  /**
   * 结束时间
   */
  public endTime: number;
  /**
   * 物料
   */
  public materiel: MaterielModel[];
  /**
   * 设备
   */
  public procRelatedEquipment: EquipmentFormModel[];
  /**
   * 设备类型
   */
  public equipmentType: EquipmentTypeEnum;
  /**
   * 车辆信息
   */
  public carName: string;
  /**
   * 物料信息
   */
  public materielName: string;
  /**
   * 费用信息
   */
  public costName: string;
  public cost: string;
  /**
   * 开始时间
   */
  public taskStartTime: string;
  /**
   * 结束时间
   */
  public taskEndTime: string;
  /**
   * 实际完工时间
   */
  public realityCompletedTime: string;
  /**
   * 启用状态
   */
  public openStatus: string;
  /**
   * 多工单
   */
  public multiWorkOrder: string;
  /**
   * 多工单class
   */
  public multiClass: string;
  /**
   * 起始时间
   */
  public orderStartTime: string;
  /**
   * 结束时间
   */
  public orderEndTime: string;

  /**
   * 详情状态名称
   */
  public statusName: string;

  /**
   * 详情状态图标class
   */
  public statusClass: string;

  /**
   * 设施列表
   */
  public procRelatedDevices: DeviceFormModel[];

  /**
   * 设备列表
   */
  public equipmentDetailList: {name?: string | SelectModel[], iconClass?: string}[];

  /**
   * 创建时间
   */
  public createDate: number;

  /**
   * 自动派单
   */
  public autoDispatch?: string;

  constructor() {
    this.progressSpeed = 0;
  }
}
