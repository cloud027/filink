/**
 * 日志模型
 */
export class LogModel {
  /**
   * 日志ID
   */
  public logId: string;
  /**
   * 日志名称
   */
  public logName: string;
  /**
   * 发生时间
   */
  public logTime: string;
  /**
   * 附加信息
   */
  public logMemo: string;
}

/**
 * 操作记录
 */
export class OperationRecordsModel {
  /**
   * 操作ID
   */
  public operateId: string;
  /**
   * 日志名称
   */
  public operateName: string;
  /**
   * 操作人员ID
   */
  public operateUserId: string;
  /**
   * 操作人员名称
   */
  public operateUserName: string;
  /**
   * 操作时间
   */
  public operateTime: string;
  /**
   * 操作结果状态
   */
  public operateResult: string;
  /**
   * 详细信息
   */
  public operateMemo: string;

  /**
   * 操作结果名称
   */
  public optResult: string;
}


/**
 *设施数据模型
 */
export class SetFacilityDataModel {
  /**
   * 是否选中
   */
  public checked: boolean;

  /**
   * 设备数量
   */
  public count: number;
  /**
   * 设施类型
   */
  public deviceType: string;
  /**
   * 设施名称
   */
  public name: string;
}

/**
 *设备数据模型
 */
export class SetEquipmentDataModel {
  /**
   * 是否选中
   */
  public checked: boolean;

  /**
   * 设备数量
   */
  public count: number;

  /**
   * 设施类型
   */
  public deviceType: string;

  /**
   * 设备类型
   */
  public equipmentType: string;
  /**
   * 设备名称
   */
  public name: string;
}


/**
 *工单类型模型
 */
export class SetWorkOrderStatusDataModel {
  /**
   * 是否选中
   */
  public checked: boolean;

  /**
   * 设备数量
   */
  public count: number;
  /**
   * 工单类型
   */
  public procType: string;
  /**
   * 工单状态
   */
  public status: string;
  /**
   * 工单名称
   */
  public orderName: string;
}
