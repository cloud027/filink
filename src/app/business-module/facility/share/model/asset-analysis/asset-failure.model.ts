/**
 * 资产分析资产故障率数据模型
 */
export class AssetFailureModel {
    /**
     * 故障创建时间
     */
    public createTime: any;
    /**
     * 设备产品型号id
     */
    public equipmentProductIds: any;
    /**
     * 产品型号id
     */
    public productId: string;
    /**
     * 故障增长率
     */
    public troubleGrowthRate: string;
    /**
     * 故障数量
     */
    public troubleNum: number;
    /**
     * 故障数量搜索时转换为字符串
     */
    public numSearchKey: string;
    /**
     * 故障增长率排序时处理后的数据
     */
    public failureRateSortKey: number;
    /**
     * 资产类型图标
     */
    public iconClass: string;
    /**
     * 资产类型名称
     */
    public typeName: string | { label: string, code: any }[];
    /**
     * 产品型号
     */
    public productModel: string;
    /**
     * 产品供应商
     */
    public supplierName: string;
    /**
     * 产品软件版本号
     */
    public softwareVersion: string;
    /**
     * 产品硬件版本号
     */
    public hardwareVersion: string;
}
