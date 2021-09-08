/**
 * 资产分析设备资产类别数据模型
 */
export class AssetTypeOrGrowthEquipmentModel {
    public areaId: string;
    public createTime: any;
    public createTimeFmt: any;
    public createTimeStamp: number;
    public deployStatus: string;
    /**
     * 设备资产数量
     */
    public equipmentNum: number;
    /**
     * 设备资产类别百分比
     */
    public equipmentPercentage: string;
    public equipmentStatus: string;
    /**
     * 设备资产类型
     */
    public equipmentType: string | { label: string, code: any }[];
    /**
     * 设备增长率
     */
    public equipmentTypeGrowthRate: string;
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
     * 资产增长率排序字段
     */
    public growthRateSortKey: number;
}
