/**
 * 责任单位
 */
export  class AccountabilityUnitModel {
  /**
  * 单位id
  */
  public parentId: string;
  /**
  * 单位名称
  */
  public accountabilityUnit: string;
  constructor() {
    this.parentId = '';
    this.accountabilityUnit = '';
  }
}
