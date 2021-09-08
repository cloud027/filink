import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {ImageViewService} from '../../../../../shared-module/service/picture-view/image-view.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {Router} from '@angular/router';
import {BusinessFacilityService} from '../../../../../shared-module/service/business-facility/business-facility.service';
import {ObjectTypeEnum} from '../../../../../core-module/enum/facility/object-type.enum';
import {BINARY_SYSTEM_CONST, PICTURE_NUM_CONST} from '../../../../../core-module/const/common.const';
import {PictureListModel} from '../../../../../core-module/model/picture/picture-list.model';
import {QueryRecentlyPicModel} from '../../../../../core-module/model/picture/query-recently-pic.model';

/**
 * 设施详情查看图片板块
 */
@Component({
  selector: 'app-facility-img-view',
  templateUrl: './facility-img-view.component.html',
  styleUrls: ['./facility-img-view.component.scss']
})
export class FacilityImgViewComponent implements OnInit {
  // 设施id
  @Input()
  public deviceId: string;
  // 设施图标信息
  public devicePicInfo: PictureListModel[];
  // 设施语言包
  public language: FacilityLanguageInterface;

  constructor(private $facilityForCommon: FacilityForCommonService,
              private $imageViewService: ImageViewService,
              private $router: Router,
              private $i18n: NzI18nService,
              private $businessFacilityService: BusinessFacilityService) {
  }


  public ngOnInit(): void {
    this.language = this.$i18n.getLocaleData(LanguageEnum.facility);
    this.getDevicePic();
    // 订阅上传图片基本操作,用于更新图片
    this.$businessFacilityService.eventEmit.subscribe(() => {
      this.getDevicePic();
    });
  }

  /**
   * 获取设施图片
   */
  private getDevicePic(): void {
    const body: QueryRecentlyPicModel = new QueryRecentlyPicModel(this.deviceId, PICTURE_NUM_CONST, null, null, ObjectTypeEnum.facility);
    this.$facilityForCommon.getPicDetailForNew(body).subscribe((result: ResultModel<PictureListModel[]>) => {
      if (result.code === ResultCodeEnum.success && !_.isEmpty(result.data)) {
        this.devicePicInfo = result.data;
        this.devicePicInfo.forEach((item: PictureListModel) => {
          item.picSize = item.picSize ? (item.picSize / BINARY_SYSTEM_CONST).toFixed(2) + 'kb' : '';
        });
      }
    });
  }

  /**
   * 点击图片
   * param currentImage
   */
  public clickImage(currentImage: PictureListModel): void {
    this.$imageViewService.showPictureView(this.devicePicInfo, currentImage);
  }
}
