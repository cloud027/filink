import {Component, OnInit} from '@angular/core';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ProductPoleImageInfoModel} from '../../../../core-module/model/product/product-pole-image-info.model';

/**
 * 智慧杆图组件
 */
@Component({
  selector: 'app-product-wisdom',
  templateUrl: './product-wisdom.component.html',
  styleUrls: []
})
export class ProductWisdomComponent implements OnInit {
  // 操作类型
  public operateType: OperateTypeEnum = OperateTypeEnum.add;
  // 操作类型枚举
  public operateTypeEnum = OperateTypeEnum;
  // 页面标题
  public pageTitle: string;
  // 产品管理国际化
  public productLanguage: ProductLanguageInterface;
  // 产品id
  public productId: string;
  // 预览数据
  public previewData: ProductPoleImageInfoModel;

  /**
   * 构造器实例化
   */
  constructor(private $nzI18n: NzI18nService,
              private $ruleUtil: RuleUtil,
              private $router: Router,
              private $active: ActivatedRoute) {
  }

  /**
   * 页面初始化
   */
  public ngOnInit(): void {
    // 获取参数
    this.$active.queryParams.subscribe(params => {
      this.productId = params.productId;
      this.operateType = params.operateType;
    });
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.pageTitle = this.operateType === OperateTypeEnum.update ? this.productLanguage.updateWisdomImg : this.productLanguage.addWisdomImg;
  }

  /**
   * 文件上传完成之后
   */
  public onAfterUpload(event: boolean): void {
    this.operateType = OperateTypeEnum.update;
  }

  /**
   * 预览杆型图
   */
  public onPreview(event: ProductPoleImageInfoModel): void {
    if (event) {
      this.operateType = OperateTypeEnum.preview;
      this.previewData = event;
    }
  }

  /**
   * 点位配置
   */
  public OnPositionConfig(event: boolean): void {
    this.operateType = OperateTypeEnum.update;
  }
}
