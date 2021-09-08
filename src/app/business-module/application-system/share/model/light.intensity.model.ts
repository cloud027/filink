import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {StrategyStatusEnum, SwitchStatus} from '../enum/policy.enum';
import {SunriseOrSunsetEnum} from '../enum/sunrise-or-sunset.enum';

/**
 * 光照强度
 */
export class LightIntensityModel {
  /**
   * 策略id
   */
  public strategyId?: string;
  /**
   * 开始时间
   */
  public startTime: number;
  /**
   * 结束时间
   */
  public endTime: number;
  /**
   * 光照id
   */
  public sensor: string;
  /**
   * 光照强度
   */
  public sensorName: string;
  /**
   * 光照强度值
   */
  public lightIntensity: number;
  /**
   * 光照强度操作符
   */
  public operator: OperatorEnum;
  /**
   * 开/关
   */
  public switchLight: SwitchStatus;
  /**
   * 强度值
   */
  public light: number;
  /**
   * 事件类型
   */
  public refType: StrategyStatusEnum;
  /**
   * 告警id
   */
  public alarmId: string;
  /**
   * 告警名称
   */
  public refObjectName: string;
  /**
   * 时间id
   */
  public eventId: string;
  /**
   * 日出或者日落
   */
  public sunriseOrSunset: SunriseOrSunsetEnum;
  /**
   * 这条数据id
   */
  public instructId?: string;

  constructor(params?) {
    this.startTime = params.startTime || 0;
    this.endTime = params.endTime || 0;
    this.sensor = params.sensor || '';
    this.sensorName = params.sensorName || '';
    this.lightIntensity = null;
    this.switchLight = null;
    this.light = null;
    this.refType = params.refType || '';
    this.alarmId = params.alarmId || '';
    this.eventId = params.eventId || '';
    this.operator = OperatorEnum.eq;
    this.sunriseOrSunset = SunriseOrSunsetEnum.custom;
  }
}
