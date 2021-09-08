/**
 * 供应商数据模型
 */
export class SupplierDataModel {
  /**
   * 主键id
   */
  supplierId: string;
  /**
   * 供应商名称
   */
  supplierName: string;
  /**
   * 供应商编号
   */
  supplierNum: string;
  /**
   * 供应商基础信息
   */
  supplierBasicInformation: string;
  /**
   * 供应商资质
   */
  supplierAptitudes: string;
  /**
   * 公司地址
   */
  address: string;
  /**
   * 联系人
   */
  attn: string;
  /**
   * 联系人电话
   */
  attnPhone: string;
  /**
   * 国家电话号码前缀
   */
  countryCode: string;
  /**
   * 创建人
   */
  createUser: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 更新人员
   */
  updateUser: string;
  /**
   * 更新时间
   */
  updateTime: string;
  /**
   * 备注
   */
  remarks: string;
  /**
   * 是否被选中
   */
  checked?: boolean;
}
