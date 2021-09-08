export class StrategyListModel {
    /**
     * 电费策略名称
     */
    public tariffStrategyName: string;
    /**
     * 应用范围
     */
    public scopeOfApplication: string;
    /**
     * 区域
     */
    public region: string;
    /**
     * 备注
     */
    public remarks: string;


    // --------------------------------------第二步 --------------------------
    // 基础电价
    electricityPrice: number;
    // 新增策略
    insertPolicy:  {
        // 起始电量
        startingPower: 1,
        // 终止电量
        endOfCharge: 1,
        // 电费单价
        unitPriceOfElectricity: 1
    };
    // --------------------------------------第二步 --------------------------

    // ------------------

    // ------------------

    // ------------------

    multiEquipmentData?: any[] = [];

    public devicePoints?;

    constructor() {
        this.multiEquipmentData = [];
    }
}
