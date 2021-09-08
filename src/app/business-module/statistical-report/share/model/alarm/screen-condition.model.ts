/**
 * 筛选条件
 */
export class ScreenConditionModel {
  bizCondition: {
    /**
     * 开始日期
     */
    beginTime: number,
    /**
     * 结束日期
     */
    endTime: number,
    /**
     * 设备ids
     */
    deviceIds: string[],
    /**
     * 区域列表
     */
    areaList: string[],
    /**
     * 统计类型
     */
    statisticsType: string
    /**
     * 区域code
     */
    alarmCodes: any
  };
}
