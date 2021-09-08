/**
 * 告警确认和告警清除
 */
import {AlarmAffirmClearModel} from './alarm-affirm-clear.model';

export class AlarmClearAffirmModel {
  // 根告警
 public alarmCurrents: AlarmAffirmClearModel[];
 // 相关告警
  public alarmCorrelations: AlarmAffirmClearModel[];
  constructor(alarmCurrents, alarmCorrelations) {
    this.alarmCurrents = alarmCurrents;
    this.alarmCorrelations = alarmCorrelations;
  }
}
