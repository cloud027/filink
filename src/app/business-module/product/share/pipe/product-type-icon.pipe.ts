import {Pipe, PipeTransform} from '@angular/core';
import {ProductTypeEnum} from '../../../../core-module/enum/product/product.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';

/**
 * 产品类型图标管道
 */
@Pipe({
  name: 'productIcon'
})
export class ProductIcon implements PipeTransform {
  transform(value: any, typeFlag: ProductTypeEnum): any {
    let iconStyle = '';
    if (value && typeFlag) {
      if (typeFlag === ProductTypeEnum.facility) {
        iconStyle = CommonUtil.getFacilityIConClass(value.typeCode);
      } else if (typeFlag === ProductTypeEnum.equipment) {
        iconStyle = CommonUtil.getEquipmentTypeIcon(value);
      }
    }
    return iconStyle;
  }
}
