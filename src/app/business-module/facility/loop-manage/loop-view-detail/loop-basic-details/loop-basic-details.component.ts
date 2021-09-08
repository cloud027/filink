import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FacilityApiService} from '../../../share/service/facility/facility-api.service';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {LoopViewDetailModel} from '../../../../../core-module/model/loop/loop-view-detail.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {FilinkMapEnum} from '../../../../../shared-module/enum/filinkMap.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ThumbnailComponent} from '../../../../../shared-module/component/business-component/thumbnail/thumbnail.component';
import {AssetManagementLanguageInterface} from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {LoopTypeEnum} from '../../../../../core-module/enum/loop/loop.enum';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';

/**
 * 回路详情基础详情模块组件
 */
@Component({
  selector: 'app-loop-basic-details',
  templateUrl: './loop-basic-details.component.html',
  styleUrls: ['./loop-basic-details.component.scss']
})
export class LoopBasicDetailsComponent implements OnInit, OnDestroy {
  // 回路id
  @Input() public loopId: string;
  //  地图组件
  @ViewChild('thumbnail') public thumbnail: ThumbnailComponent;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 资产语言包
  public assetLanguage: AssetManagementLanguageInterface;
  // 地图类型
  public mapType: string = FilinkMapEnum.baiDu;
  // 回路查看基础详情
  public loopViewDetailInfo: LoopViewDetailModel = new LoopViewDetailModel();
  // 回路类型枚举
  public loopTypeEnum = LoopTypeEnum;
  // 国际化类型枚举
  public languageEnum = LanguageEnum;

  constructor(
    private $nzI18n: NzI18nService,
    private $ruleUtil: RuleUtil,
    private $active: ActivatedRoute,
    private $facilityApiService: FacilityApiService,
    private $facilityCommonService: FacilityForCommonService,
  ) {
  }

  /**
   *  初始化
   */
  public ngOnInit(): void {
    // 设施语言包
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // 资产语言包
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    // 初始化请求关联设施
    this.initData();
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.thumbnail = null;
  }


  /**
   * 基础回路详情
   */
  public initData(): void {
    this.$facilityCommonService.queryLoopDetail({loopId: this.loopId}).subscribe((result: ResultModel<LoopViewDetailModel>) => {
      if (result.code === ResultCodeEnum.success) {
        this.loopViewDetailInfo = result.data;
        // 回路有关联设施时 地图添加设施点
        if (!_.isEmpty(this.loopViewDetailInfo.loopDeviceRespList)) {
          const baseInfoList = this.loopViewDetailInfo.loopDeviceRespList.map(item => {
            return {
              positionBase: item.positionBase,
              deviceType: item.deviceType,
              deviceStatus: item.deviceStatus
            };
          });
          this.thumbnail.initMap();
          // 设施画线
          this.thumbnail.loopDrawLine(this.loopViewDetailInfo.loopDeviceRespList);
          // 缩略图添加设施
          this.thumbnail.moreMakeMarKer(baseInfoList);
        }
      }
    });
  }

}
