import {SupplierDataModel} from '../../model/supplier/supplier-data.model';

/**
 * 供应商
 */
export class SupplierForCommonUtil {

  /**
   * 供应商选择
   */
  public static selectSupplier(list: SupplierDataModel[], that): void {
    that.selectSupplierObject = {
      ids: list.map(v => v.supplierId) || [],
      name: list.map(v => v.supplierName).join(',') || '',
    };
    that.supplierFilterValue.filterValue = that.selectSupplierObject.ids.length > 0 ? that.selectSupplierObject.ids : null;
    that.supplierFilterValue.filterName = that.selectSupplierObject.name;
  }
}
