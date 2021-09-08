/**
 * 工单列表筛选条件模型
 */
import {IndexWorkOrderStateEnum, IndexWorkOrderTypeEnum} from '../../../../core-module/enum/work-order/work-order.enum';

/**
 * 工单查询参数模型
 */
export class WorkOrderConditionModel {
  /**
   * 项目id
   */
  public projectId: string[];
  /**
   * 区域id
   */
  public areaId: string[];
  /**
   * 工单类型
   */
  public procType: IndexWorkOrderTypeEnum;
  /**
   * 工单状态
   */
  public status: IndexWorkOrderStateEnum;

  /**
   *  销账工单区域id
   */
  public deviceAreaIdList: string[];

  /**
   *  区域集合id
   */
  public areaIdList: string[];

}

/**
 * 巡检工单表格模型
 */
export class InspectionWorkOrderModel {
  /**
   * 工单编号
   */
  public procId: string;
  /**
   * 标题
   */
  public title: string;
  /**
   * 工单状态
   */
  public status: IndexWorkOrderStateEnum;
  /**
   * 责任单位id
   */
  public accountabilityDept: string;
  /**
   * 责任单位名称
   */
  public accountabilityDeptName: string;
  /**
   * 责任人id
   */
  public assign: string;
  /**
   * 责任人名字
   */
  public assignName: string;
  /**
   * 进度
   */
  public progressSpeed: number;

  /**
   * 期望完工时间
   */
  public expectedCompletedTime: string;

  /**
   * 状态样式
   */
  public statusClass: string;

  /**
   * 状态国际化
   */
  public statusName: string;
}

/**
 * 销障工单表格模型
 */
export class ClearWorkOrderModel {
  /**
   * 工单编号
   */
  public procId: string;
  /**
   * 标题
   */
  public title: string;
  /**
   * 工单状态
   */
  public status: IndexWorkOrderTypeEnum;
  /**
   * 责任单位id
   */
  public accountabilityDept: string;
  /**
   * 责任单位名称
   */
  public accountabilityDeptName: string;
  /**
   * 责任人id
   */
  public assign: string;
  /**
   * 责任人名字
   */
  public assignName: string;
  /**
   * 剩余天数
   */
  public lastDays: number;
  /**
   * 关联故障Id
   */
  public troubleId: string;
  /**
   * 关联故障code
   */
  public troubleCode: string;
  /**
   * 关联故障名称
   */
  public troubleName: string;
  /**
   * 关联告警id
   */
  public refAlarm: string;
  /**
   * 关联告警名称
   */
  public refAlarmName: string;
  /**
   * 关联告警code
   */
  public refAlarmCode: string;

  /**
   * 状态类
   */
  public statusClass: string;

  /**
   * 状态名称
   */
  public statusName: string;

  /**
   * 关联告警和故障
   */
  public refAlarmFaultName: string;
}

/**
 * 巡检工单和销障工单公用枚举
 */
export class InspectionAndClearModel {
  /**
   * 工单编号
   */
  public procId: string;
  /**
   * 标题
   */
  public title: string;
  /**
   * 工单状态
   */
  public status: IndexWorkOrderStateEnum;
  /**
   * 责任单位id
   */
  public accountabilityDept: string;
  /**
   * 责任单位名称
   */
  public accountabilityDeptName: string;
  /**
   * 责任人id
   */
  public assign: string;
  /**
   * 责任人名字
   */
  public assignName: string;
  /**
   * 进度
   */
  public progressSpeed: number;

  /**
   * 期望完工时间
   */
  public expectedCompletedTime: string;

  /**
   * 剩余天数
   */
  public lastDays: number;
  /**
   * 关联故障Id
   */
  public troubleId: string;
  /**
   * 关联故障code
   */
  public troubleCode: string;
  /**
   * 关联故障名称
   */
  public troubleName: string;
  /**
   * 关联告警id
   */
  public refAlarm: string;
  /**
   * 关联告警名称
   */
  public refAlarmName: string;
  /**
   * 关联告警code
   */
  public refAlarmCode: string;

  /**
   * 状态样式
   */
  public statusClass: string;

  /**
   * 状态国际化
   */
  public statusName: string;

  /**
   * 关联告警和故障
   */
  public refAlarmFaultName: string;
}

/**
 * 工单类型模型
 */
export class WorkOrderTypeModel {
  /**
   * 工单数量
   */
  public count: number;
  /**
   * 工单类型
   */
  public procType: IndexWorkOrderTypeEnum;

  /**
   * 工单名称
   */
  public orderName: string;
}


/**
 * 工单状态模型
 */
export class WorkOrderStateResultModel {
  /**
   * 工单数量
   */
  public count: number;
  /**
   * 工单状态
   */
  public status: IndexWorkOrderStateEnum;
  /**
   * 工单名称
   */
  public statusName: string;
}
