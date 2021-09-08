/**
 * Created by xiaoconghu on 2019/3/25.
 * 时间格式化枚举
 */
export enum DateFormatStringEnum {
  DATE_FORMAT_STRING = 'yyyy/MM/dd HH:mm:ss',
  DATE_FORMAT_STRING_SIMPLE = 'yyyy/MM/dd',
  dateNumber = 'yyyyMMdd',
  dateTime = 'yyyy-MM-dd hh:mm:ss',
  // 24小时制
  dateTimeType = 'yyyy-MM-dd HH:mm:ss',
  date= 'yyyy-MM-dd',
  // 时间格式
  timeFormat = 'HH:mm'
}

export enum TimeType {
  LOCAL = 'local',
  UTC = 'universal',
}
