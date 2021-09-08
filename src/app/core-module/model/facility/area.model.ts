/**
 * 区域数据模型.
 */
export class AreaModel {
  /**
   * 区域id
   */
  public areaId: string;
  /**
   * 区域级别
   */
  public level: string;
  /**
   * 区域code
   */
  public areaCode: string;
  /**
   * 区域名称
   */
  public areaName: string;
  /**
   * 省份名称
   */
  public provinceName: string;
  /**
   * 地市名称
   */
  public cityName: string;
  /**
   * 区县名称
   */
  public districtName: string;
  /**
   * 详细地址
   */
  public address: string;
  /**
   * 管理设施
   */
  public managementFacilities: string;
  /**
   * 单位
   */
  public accountabilityUnit: any[];
  /**
   * 备注
   */
  public remarks: string;
  /**
   * 创建时间
   */
  public createTime: string;
  /**
   * 父节点 id
   */
  public parentId: string;
  /**
   * 父节点名称
   */
  public parentName: string;
  /**
   * 更新时间
   */
  public updateTime: string;
  /**
   * 子节点
   */
  public children: AreaModel[];
  /**
   * 是否有子节点
   */
  public hasChild: boolean;
  /**
   * 单位名称
   */
  public accountabilityUnitName: string;
  /**
   * 区域id 转化为树结构使用
   */
  public id?: string;
  /**
   * 区域id 转化为树结构使用
   */
  public value?: string;
  /**
   * 树上的节点的选中状态
   */
  public checked?: boolean;
  /**
   * 区域等级
   */
  public areaLevel?: any;

  constructor() {
    this.accountabilityUnit = [];
  }
}
