import { statictisRangeTypeEnum } from '../enum/energy-config.enum';
/** 能耗分析 查询 */
export class EnergyAnalysisQueryDataModel {
    /**
     * 统计范围   1 区域   2 项目
     */
    public scope: statictisRangeTypeEnum;

    /**
     * 所选区域
     */
    public areaIds?: Array<string> = [];

    /**
     * 所选项目
     */
    public projects?: Array<any> = [];

    /**
     * 统计日
     */
    public days: string[] = [];

    /**
     * 统计月
     */
    public months: string[] = [];
    /**
     * 统计年
     */
    public years: string[] = [];
}
