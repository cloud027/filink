import {Pipe, PipeTransform} from '@angular/core';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {ProductTypeEnum} from '../../../../core-module/enum/product/product.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';

/**
 * 产品类型翻译管道
 */
@Pipe({
  name: 'productTypeTranslate'
})
export class ProductTypeTranslate implements PipeTransform {
  // 构造器
  constructor(private $nzI18n: NzI18nService) {
  }

  transform(value: EquipmentTypeEnum | DeviceTypeEnum, typeFlag: ProductTypeEnum): any {
    let label = '';
    if (value && typeFlag) {
      if (typeFlag === ProductTypeEnum.equipment) {
        label = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, value) as string;
      } else if (typeFlag === ProductTypeEnum.facility) {
        label = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, value) as string;
      } else if (typeFlag === ProductTypeEnum.other) {
        label = CommonUtil.codeTranslate(ProductTypeEnum, this.$nzI18n, value , 'product') as string;
      } else {
        label = '';
      }
    }
    return label;
  }
}
