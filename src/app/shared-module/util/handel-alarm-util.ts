import {LanguageEnum} from '../enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from '../../../assets/i18n/alarm/alarm-language.interface';
import {ResultModel} from '../model/result.model';
import {Injectable} from '@angular/core';
import {QueryConditionModel} from '../model/query-condition.model';
import {AlarmLevelStatisticsModel} from '../../core-module/model/alarm/alarm-level-statistics.model';
import {AlarmLevelColorEnum} from '../../core-module/enum/alarm/alarm-level-color.enum';

/**
 * 告警统计数据处理
 */
@Injectable()
export class HandelAlarmUtil {
  // 告警国际化
  public alarmLanguage: AlarmLanguageInterface;
  // 告警等级查询条件
  private queryCondition: QueryConditionModel;

  constructor(
    private $nzI18n: NzI18nService,
  ) {
  }

  /**
   * 转换告警级别数据
   */
  public handleAlarmLevelData(result: ResultModel<AlarmLevelStatisticsModel>): { color, data } {
    // 查询告警等级
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    const color = [AlarmLevelColorEnum.secondAlarm,
      AlarmLevelColorEnum.promptAlarm,
      AlarmLevelColorEnum.mainAlarm,
      AlarmLevelColorEnum.urgentAlarm];
    const data = [
      // 次要
      {value: result.data.minorAlarmCount, name: this.alarmLanguage.secondary},
      // 提示
      {value: result.data.hintAlarmCount, name: this.alarmLanguage.prompt},
      // 主要
      {value: result.data.mainAlarmCount, name: this.alarmLanguage.main},
      // 紧急
      {value: result.data.urgentAlarmCount, name: this.alarmLanguage.urgent},
    ];
    return {color, data};
  }

  /**
   * 告警增量统计数据进行排序
   */
  public sortAlarmData(data): Array<any> {
    data = data.sort((a, b) => {
      if (+new Date(a.groupTime) - (+new Date(b.groupTime)) > 0) {
        return 1;
      } else {
        return -1;
      }
    });
    const seriesData = [];
    data.forEach(item => {
      seriesData.push([item.groupTime, item.count]);
    });
    return seriesData;
  }
}
