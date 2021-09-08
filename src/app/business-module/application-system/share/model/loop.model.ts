/**
 * 回路列表模型
 */
export class LoopModel {
  /**
   * 回路id
   */
  public loopId: string;
  /**
   * 回路名称
   */
  public loopName: string;
  /**
   * 回路编码
   */
  public loopCode?: string;
  /**
   * 回路状态
   */
  public loopStatus?: string;
  /**
   * 控制对象
   */
  public controlledObject?: string;
  /**
   * 所属控制箱
   */
  public distributionBoxName?: string;
  /**
   * 所属集装箱
   */
  public centralizedControlName?: string;
  /**
   * 备注
   */
  public remark?: string;
  /**
   * 所属集控id
   */
  public centralizedControlId?: string;
  /**
   * 选中状态
   */
  checked?: boolean;
}
