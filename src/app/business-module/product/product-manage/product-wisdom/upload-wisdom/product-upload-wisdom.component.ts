import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ProductApiService} from '../../../share/service/product-api.service';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ProductLanguageInterface} from '../../../../../../assets/i18n/product/product.language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ProductPoleImageInfoModel} from '../../../../../core-module/model/product/product-pole-image-info.model';
import {ProductFileTypeEnum} from '../../../../../core-module/enum/product/product.enum';
import {BatchUploadFileComponent} from '../../../../../shared-module/component/business-component/batch-upload-file/batch-upload-file.component';

/**
 * 上传智慧杆组件
 */
@Component({
  selector: 'app-upload-wisdom',
  templateUrl: './product-upload-wisdom.component.html',
  styleUrls: []
})
export class ProductUploadWisdomComponent implements OnInit {
  // 上传组件
  @ViewChild('batchUploadTemp') batchUploadTemp: BatchUploadFileComponent;
  // 上传文件之后抛出事件
  @Output() public afterUpload = new EventEmitter<boolean>();
  // 产品国际化
  public productLanguage: ProductLanguageInterface;
  // 是否展示
  public isVisible: boolean = false;
  // 产品id
  public productId: string;
  // 上传文件类型
  public uploadFileTypeEnum = ProductFileTypeEnum;
  //  页面是否加载状态
  public pageLoading: boolean = false;

  /**
   * 构造器实例化
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
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    // 获取参数
    this.$active.queryParams.subscribe(params => {
      this.productId = params.productId;
    });
  }

  /**
   * 点击上传文件事件
   */
  public onClickUpload(): void {
    this.isVisible = true;
  }

  /**
   * 执行上传
   */
  public onClickDoUpload(event: File[]): void {
    if (!_.isEmpty(event)) {
      this.pageLoading = true;
      const formData = new FormData();
      formData.append('productId', this.productId);
      event.forEach(v => {
        formData.append('files', v);
      });
      // 调用后台的上传接口
      this.$productApiService.uploadPoleImage(formData).subscribe((res: ResultModel<ProductPoleImageInfoModel>) => {
        if (res.code === ResultCodeEnum.success) {
          this.isVisible = false;
          this.pageLoading = false;
          this.$message.success(this.productLanguage.filesUploadSuccess);
          this.afterUpload.emit(true);
        } else {
          this.$message.error(res.msg);
          this.pageLoading = false;
        }
        this.batchUploadTemp.fileListRec = [];
      }, () => {
        this.pageLoading = false;
        this.batchUploadTemp.fileListRec = [];
      });
    }
  }
}
