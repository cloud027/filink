/**
 * 资产分析设施资产增长率数据模型
 */
export class AssetGrowthDeviceModel {
    /**
     * 日期中文字符串
     */
    public createTimeFmt: string;
    /**
     * 日期时间戳
     */
    public createTimeStamp: number;
    /**
     * 资产数量
     */
    public deviceNum: number;
    /**
     * 资产类型
     */
    public deviceType: string | { label: string, code: any }[];
    /**
     * 资产增长率
     */
    public deviceTypeGrowthRate: string;
    /**
     * 图标样式
     */
    public iconClass: string;
    /**
     * 页面渲染资产类型统一名称
     */
    public typeName: string | { label: string, code: any }[];
    /**
     * 统计纵坐标数据源
     */
    public number: number;
    /**
     * 资产数量搜索字段
     */
    public numSearchKey: string;
    /**
     * 创建时间
     */
    public createTime: any;
    /**
     * 资产增长率排序字段
     */
    public growthRateSortKey: number;
}
