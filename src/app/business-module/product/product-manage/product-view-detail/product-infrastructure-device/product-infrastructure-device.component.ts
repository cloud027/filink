import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {ProductApiService} from '../../../share/service/product-api.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {NO_IMG} from '../../../../../core-module/const/common.const';
import {ProductLanguageInterface} from '../../../../../../assets/i18n/product/product.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {DeviceChartUntil} from '../../../../../shared-module/util/device-chart-until';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ProductInfoModel} from '../../../../../core-module/model/product/product-info.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ProductTypeEnum, ProductUnitEnum} from '../../../../../core-module/enum/product/product.enum';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {ProductPoleImageInfoModel} from '../../../../../core-module/model/product/product-pole-image-info.model';

/**
 *  产品-设施基础信息
 */
@Component({
  selector: 'app-product-infrastructure-device',
  templateUrl: './product-infrastructure-device.component.html',
  styleUrls: ['./product-infrastructure-device.component.scss']
})
export class ProductInfrastructureDeviceComponent implements OnInit {
  // 产品id
  @Input() public productId: string;
  // 产品详情数据
  @Input() public productDetail: ProductInfoModel = new ProductInfoModel();
  // 预览数据信息
  public previewDataDetail: ProductPoleImageInfoModel = new ProductPoleImageInfoModel();
  // 图片路径
  public productImgUrl: string = NO_IMG;
  // 故障率统计
  public breakRateOption = {};
  // 产品国际化
  public productLanguage: ProductLanguageInterface;
  // 是否显示预览弹框
  public showModal: boolean = false;
  // 计量单位枚举
  public productUnit = ProductUnitEnum;
  //  产品类型枚举
  public productTypeEnum = ProductTypeEnum;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 国际化词条
  public language = LanguageEnum;

  constructor(private  $nzI18n: NzI18nService,
              private $productApiService: ProductApiService,
              private $message: FiLinkModalService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    // 初始化故障率
    this.breakRateOption = DeviceChartUntil.setBreakRateChartOption(this.productLanguage, 0);
    // 设施图片路径获取
    if (this.productDetail && this.productDetail.fileFullPath) {
      this.productImgUrl = this.productDetail.fileFullPath;
    }
  }

  /**
   * 预览网关或者是智慧杆
   */
  public onClickPreview(): void {
    this.queryPreviewData();
  }

  /**
   * 查询杆体图
   */
  private queryPreviewData(): void {
    this.$productApiService.poleImageInfo(this.productId).subscribe((res: ResultModel<ProductPoleImageInfoModel>) => {
      if (res.code === ResultCodeEnum.success) {
        this.previewDataDetail = res.data;
        if (this.previewDataDetail && !_.isEmpty(this.previewDataDetail.pointConfigList)) {
          this.previewDataDetail.pointConfigList = _.orderBy(this.previewDataDetail.pointConfigList, 'configSort');
          this.previewDataDetail.pointConfigList.forEach(item => {
            item.selectEquipment = item.selectEquipment.split(',');
          });
        }
        this.showModal = true;
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
