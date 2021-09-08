/**
 * 设施设备列表筛选条件模型
 */
export class FacilityConditionModel {
  /**
   *  区域ID
   */
  public areaId: string[];
  /**
   *  设施区域ID集合
   */
  public areaIdList: string[];
  /**
   *  设备区域ID集合
   */
  public areaCodeList: string[];
  /**
   * 项目ID
   */
  public projectId: string[];
  /**
   * 设施类型
   */
  public device: string[];
  /**
   * 设备类型
   */
  public equipment: string[];
  /**
   * 分组ID
   */
  public groupId: string[];
  /**
   * 租聘方ID
   */
  public rentId: string[];
}

/**
 * 分组数据模型
 */
export class SelectGroupItemModel {
  /**
   *  label
   */
  public label: string;
  /**
   *  value
   */
  public value: string;
  /**
   * check
   */
  public check: boolean;
}

/**
 * 分组接口查询数据模型
 */
export class SelectGroupDataModel {
  /**
   *  分组ID
   */
  public groupId: string;
  /**
   *  分组名称
   */
  public groupName: string;
}

