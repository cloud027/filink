/**
 * 步骤条状态
 */
export class StepStatusModel {
  /**
   * 第一步
   */
  public first: boolean;
  /**
   * 第二步
   */
  public second: boolean;
  /**
   * 第三步
   */
  public three: boolean;
  constructor(firstStatus = false , secondStatus = true, threeStatus = false) {
    this.first = firstStatus;
    this.second = secondStatus;
    this.three = threeStatus;
  }
}
