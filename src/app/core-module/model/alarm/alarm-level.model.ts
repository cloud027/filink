import {AlarmLevelEnum} from '../../enum/alarm/alarm-level.enum';
import {AlarmSoundEnum} from '../../enum/alarm/alarm-sound.enum';
import {AlarmLevelColorModel} from './alarm-level-color.model';

/**
 * 查询告警等级模型
 */
export class AlarmLevelModel {
  /**
   * 告警级别code码
   */
  public alarmLevelCode: AlarmLevelEnum;
  /**
   * 告警级别名称
   */
  public alarmLevelName: string;
  /**
   * 告警颜色值
   */
  public alarmLevelColor: string;
  /**
   * 告警提示音
   */
  public alarmLevelSound: string;
  /**
   * 告警设置id
   */
  public id: string;
  /**
   * 是否有提示音
   */
  public isPlay: AlarmSoundEnum;
  /**
   * 播放次数
   */
  public playCount: number;
  /**
   * 告警颜色
   */
  public color: AlarmLevelColorModel;
}
