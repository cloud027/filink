import {SelectTypesModel} from '../../../../../core-module/model/work-order/select-types.model';
import {SelectTemplateModel} from '../template/select-template.model';
import {DeviceFormModel} from '../../../../../core-module/model/work-order/device-form.model';
import {DepartmentUnitModel} from '../../../../../core-module/model/work-order/department-unit.model';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {EquipmentFormModel} from '../../../../../core-module/model/work-order/equipment-form.model';
import {EnableStatusEnum, InspectionTaskStatusEnum} from '../../enum/clear-barrier-work-order.enum';
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';

/**
 * 巡检任务模型
 */
export class InspectionTaskModel {
  /**
   * 任务id
   */
  public inspectionTaskId: string;
  /**
   * 任务名称
   */
  public inspectionTaskName: string;
  /**
   * 任务状态
   */
  public inspectionTaskStatus: string | SelectModel[];
  /**
   * 启用状态
   */
  public opened: EnableStatusEnum;
  /**
   * 期望用时
   */
  public procPlanDate: number;
  /**
   * 巡检任务类型
   */
  public inspectionTaskType: string | SelectModel[];
  /**
   * 巡检周期
   */
  public taskPeriod: number;
  /**
   * 起始时间
   */
  public startTime: number;
  /**
   * 结束时间
   */
  public endTime: number;
  /**
   * 巡检区域
   */
  public inspectionAreaName: string;
  /**
   * 巡检区域 id
   */
  public inspectionAreaId: string;
  /**
   * 区域code
   */
  public inspectionAreaCode: string;
  /**
   * 巡检设施总数
   */
  public inspectionDeviceCount: number;
  /**
   * 责任单位
   */
  public accountabilityDeptName: string;
  /**
   * 单位id
   */
  public deptIds?: string;
  /**
   * 巡检全集
   */
  public isSelectAll: string;
  public selectAll: string;
  /**
   * 巡检设施
   */
  public deviceName: string;
  /**
   * 是否生成多工单
   */
  public isMultipleOrder: string;
  /**
   * 巡检起始时间
   */
  public inspectionStartTime: number;
  /**
   * 巡检结束时间
   */
  public inspectionEndTime: number;
  /**
   * 设施类型
   */
  public deviceType: DeviceTypeEnum;
  /**
   * 图标
   */
  public deviceClass: string;
  /**
   * 设施类型名称
   */
  public deviceTypeName: string | SelectModel[];
  /**
   * 设施图标
   */
  public deviceIcon: string;
  /**
   * 工单id
   */
  public procId: string;
  /**
   * 巡检模板
   */
  public template: SelectTemplateModel;
  /**
   * 设施集合
   */
  public deviceList: DeviceFormModel[];
  /**
   * 单位集合
   */
  public deptList: DepartmentUnitModel[];
  /**
   * 名称
   */
  public title: string;
  /**
   * 状态
   */
  public status: InspectionTaskStatusEnum;
  /**
   * 创建时间
   */
  public cTime: number;
  /**
   * 剩余天数
   */
  public lastDays: number;
  /**
   * 设施区域名称
   */
  public deviceAreaName: string;
  /**
   * 区域id
   */
  public inspectionAreaIds?: string;
  /**
   * 责任人
   */
  public assign: string;
  /**
   * 进度
   */
  public progressSpeed: number;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 转派原因
   */
  public turnReason: string;
  /**
   * 退单原因
   */
  public singleBackReason: string;
  /**
   * 状态名称
   */
  public statusName: string | SelectModel[];
  /**
   * 状态class
   */
  public statusClass: string;
  /**
   * 任务开始时间
   */
  public taskStartTime: string;
  /**
   * 任务结束时间
   */
  public taskEndTime: string;
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 单位
   */
  public accountabilityDept: string;
  /**
   * 模板名称
   */
  public templateName: string;
  /**
   * 设备类型
   */
  public equipmentType: EquipmentTypeEnum;
  /**
   * 设备类型名称
   */
  public equipmentTypeName: string;
  /**
   * 设备图标
   */
  public equipIcon: string;
  /**
   * 设备列表
   */
  public equipmentList: EquipmentFormModel[];
  /**
   * 结果
   */
  public result: string;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 设备集合
   */
  public equipmentTypeList: SelectTypesModel[];

  /**
   * 是否可编辑
   */
  public isShowEditIcon: boolean;

  /**
   * 是否点击禁用启用
   */
  public clicked: boolean;
}
