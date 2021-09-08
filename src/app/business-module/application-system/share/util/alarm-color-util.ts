import {getEquipmentStatus} from './application.util';
import {EquipmentStatusEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';

export class AlarmColorUtil {
  public static alarmDefaultLevel(alarmLanguage) {
    return [
      {id: '1', background: '#e61017', name: alarmLanguage.urgent},
      {id: '2', background: '#ff6600', name: alarmLanguage.main},
      {id: '3', background: '#f1c620', name: alarmLanguage.secondary},
      {id: '4', background: '#58c1f0', name: alarmLanguage.prompt}
    ];
  }

  public static alarmFmt(data, alarmLanguage, $nzI18n) {
    data.forEach(item => {
      const name = AlarmForCommonUtil.translateAlarmNameByCode($nzI18n, item.alarmCode);
      if (name) {
        item.alarmName = name;
      }
      const alarm = AlarmColorUtil.alarmDefaultLevel(alarmLanguage).find(value => value.id === item.alarmLevel);
      const alarmDefault = AlarmColorUtil.alarmDefaultLevel(alarmLanguage).find(value => value.id === item.alarmDefaultLevel);
      item.styleColor = {'background': alarm.background};
      item.languageName = alarm.name;
      item.defaultStyle = {'background': alarmDefault.background};
      item.defaultName = alarmDefault.name;
    });
  }

  public static alarmStatistics($nzI18n) {
    return [
      {
        num: EquipmentStatusEnum.unSet,
        name: getEquipmentStatus($nzI18n, EquipmentStatusEnum.unSet),
        value: 0,
      },
      {
        num: EquipmentStatusEnum.alarm,
        name: getEquipmentStatus($nzI18n, EquipmentStatusEnum.alarm),
        value: 0,
      },
      {
        num: EquipmentStatusEnum.offline,
        name: getEquipmentStatus($nzI18n, EquipmentStatusEnum.offline),
        value: 0,
      },
      {
        num: EquipmentStatusEnum.online,
        name: getEquipmentStatus($nzI18n, EquipmentStatusEnum.online),
        value: 0,
      },
      {
        num: EquipmentStatusEnum.outOfContact,
        name: getEquipmentStatus($nzI18n, EquipmentStatusEnum.outOfContact),
        value: 0,
      },
      {
        num: EquipmentStatusEnum.break,
        name: getEquipmentStatus($nzI18n, EquipmentStatusEnum.break),
        value: 0,
      },
      {
        num: EquipmentStatusEnum.dismantled,
        name: getEquipmentStatus($nzI18n, EquipmentStatusEnum.dismantled),
        value: 0,
      },
    ];
  }
}
