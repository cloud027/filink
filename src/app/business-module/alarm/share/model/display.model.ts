export class DisplayModel {
  /**
   * 备注弹出框
   */
  public remarkTable: boolean;
  /**
   * 模板查询
   */
  public templateTable: boolean;
  /**
   * nameTable
   */
  public nameTable: boolean;
  /**
   * 诊断确认
   */
  public diagnoseSet: boolean;

  constructor() {
    this.diagnoseSet = false;
    this.nameTable = false;
    this.templateTable = false;
    this.remarkTable = false;
  }

}
