/**
 * 静态相关性规则
 */
import {AlarmDisableStatusEnum} from '../enum/alarm.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';

export class AnalysisCorrelationRuleModel {
  /**
   * id
   */
  public id: string;
  /**
   * 根原因告警
   */
  public rootAlarmName: string;
  /**
   * 根原因告警动作
   */
  public rootAlarmAction: string;
  /**
   * 相关告警
   */
  public relevanceAlarmName: string[];
  /**
   * 相关告警动作
   */
  public relevanceAlarmAction: SelectModel | string;
  /**
   * 状态
   */
  public status: AlarmDisableStatusEnum;
  /**
   * 分析周期
   */
  public analysePeriod: number;
  /**
   * 禁启名称
   */
  public statusName?: SelectModel[] | string;
  /**
   * 禁启用加载
   */
  public clicked: boolean;
  /**
   * 禁启用权限
   */
  public appAccessPermission: string;
}
