import {Component, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';

/**
 * 产品网关
 */
@Component({
  selector: 'app-product-gateway',
  templateUrl: './product-gateway.component.html',
  styleUrls: []
})
export class ProductGatewayComponent implements OnInit {
  // 页面标题
  public pageTitle: string;
  // 产品国际化
  public productLanguage: ProductLanguageInterface;
  // 页面操作类型
  public pageOperateType: OperateTypeEnum = OperateTypeEnum.add;
  // 操作枚举
  public operateEnum = OperateTypeEnum;
  // 产品id
  public productId: string;

  /**
   * 构造器实例化
   */
  constructor(private $nzI18n: NzI18nService,
              private $ruleUtil: RuleUtil,
              private $router: Router,
              private $active: ActivatedRoute) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    // 获取产品id
    this.$active.queryParams.subscribe(params => {
      this.productId = params.productId;
      this.pageOperateType = params.operateType;
    });
    this.pageTitle = this.pageOperateType === OperateTypeEnum.update ? this.productLanguage.updateGatewayImg : this.productLanguage.addGatewayImg;
  }

  /**
   * 上传文件之后
   */
  public afterUploadGateway(event: boolean): void {
    this.pageOperateType = OperateTypeEnum.update;
  }
}
