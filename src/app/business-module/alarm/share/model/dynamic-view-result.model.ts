/**
 * 动态规则-查看结果
 */
import {SelectModel} from '../../../../shared-module/model/select.model';

export class DynamicViewResultModel {
  /**
   * 规则id
   */
  public id?: string;
  /**
   * 根原因告警
   */
  public rootAlarmName?: string;
  /**
   * 根告警动作
   */
  /**
   * 相关告警
   */
  public relativityAlarmName?: string;
  /**
   * 相关告警动作
   */
  /**
   * 状态
   */
  public status?: string;
  /**
   * 分析周期
   */
  public analysisCycle?: string;
  /**
   * 规则条件
   */
  public ruleCondition?: string;
  public ruleConditionName?: string | SelectModel[];
  /**
   * 保存
   */
  public isSave?: string;
  public storedStatic?: string;

  /**
   * 是否保存
   */
  public storedStaticName?: string;
}
