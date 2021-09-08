/**
 * 智慧杆数量
 */
export class EquipmentCountListModel {
  /**
   * 单控数量
   */
  public singleControllerCount: number;
  /**
   * 集中数量
   */
  public centralControllerCount: number;

  constructor(params?) {
    this.singleControllerCount = params.singleControllerCount || 0;
    this.centralControllerCount = params.centralControllerCount || 0;
  }
}

/**
 * 用电量统计模型
 */
export class ElectricityFmtModel {
  /**
   * 时间
   */
  public statisticsTime: string;
  /**
   * 用电量
   */
  public electCons: number;
}

/**
 * 告警列表模型
 */
export class AlarmLevelModel {
  /**
   * 告警id
   */
  public id: string;
  /**
   * 告警名称
   */
  public alarmName?: string;
  /**
   * 告警级别
   */
  public alarmLevelName?: string;
}

/**
 * 统计图模型
 */
export class StatisticalChartModel {
  // X轴
  public xData?: any [] = [];
  // 数据
  public data?: any [] = [];
  // 是否显示
  public isShow?: boolean = false;
  // 单位
  public company?: string;
}


