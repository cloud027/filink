/**
 * 单位
 */
export class DepartmentUnitModel {
  /**
   * 地址
   */
  public address?: string;
  /**
   * 区域编码
   */
  public areaCodeList?: string;
  /**
   * 区域id
   */
  public areaIdList?: string;
  /**
   * 子集单位
   */
  public childDepartmentList?: DepartmentUnitModel[];
  /**
   * 树形单位子集
   */
  public children?: [];
  /**
   * 创建时间
   */
  public createTime?: string;
  /**
   * 创建人
   */
  public createUser?: string;
  /**
   * 删除
   */
  public deleted?: string;
  /**
   * 责任人
   */
  public deptChargeUser?: string;
  /**
   * 责任人id
   */
  public deptChargeUserId?: string;
  /**
   * 单位编码
   */
  public deptCode?: string;
  /**
   * 父级单位id
   */
  public deptFatherId?: string;
  /**
   * 单位等级
   */
  public deptLevel?: string;
  /**
   * 单位名称
   */
  public deptName?: string;
  /**
   * 单位电话
   */
  public deptPhoneNum?: string;
  /**
   * 单位类型
   */
  public deptType?: string;
  /**
   * 单位id
   */
  public id?: string;
  /**
   * 父级单位id
   */
  public parentDepartment?: string;
  /**
   * 父级单位名称
   */
  public parentDepartmentName?: string;
  /**
   * 备注
   */
  public remark?: string;
  /**
   * 更新时间
   */
  public updateTime?: string;
  /**
   * 更新人员
   */
  public updateUser?: string;
  /**
   * 单位id
   */
  public accountabilityDept?: string;
  /**
   * 单位名称
   */
  public accountabilityDeptName?: string;
  /**
   * 全选
   */
  public checked?: boolean;
  /**
   * value值
   */
  public value?: boolean;
  /**
   * 所选值
   */
  public unitRadioValue?: boolean;
  /**
   * 名称
   */
  public label?: string;
  /**
   * 树选择器使用时，控制节点不能点击
   */
  public chkDisabled?: boolean;
  /**
   * 单位id
   */
  public inspectionTaskDeptId?: string;
}
