import {Component, Input, OnInit} from '@angular/core';
import { FaultLanguageInterface } from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityService} from '../../../../../../core-module/api-service/facility/facility-manage';
import {ImageViewService} from '../../../../../../shared-module/service/picture-view/image-view.service';
import {TroubleService} from '../../../../share/service';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {PicResourceEnum} from '../../../../../../core-module/enum/picture/pic-resource.enum';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {FacilityForCommonService} from '../../../../../../core-module/api-service/facility/facility-for-common.service';
import {QueryRecentlyPicModel} from '../../../../../../core-module/model/picture/query-recently-pic.model';
import {PictureListModel} from '../../../../../../core-module/model/picture/picture-list.model';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {ImageTabsEnum} from '../../../../share/enum/trouble.enum';
import {TroubleDetailImageModel} from '../../../../share/model/trouble-detail-image.model';
import {SelectModel} from '../../../../../../shared-module/model/select.model';
/**
 * 故障图片
 */
@Component({
  selector: 'app-trouble-img-view',
  templateUrl: './trouble-img-view.component.html',
})
export class TroubleImgViewComponent implements OnInit {
  @Input() deviceId: string;
  @Input() procId: string;
  @Input() alarmId: string;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 设施图标信息
  public troublePicInfo: PictureListModel[] = [];
  // 页签
  public imageTabs: TroubleDetailImageModel[] = [];
  // 是否有数据
  public isNotData: boolean = false;
  constructor(
    private $nzI18n: NzI18nService,
    private $facilityService: FacilityService,
    private $imageViewService: ImageViewService,
    private $troubleService: TroubleService,
    private $facilityForCommonService: FacilityForCommonService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    (CommonUtil.codeTranslate(ImageTabsEnum, this.$nzI18n, null, LanguageEnum.fault) as SelectModel[]).forEach(v => {
      this.imageTabs.push({
        label: v.label,
        code: v.code,
        imageList: []
      });
    });
    if (this.procId) {
      this.getDevicePic();
      this.getDevicePicAfter();
    }
    if (this.alarmId) {
      this.getDevicePicAlarm();
    }
  }

  /**
   * 获取工单销障前图片
   */
  private getDevicePic(): void {
    const picData: QueryRecentlyPicModel = new QueryRecentlyPicModel();
    picData.objectId = this.deviceId;
    picData.resource = PicResourceEnum.workOrder; // 来源类型
    picData.resourceId = this.procId; // 来源id
    picData.picNum = '5'; // 查询5张
    picData.orderType = '1';
    this.$facilityForCommonService.getPicDetailForNew(picData).subscribe((result: ResultModel<PictureListModel[]>) => {
      if (result.code === ResultCodeEnum.success && result.data && result.data.length > 0) {
        // this.troublePicInfo = result.data;
        this.isNotData = true;
        result.data.forEach((item: any) => {
          item.picSize = item.picSize ? (item.picSize / 1000).toFixed(2) + 'kb' : '';
        });
        this.imageTabs.forEach(v => {
          if (v.code === ImageTabsEnum.orderExecuteBefore) {
            v.imageList = result.data;
          }
        });
      }
    });
  }

  /**
   * 获取工单销障后图片
   */
  private getDevicePicAfter(): void {
    const param = {
      objectId: this.deviceId,
      resource: PicResourceEnum.workOrder, // 来源类型
      resourceId: this.procId, // 来源id
      picNum: '5', // 查询5张
      orderType: '2', // 销障后
    };
    this.$facilityForCommonService.getPicDetailForNew(param).subscribe((result: ResultModel<PictureListModel[]>) => {
      if (result.code === ResultCodeEnum.success && result.data && result.data.length > 0) {
        result.data.forEach((item: any) => {
          item.picSize = item.picSize ? (item.picSize / 1000).toFixed(2) + 'kb' : '';
        });
        this.isNotData = true;
        this.imageTabs.forEach(v => {
          if (v.code === ImageTabsEnum.orderExecuteAfter) {
            v.imageList = result.data;
          }
        });
      }
    });
  }

  /**
   * 获取告警图片
   */
  private getDevicePicAlarm(): void {
    const param = {
      objectId: this.deviceId,
      resource: PicResourceEnum.alarm, // 来源类型
      resourceId: this.alarmId, // 来源id
      picNum: '5', // 查询5张
    };
    this.$facilityForCommonService.getPicDetailForNew(param).subscribe((result: ResultModel<PictureListModel[]>) => {
      if (result.code === ResultCodeEnum.success && result.data && result.data.length > 0) {
        this.isNotData = true;
        result.data.forEach(item => {
          item.picSize = item.picSize ? (item.picSize / 1000).toFixed(2) + 'kb' : '';
        });
        this.imageTabs.forEach(v => {
          if (v.code === ImageTabsEnum.alarmImage) {
            v.imageList = result.data;
          }
        });
      }
    });
  }
}
