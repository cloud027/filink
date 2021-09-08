import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {NzI18nService} from 'ng-zorro-antd';
import {ProductApiService} from '../../../share/service/product-api.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ProductLanguageInterface} from '../../../../../../assets/i18n/product/product.language.interface';
import {ActivatedRoute} from '@angular/router';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ProductFileTypeEnum} from '../../../../../core-module/enum/product/product.enum';

/**
 * 产品网关图片上传
 */
@Component({
  selector: 'app-product-gateway-upload',
  templateUrl: './product-gateway-upload.component.html',
  styleUrls: []
})
export class ProductGatewayUploadComponent implements OnInit {
  // 产品id
  @Input()  public productId: string;
  // 上传文件之后抛出事件
  @Output() public afterUploadGateway = new EventEmitter<boolean>();
  // 产品管理国际化
  public productLanguage: ProductLanguageInterface;
  // 上传弹框是否展示
  public isVisible: boolean = false;
  // 上传文件类型
  public uploadFileType = ProductFileTypeEnum;
  // 页面是否加载
  public pageLoading: boolean = false;

  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $active: ActivatedRoute,
              private $productApiService: ProductApiService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    // 产品国际化词条获取
   this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
  }

  /**
   * 点击上传文件
   */
  public onClickUpload(): void {
    this.isVisible = true;
  }
  /**
   * 文件校验成功之后执行后台的接口
   */
  public onClickDoUpload(fileList: File[]): void {
    if (!_.isEmpty(fileList)) {
      this.pageLoading = true;
      const formData = new FormData();
      fileList.forEach(item => {
        formData.append('files', item);
      });
      formData.append('productId', this.productId);
      this.$productApiService.uploadGatewayImage(formData).subscribe((res: ResultModel<string>) => {
        this.pageLoading = false;
        if (res.code === ResultCodeEnum.success) {
          this.$message.success(this.productLanguage.uploadGatewayImagSuccess);
          this.isVisible = false;
          this.pageLoading = false;
          this.afterUploadGateway.emit(true);
        } else {
          this.$message.error(res.msg);
        }
      }, () =>  this.pageLoading = false);
    }
  }
}
