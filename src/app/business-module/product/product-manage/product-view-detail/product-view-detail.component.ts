import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {ProductForCommonService} from '../../../../core-module/api-service/product/product-for-common.service';
import {ProductApiService} from '../../share/service/product-api.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ProductTypeEnum} from '../../../../core-module/enum/product/product.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ProductInfoModel} from '../../../../core-module/model/product/product-info.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';

/**
 * 产品详情组件
 */
@Component({
  selector: 'app-product-view-detail',
  templateUrl: './product-view-detail.component.html',
  styleUrls: ['./product-view-detail.component.scss']
})
export class ProductViewDetailComponent implements OnInit {
  // 产品管理国际化
  public productLanguage: ProductLanguageInterface;
  // 产品id
  public productId: string = '';
  // 产品标识
  public typeFlag: ProductTypeEnum;
  // 产品标识枚举
  public productTypeEnum = ProductTypeEnum;
  // 设备标识
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 产品详情字段
  public productDetail: ProductInfoModel = new ProductInfoModel();

  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $productApiService: ProductApiService,
              private $productForCommonService: ProductForCommonService,
              private $active: ActivatedRoute) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.$active.queryParams.subscribe(params => {
      this.productId = params.productId;
      this.typeFlag = params.typeFlag;
    });
    this.queryProductDetailByProductId();
  }

  /**
   *  查询产品详情
   */
  private queryProductDetailByProductId(): void {
    this.$productForCommonService.getProductInfoById(this.productId).subscribe((res: ResultModel<ProductInfoModel>) => {
      if (res.code === ResultCodeEnum.success) {
        this.productDetail = res.data;
        // 查询使用次数
        this.queryInstallAmount();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 查询产品的使用数量
   */
  private queryInstallAmount(): void {
    if (!this.productDetail) {
      return;
    }
    const body: ProductInfoModel = new ProductInfoModel();
    body.typeFlag = this.productDetail.typeFlag;
    body.productModel = this.productDetail.productModel;
    body.softwareVersion = this.productDetail.softwareVersion;
    body.hardwareVersion = this.productDetail.hardwareVersion;
    body.supplier = this.productDetail.supplierName;
    this.$productApiService.getProductUseCountForFeign(body).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
         this.productDetail.quantity = res.data;
      }
    });
  }
}
