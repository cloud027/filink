/**
 * 应用策略信息数据模型
 */
import {ExecStatusEnum, ExecTypeEnum, PolicyStatusEnum} from '../../enum/application-system/policy.enum';

export class ApplicationPolicyListModel {
  /**
   *  策略id
   */
  public strategyId?: string;
  /**
   * 策略名称
   */
  public strategyName: string;

  /**
   *  执行状态
   */
  public execStatus: ExecStatusEnum;

  /**
   * 状态
   */
  public strategyStatus: PolicyStatusEnum;

  /**
   * 开始时间
   */
  public effectivePeriodStart: number;

  /**
   * 结束时间
   */
  public effectivePeriodEnd: number;
  /**
   * 执行周期
   */
  public execTime: ExecTypeEnum;
}
