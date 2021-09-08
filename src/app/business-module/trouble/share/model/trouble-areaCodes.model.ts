/**
 * 批量指派责任单位区域集合
 */
export class TroubleAreaCodesModel {
  /**
   * 标识位
   */
  public flag: boolean;
  /**
   * 区域code集合
   */
  public areaCodes: string[];

  constructor() {
    this.flag = true;
    this.areaCodes = [];
  }
}
