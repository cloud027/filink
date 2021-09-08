/**
 * 资产分析设施资产类别数据模型
 */
export class AssetTypeDeviceModel {
    /**
     * 设施资产数量
     */
    public deviceNum: number;
    /**
     * 设施百分比
     */
    public devicePercentage: string;
    /**
     * 设施资产类型
     */
    public deviceType: string | { label: string, code: any }[];
    /**
     * 图表样式
     */
     public iconClass: string;
    /**
     * 页面渲染资产类型统一名称
     */
    public typeName: string | { label: string, code: any }[];
    /**
     * 资产数量排序字段
     */
     public numSearchKey: string;

}
