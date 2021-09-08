/**
 * 库存管理接口路径常量
 */
import {SUPPLIER_SERVER} from '../../../../core-module/api-service/api-common.config';

export const SupplierServiceUrlConst = {
  // 新增供应商
  saveSupplier: `${SUPPLIER_SERVER}/supplier/saveSupplier`,
  // 修改供应商
  editSupplier: `${SUPPLIER_SERVER}/supplier/editSupplier`,
  // 根据id获取单个供应商信息
  querySupplierBySupplierId: `${SUPPLIER_SERVER}/supplier/querySupplierBySupplierId`,
  // 单个、批量删除供应商信息
  batchDeleteSupplierByIds: `${SUPPLIER_SERVER}/supplier/batchDeleteSupplierByIds`,
  // 供应商导出
  exportSupplierList: `${SUPPLIER_SERVER}/supplier/exportSupplierList`,
  // 检查供应商名称是否唯一
  checkExitsSupplierByName: `${SUPPLIER_SERVER}/supplier/checkExitsSupplierByName`,
};
