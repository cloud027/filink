import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {ImageViewService} from '../../../../service/picture-view/image-view.service';
import {BusinessFacilityService} from '../../../../service/business-facility/business-facility.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {ResultModel} from '../../../../model/result.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../../enum/language.enum';
import {BINARY_SYSTEM_CONST, FIXED_LENGTH_CONST, PICTURE_NUM_CONST} from '../../../../../core-module/const/common.const';
import {PicResourceEnum} from '../../../../../core-module/enum/picture/pic-resource.enum';
import {ObjectTypeEnum} from '../../../../../core-module/enum/facility/object-type.enum';
import {PictureListModel} from '../../../../../core-module/model/picture/picture-list.model';
import {QueryRecentlyPicModel} from '../../../../../core-module/model/picture/query-recently-pic.model';

/**
 *  设备图片组件
 *  created by PoHe
 */
@Component({
  selector: 'app-equipment-img-view',
  templateUrl: './equipment-img-view.component.html',
  styleUrls: ['./equipment-img-view.component.scss']
})
export class EquipmentImgViewComponent implements OnInit {

  // 入参设备id
  @Input()
  public equipmentId: string = '';
  // 设备国际化
  public language: FacilityLanguageInterface;
  // 设备信息
  public equipmentPicInfo: PictureListModel[] = [];

  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $router: Router,
              private $message: FiLinkModalService,
              private $facilityForCommon: FacilityForCommonService,
              private $businessFacilityService: BusinessFacilityService,
              private $imageService: ImageViewService) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.getPicDetailForNew();
    // 监听图片上传成功之后刷新图片列表
    this.$businessFacilityService.eventEmit.subscribe(() => {
      //  查询实景图
      this.getPicDetailForNew();
    });
  }


  /**
   *  点击照片事件
   */
  public onClickImage(item: PictureListModel): void {
    this.$imageService.showPictureView(this.equipmentPicInfo, item);
  }

  /**
   * 查询更多图片
   */
  public onClickShowMore(): void {
    this.$router.navigate(['business/facility/photo-viewer'],
      {queryParams: {equipmentId: this.equipmentId}}).then();
  }

  /**
   * 查询三张最近的图片
   */
  private getPicDetailForNew(): void {
    const tempBody = new QueryRecentlyPicModel(this.equipmentId, PICTURE_NUM_CONST, null, null, ObjectTypeEnum.equipment);
    this.$facilityForCommon.getPicDetailForNew(tempBody).subscribe(
      (result: ResultModel<PictureListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.equipmentPicInfo = result.data || [];
          this.equipmentPicInfo.forEach((item) => {
            item.picSize = item.picSize ? `${(item.picSize as number / BINARY_SYSTEM_CONST).toFixed(FIXED_LENGTH_CONST)}kb` : '';
            item.resourceName = item.resource === PicResourceEnum.realPic ? this.language.realisticPicture : '';
          });
        }
      });
  }
}
