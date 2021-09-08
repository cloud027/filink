import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ProductLanguageInterface} from '../../../../../../assets/i18n/product/product.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ProductInfoModel} from '../../../../../core-module/model/product/product-info.model';
import {ProductUtil} from '../../../share/util/product.util';
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';

/**
 *  产品设备专有信息
 */
@Component({
  selector: 'app-product-equipment-info',
  templateUrl: './product-equipment-information.component.html',
  styleUrls: ['./product-equipment-information.component.scss']
})
export class ProductEquipmentInformationComponent implements OnInit {
  // 产品详情
  @Input() productDetail: ProductInfoModel = new ProductInfoModel();
  // 国际化词条
  public productLanguage: ProductLanguageInterface;
  // 设备信息  每一种设备对象不一样此处用any
  public equipmentInfo: any;
  // 设备字段数组
  public equipmentKeys: string[] = [];

  constructor(private  $nzI18n: NzI18nService, private $ruleUtil: RuleUtil) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    if (this.productDetail && this.productDetail.equipmentInfo) {
      this.equipmentInfo = JSON.parse(this.productDetail.equipmentInfo);
      // 改成使用前端字段，避免后台导入的字段错乱、不全
      const arr = ProductUtil.getEquipmentColumns(this.productDetail.typeCode as EquipmentTypeEnum, this.productLanguage, this.$ruleUtil);
      this.equipmentKeys = arr.map(item => item.key);
    }
  }
}
