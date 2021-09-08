import {
    statictisRangeTypeEnum, StepSecondRangTypeEnum
} from '../enum/energy-config.enum';
export class StrategyListModel {
    /** 策略 id */
    strategyId: string;
    /** 电费策略名称 */
    public tariffStrategyName: string;
    /** 应用范围   1 区域   2 项目 */
    public scope: statictisRangeTypeEnum = statictisRangeTypeEnum.statisticsRegion;
    /** 所选区域 */
    public areaIds?: string[] = [];
    /** 区域名称 */
    public areaName?: string;
    /** 所选项目 */
    public projects?: any[] = [];
    /** 备注 */
    public remarks: string;
    // --------------------------------------第二步 --------------------------
    /** 基础电价 */
    electricityPrice: number;
    /** 保存 电费策略的表格信息 */
    listOfData: any[] = [];
    // --------------------------------------第二步 --------------------------

    // ------------------

    // ------------------

    // ------------------

    multiEquipmentData?: any[] = [];
    constructor() {
        // this.multiEquipmentData = []
    }
}

/** 第二步 新增电费策略 */
export class StepSecondInsertElectricModel {
    /** 策略的 id */
    id: number;
    /** 范围类型 */
    range: StepSecondRangTypeEnum;
    /** 起始电量(kWh) */
    startPower?: number;
    /** 终止电量(kWh) */
    endPower?: number;
    /** 起始月份 */
    startMonth?: any;
    /** 终止月份 */
    endMonth?: any;
    /** 起始时间 */
    startTime?: any;
    /** 终止时间 */
    endTime?: any;
    /** 电费单价 */
    price: number;
}
