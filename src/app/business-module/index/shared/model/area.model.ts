/**
 * 区域数据接口出参模型
 */
export class AreaModel {
  /**
   * 责任单位id
   */
  accountabilityUnit: string[];
  /**
   * 责任单位名称
   */
  accountabilityUnitName: string;
  /**
   * 详细地址
   */
  address: string;
  /**
   * 子类到父类的名称
   */
  areaAndPrentName: string;
  /**
   * 区域编码
   */
  areaCode: string;
  /**
   *  区域id
   */
  areaId: string;
  /**
   *  区域名称
   */
  areaName: string;
  /**
   *  区域数据子集
   */
  children: AreaModel[];
  /**
   * 市
   */
  cityName: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 创建人
   */
  createUser: string;
  /**
   * 区
   */
  districtName: string;
  /**
   * 是否有子区域
   */
  hasChild: boolean;
  /**
   * 是否有权限
   */
  hasPermissions: boolean;
  /**
   * 是否删除 默认为0
   */
  isDeleted: string;
  /**
   * 区域级别
   */
  level: number;
  /**
   * 所属区域id
   */
  parentId: string;
  /**
   * 所属区域名称
   */
  parentName: string;
  /**
   * 省
   */
  provinceName: string;
  /**
   * 备注
   */
  remarks: string;

  /**
   * 更新时间
   */
  updateTime: string;
  /**
   * 更新人
   */
  updateUser: string;
  /**
   * 是否选中
   */
  checked: boolean;
}

export class BizConditionModel {
  /**
   * 级别
   */
  level: number;
}


/**
 * 区域接口入参模型
 */
export class GetAreaModel {
  /**
   * 筛选条件
   */
  bizCondition: BizConditionModel = new BizConditionModel();

  constructor(bizConditionModel?: BizConditionModel) {
    this.bizCondition = bizConditionModel;
  }
}


/**
 * 区域数据递归模型
 */
export class AreaRecursiveModel {
  /**
   * 区域Id
   */
  id: string;
  /**
   * 区域code
   */
  areaCode: string;
  /**
   * 父级Id
   */
  pId: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 是否为父级
   */
  isParent: boolean; // 级别为1时，是父级
  /**
   * 是否选中
   */
  checked: boolean;
  /**
   * 是否可选
   */
  chkDisabled: boolean;
  children?: AreaRecursiveModel[];
}
