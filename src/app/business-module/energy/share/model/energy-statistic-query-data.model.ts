
// tslint:disable: no-use-before-declare
import {
  energyStatisticsTime,
  statictisRangeTypeEnum,
  StatisticRankTypeEnum,
} from '../enum/energy-config.enum';
/** 能耗统计 查询 */
export class EnergyStatisticsQueryDataModel {
  /**
   * 统计频率   1 逐月   2 逐天   3 逐时
   */
  public frequency: energyStatisticsTime = energyStatisticsTime.statisticsDay;
  /** 选择器选择的时间 */
  selectTimeValue: Date;

  /**
   * 逐月统计开始时间
   */

  public startMonth?: MonthValue = new MonthValue();

  /**
   * 逐月统计结束时间
   */

  public endMonth?: MonthValue = new MonthValue();

  /**
   * 逐日统计开始时间
   */

  public startDay?: DayValue = new DayValue();

  /**
   * 逐日统计结束时间
   */

  public endDay?: DayValue = new DayValue();

  /**
   * 逐时统计开始时间
   */

  public startHour?: HoursValue = new HoursValue();

  /**
   * 逐时统计结束时间
   */

  public endHour?: HoursValue = new HoursValue();

  /**
   * 统计范围   1 区域   2 项目
   */
  public scope: statictisRangeTypeEnum = statictisRangeTypeEnum.statisticsRegion;

  /**
   * 所选区域
   */
  public areaIds?: Array<string> = [];

  /**
   * 所选项目
   */
  public projects?: Array<any> = [];

  /**
   * 排名方式   "asc" 正序排名   "desc" 反序排名
   */
  public rank: StatisticRankTypeEnum = StatisticRankTypeEnum.asc;

  /** 统计逐时 */
  public statictisHoursData(dayData: Date) {

    this.startHour = new HoursValue();

    this.endHour = new HoursValue();

    if (dayData === null) {
      this.startHour.hour = null;
      this.startHour.day = null;
      this.startHour.month = null;
      this.startHour.year = null;

      this.endHour.day = null;
      this.endHour.hour = null;
      this.endHour.month = null;
      this.endHour.year = null;
      return;
    }
    const getTime = new Date(dayData);
    this.startHour.hour = 0;
    this.endHour.day = this.startHour.day = getTime.getDate();
    this.endHour.month = this.startHour.month = getTime.getMonth() + 1;
    this.endHour.year = this.startHour.year = getTime.getFullYear();

    this.endHour.hour = 23;
  }

  /** 统计 逐天 */
  public statictisDayData(dayData: Date) {

    this.startDay = new DayValue();

    this.endDay = new DayValue();

    if (dayData === null) {
      this.startDay.day = null;
      this.startDay.month = null;
      this.startDay.year = null;

      this.endDay.day = null;
      this.endDay.month = null;
      this.endDay.year = null;
      return;
    }
    const getTime = new Date(dayData);
    this.startDay.day = 1;
    this.endDay.month = this.startDay.month = getTime.getMonth() + 1;
    this.endDay.year = this.startDay.year = getTime.getFullYear();

    this.endDay.day = new Date(getTime.getFullYear(), getTime.getMonth() + 1, 0).getDate();
  }

  /** 统计 逐月 */
  public statictisMonthData(dayData: Date) {

    this.startMonth = new MonthValue();

    this.endMonth = new MonthValue();

    if (dayData === null) {
      this.startMonth.month = null;
      this.startMonth.year = null;

      this.endMonth.month = null;
      this.endMonth.year = null;
      return;
    }

    const getTime = new Date(dayData);
    this.startMonth.month = 1;
    this.endMonth.year = this.startMonth.year = getTime.getFullYear();

    this.endMonth.month = 12;
  }
  /** 初始化所有的时间 */
  initTime(dayData: Date) {

    this.startDay = new DayValue();
    this.endDay = new DayValue();
    this.startMonth = new MonthValue();
    this.endMonth = new MonthValue();
    this.startHour = new HoursValue();
    this.endHour = new HoursValue();

    const getTime = new Date(dayData);

    this.startHour.hour = 0;
    this.endHour.day = this.startHour.day = getTime.getDate();
    this.endDay.month = this.startDay.month = this.endHour.month = this.startHour.month =
      getTime.getMonth() + 1;
    this.endMonth.year = this.startMonth.year = this.endDay.year = this.startDay.year = this.endHour.year = this.startHour.year = getTime.getFullYear();

    this.endHour.hour = 23;

    this.startDay.day = 1;

    this.endDay.day = new Date(getTime.getFullYear(), getTime.getMonth() + 1, 0).getDate();

    this.startMonth.month = 1;

    this.endMonth.month = 12;
  }
}

/** 逐月统计 */
class MonthValue {
  /**
   * 年
   */
  public year: number;
  /**
   * 月
   */
  public month: number;
}

/** 逐日统计 */
class DayValue {
  /**
   * 年
   */
  public year: number;
  /**
   * 月
   */
  public month: number;
  /**
   * 日
   */
  public day: number;
}

/** 逐时统计 */
class HoursValue {
  /**
   * 年
   */
  public year: number;
  /**
   * 月
   */
  public month: number;
  /**
   * 日
   */
  public day: number;
  /**
   * 小时
   */
  public hour: number;
}

/** 时间选择器的 时分秒 */
export class TimeSelectValueModel {
  /**年*/
  public year: number;
  /**月*/
  public month: number;
  /**日*/
  public day: number;
  /**小时*/
  public hour: number;
}
