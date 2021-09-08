export class DepartmentListModel {
  /**
   * 地址
   */
  address: string;
  /**
   * 地区code
   */
  areaCodeList: any;
  /**
   * 地区id
   */
  areaIdList: any;
  /**
   * 子集单位列表
   */
  childDepartmentList: DepartmentListModel[];
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 创建人
   */
  createUser: string;
  /**
   * 是否超级管理员单位
   */
  defaultDept: number;
  /**
   * 是否删除
   */
  deleted: string;
  /**
   * 责任人
   */
  deptChargeUser: string;
  /**
   * 责任人id
   */
  deptChargeUserId: string;
  /**
   * 责任人code
   */
  deptCode: string;
  /**
   * 单位父id
   */
  deptFatherId: string;
  /**
   * 单位级别
   */
  deptLevel: string;
  /**
   * 单位名称
   */
  deptName: string;
  /**
   * 单位电话号码
   */
  deptPhoneNum: string;
  /**
   * 单位类型
   */
  deptType: string;
  /**
   * id
   */
  id: string;
  /**
   * 父节点
   */
  parentDepartment: string;
  /**
   * 父节点名称
   */
  parentDepartmentName: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 更新时间
   */
  updateTime: string;
  /**
   * 更新人
   */
  updateUser: string;
}
