/**
 * 新增静态相关性告警分析
 */
import {CorrelationAlarmActionEnum, rootAlarmActionEnum} from '../enum/alarm.enum';
import {RuleConditionModel} from './rule-condition.model';

export class CorrelationAnalysisModel {
  /**
   * 根原因告警
   */
  public rootAlarmNameId: string;
  /**
   * 根原因告警名称
   */
  public rootAlarmName: string;
  /**
   * 根原因告警动作
   */
  public rootAlarmAction: rootAlarmActionEnum;
  /**
   * 相关告警
   */
  public relevanceAlarmNameIdList: string[];
  /**
   * 相关告警动作
   */
  public relevanceAlarmAction: CorrelationAlarmActionEnum;
  /**
   * 条件预览
   */
  public staticRelevanceRuleConditionBeanList: RuleConditionModel[];
  /**
   * 分析周期
   */
  public analyzePeriod: number;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 规则条件
   */
  public relevanceAlarmDtoList: RuleConditionModel[];
  /**
   * 任务规则id
   */
  public dynamicCorrelationRulesId?: string;
  /**
   * 规则名称自动生成
   */
  public staticRelevanceRuleName?: string;
  public id?: string;
}
