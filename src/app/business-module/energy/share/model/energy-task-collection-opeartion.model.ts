import {
    dataCollectionTaskStatusEnum,
    collectionTaskCycleEnum,
    collectionTaskOpenCloseEnum
} from '../enum/energy-config.enum';
/**
 * 数据采集任务 新增或编辑数据模型
 */
export class EnergyTaskCollectionOpeartionModel {
    // 固定参数
    controlType: string;
    strategyType: string;
    /** 开始时间 */
    effectivePeriodStart: string;

    /** 结束时间 */
    effectivePeriodEnd: string;
    /** 采集时间 */
    execTime: string;
    //  id
    strategyId?: string;
    // 名称
    strategyName: string;
    /**
     * 执行状态
     */
    execStatus?: dataCollectionTaskStatusEnum;
    /**
     * 策略状态
     * (0/1 (禁用/启用))
     */
    strategyStatus: collectionTaskOpenCloseEnum;
    /**
     * 执行周期
     */
    execType: collectionTaskCycleEnum;
    // 创建人
    createUser: string;
    remark: string;
    /**
     * 数据列表
     */
    strategyRefList?: StrategyRefListModel[];
}

export class StrategyRefListModel {
    /**
     * id
     */
    public refId: string;
    /**
     * 名称
     */
    public refName: string;
    /**
     * 设备状态
     */
    public refEquipmentType?: string;
    /**
     * 应用范围类型
     */
    public refType: string;
}
