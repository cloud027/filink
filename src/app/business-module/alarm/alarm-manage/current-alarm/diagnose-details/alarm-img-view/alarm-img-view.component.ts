import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmService} from '../../../../share/service/alarm.service';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {PicResourceEnum} from '../../../../../../core-module/enum/picture/pic-resource.enum';
import {PICTURE_NUM_CONST, FIXED_LENGTH_CONST} from '../../../../share/const/alarm-common.const';
import {QueryRecentlyPicModel} from '../../../../../../core-module/model/picture/query-recently-pic.model';
import {RealPictureModel} from '../../../../../../core-module/model/picture/real-picture.model';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {AlarmTurnTroubleService} from '../../../../../../core-module/mission/alarm-turn-trouble.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
/**
 * 告警诊断详情-告警照片显示
 */
@Component({
  selector: 'app-alarm-img-view',
  templateUrl: './alarm-img-view.component.html',
})
export class AlarmImgViewComponent implements OnInit , OnDestroy {
  // 告警设施ID
  @Input() alarmDeviceId: string;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 设施图标信息
  public alarmPicInfo: RealPictureModel[] = [];
  destroy = new Subject();
  constructor(
    private $nzI18n: NzI18nService,
    private $alarmService: AlarmService,
    private $alarmTurnTroubleService: AlarmTurnTroubleService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.$alarmTurnTroubleService.turnOrderEmit.pipe(takeUntil(this.destroy)).subscribe((proId: string) => {
      this.getDevicePic(proId);
    });
  }

  /**
   * 销毁传递工单数据
   */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /**
   * 获取图片
   */
  private getDevicePic(proId: string): void {
    const picData: QueryRecentlyPicModel = new QueryRecentlyPicModel(this.alarmDeviceId, PICTURE_NUM_CONST, PicResourceEnum.workOrder, proId);
    this.$alarmService.queryAlarmPic(picData).subscribe((result) => {
      if (result.code === ResultCodeEnum.success && result.data && result.data.length > 0) {
        this.alarmPicInfo = result.data;
        this.alarmPicInfo.forEach((item: any) => {
          item.picSize = item.picSize ? (item.picSize / 1000).toFixed(FIXED_LENGTH_CONST) + 'kb' : '';
        });
      }
    });
  }
}
