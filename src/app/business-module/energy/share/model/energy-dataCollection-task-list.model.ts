import { dataCollectionTaskStatusEnum } from '../enum/energy-config.enum';
/**
 * 能耗管理 数据采集任务列表
 */

export class EnergyDataCollectionTaskList {
    //  策略类型(页面没有 前端还是要传参) "6"
    strategyType: string;
    // 策略名称
    strategyName: string;
    // 采集周期
    execType: string;
    // 采集时间
    effectivePeriodStart: Date;
    // 控制类型	传"1"
    controlType: string;
    // 启用状态(0/1 (禁用/启用))
    strategyStatus: string | boolean;
    /** 任务状态 */
    execStatus: dataCollectionTaskStatusEnum;
    /** 任务状态 */
    collectStatus: dataCollectionTaskStatusEnum;
    // 创建人
    createUser: string;
    // 创建时间
    // 更新时间
    // 备注
    remark: string;
    // 策略关联列表
    strategyRefList: any;
    /** 是否展示编辑图标 */
    public isShowEditIcon?: boolean;
    constructor() {
        this.strategyType = '6';
        this.controlType = '1';
    }
}
