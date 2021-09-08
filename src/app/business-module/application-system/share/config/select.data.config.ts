import {StrategyStatusEnum} from '../enum/policy.enum';

export class SelectDataConfig {
  /**
   * 用电量的统计筛选
   */
  static selectData(languageTable) {
    return [
      {id: 5, name: languageTable.electricityDate.week},
      {id: 6, name: languageTable.electricityDate.month},
      // {id: 7, name: languageTable.electricityDate.quarter},
      {id: 8, name: languageTable.electricityDate.year}
    ];
  }
  /**
   * 亮灯率的统计筛选
   */
  static lightingRateData(languageTable) {
    return [
      {id: 3, name: languageTable.lightRateList.lastYear},
      {id: 2, name: languageTable.lightRateList.lastMonth},
      {id: 1, name: languageTable.lightRateList.lastWeek},
    ];
  }

  /**
   * 工单统计的统计筛选
   */
  static workOrderData(languageTable) {
    return [
      {id: 3, name: languageTable.workOrderList.lastYear},
      {id: 2, name: languageTable.workOrderList.lastMonth},
      {id: 1, name: languageTable.workOrderList.lastWeek},
    ];
  }

  /**
   * 执行状态
   * @ param languageTable
   */
  static execStatusData(languageTable) {
    return [
      {label: languageTable.execStatus.implement, code: '1'},
      {label: languageTable.execStatus.free, code: '0'},
    ];
  }

  /**
   * 启用状态
   * @ param languageTable
   */
  static strategyStatusData(languageTable) {
    return [
      {label: languageTable.strategyStatus.open, code: '1'},
      {label: languageTable.strategyStatus.close, code: '0'},
    ];
  }

  /**
   * 策略类型
   * @ param languageTable
   */
  static strategyTypeData(languageTable) {
    return [
      {label: languageTable.policyControl.lighting, code: StrategyStatusEnum.lighting},
      {label: languageTable.policyControl.information, code: StrategyStatusEnum.information},
      {label: languageTable.policyControl.linkage, code: StrategyStatusEnum.linkage},
      {label: languageTable.policyControl.broadcast, code: StrategyStatusEnum.broadcast},
    ];
  }

  /**
   * 平台控制
   * @ param languageTable
   */
  static controlTypeData(languageTable) {
    return [
      {label: languageTable.controlType.platform, code: '1'},
      {label: languageTable.controlType.equipment, code: '2'},
    ];
  }

  static execTypeData(languageTable) {
    return [
      {label: languageTable.executionCycleType.none, code: '1'},
      {label: languageTable.executionCycleType.everyDay, code: '2'},
      {label: languageTable.executionCycleType.workingDay, code: '3'},
      {label: languageTable.executionCycleType.holiday, code: '4'},
      {label: languageTable.executionCycleType.intervalExecution, code: '5'},
      {label: languageTable.executionCycleType.custom, code: '6'},
    ];
  }
}
