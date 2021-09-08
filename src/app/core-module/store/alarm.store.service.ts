import {Injectable} from '@angular/core';
import {CommonUtil} from '../../shared-module/util/common-util';

@Injectable()
export class AlarmStoreService {
  private _alarm: any;   // 告警信息
  private _alarmObj;
  constructor() {
    this._alarm = [];
    this._alarmObj = {};
  }

  set alarm (data) {
    this._alarm =  CommonUtil.deepClone(data);
    this._alarm.forEach(item => {
      this._alarmObj[item.alarmLevelCode + ''] = item;
    });
  }

  get alarm () {
    return this._alarm;
  }

  getAlarmInfoByLevel(level) {
    const _level = level + '';
    return this._alarmObj[_level];
  }

  getAlarmColorByLevel(level) {
    const _level = level + '';
    if (this._alarmObj[_level] && this._alarmObj[_level]['color'] && this._alarmObj[_level]['color']['style']) {
      return this._alarmObj[_level]['color']['style'];
    } else {
      return null;
    }
  }

  getAlarmColorStyleObj() {
    const obj = {};
    for (const key in this._alarmObj) {
      if (this._alarmObj.hasOwnProperty(key) && this._alarmObj[key] &&
        this._alarmObj[key]['color'] &&
        this._alarmObj[key]['color']['style']) {
        obj[key] = this._alarmObj[key]['color']['style'];
      } else {
        obj[key] = null;
      }
    }
    return obj;
  }
}
