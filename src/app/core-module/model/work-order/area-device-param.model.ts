/**
 * 查询设施设备等接口入参
 */

export class AreaDeviceParamModel {
  /**
   *  区域id集合
   */
  public areaIdList?: string[];
  /**
   * 区域code集合
   */
  public areaCode?: string;
  public areaCodes?: string[];
  /**
   * 用户id
   */
  public userId?: string;
  /**
   * 设施类型
   */
  public deviceType?: string;
  public deviceTypes?: string[];
  public deviceTypeList?: string[];
  /**
   * 设施id集合
   */
  public deviceIdList?: string[];
  public deviceIds?: string[];
  /**
   * 设备类型
   */
  public equipmentTypes?: string[];
  /**
   * 筛选条件
   */
  public bizCondition?: BizCondition;
  /**
   * 工单id集合
   */
  public procIdList?: string[];
  /**
   * 工单类型
   */
  public procType?: string;
}

export class BizCondition {
  public level: string;
}
