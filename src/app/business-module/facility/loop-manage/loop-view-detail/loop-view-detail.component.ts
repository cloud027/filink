import {Component, OnInit, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {LoopBasicDetailsComponent} from './loop-basic-details/loop-basic-details.component';

/**
 * 回路详情
 */
@Component({
  selector: 'app-loop-view-detail',
  templateUrl: './loop-view-detail.component.html',
  styleUrls: ['./loop-view-detail.component.scss']
})
export class LoopViewDetailComponent implements OnInit {
  //  回路详情基础信息组件
  @ViewChild('thumbnailDetail') public thumbnailDetail: LoopBasicDetailsComponent;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 回路id
  public loopId: string;
  // 回路编码
  public loopCode: string;
  // 集中控制器id
  public equipmentId: string;

  constructor(
    private $nzI18n: NzI18nService,
    private $active: ActivatedRoute,
  ) {
  }

  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.$active.queryParams.subscribe(params => {
      this.loopId = params.id;
      this.loopCode = params.code;
      this.equipmentId = params.equipmentId;
    });
  }

  /**
   * 移出操作需要刷新缩略图
   */
  public onMoveOut(event: boolean): void {
    if (event) {
      this.thumbnailDetail.initData();
    }
  }

}
