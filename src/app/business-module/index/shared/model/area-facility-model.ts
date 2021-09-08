/**
 * 区域下设施详情接口模型
 */
export class FilterConditions {
  /**
   *  设施区域ID集合
   */
  public area: any[];
  /**
   *  设施区域ID集合
   */
  public device: any[];
  /**
   *  设施区域ID集合
   */
  public group: any[];
  public projectId?: any[];
}

export class AreaFacilityDataModel {
  /**
   *  区域ID
   */
  public polymerizationType: string;
  /**
   *  当前窗口经纬度
   */
  public points: any[];
  /**
   *  设施区域ID集合
   */
  public filterConditions: any;

  constructor() {
    this.filterConditions = new FilterConditions();
  }
}

export class AreaFacilityModel {
  /**
   *  区域IDenter
   */
  public polymerizationType: string;
  /**
   *  设施区域ID集合
   */
  public codeList: any[];
  /**
   *  设施区域ID集合
   */
  public filterConditions: any;
  /**
   *  当前窗口经纬度
   */
  public points: any[];

  constructor() {
    this.filterConditions = new FilterConditions();
  }
}
