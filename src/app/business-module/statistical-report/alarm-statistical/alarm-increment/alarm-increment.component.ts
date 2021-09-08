import {Component, OnInit} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmStatisticalService} from '../../share/service/alarm-statistical.service';
import {StatisticsTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AlarmStatisticsGroupInfoModel} from '../../../../core-module/model/alarm/alarm-statistics-group-Info.model';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ScreenConditionModel} from '../../share/model/alarm/screen-condition.model';

@Component({
  selector: 'app-alarm-increment',
  templateUrl: './alarm-increment.component.html',
  styleUrls: ['./alarm-increment.component.scss']
})
export class AlarmIncrementComponent implements OnInit {
  // 国际化
  public language: AlarmLanguageInterface;
  // 进度条
  public progressShow: boolean = false;
  public options;
  // 折线图是否显示
  public display = {
    brokenLine: false
  };

  constructor(
    private $NZi18: NzI18nService,
    public $alarmStatisticalService: AlarmStatisticalService,
  ) {
    this.language = this.$NZi18.getLocaleData(LanguageEnum.alarm);
  }

  public ngOnInit(): void {
  }

  /**
   * 获取统计数据
   * param event
   */
  public search(event: ScreenConditionModel): void {
    this.progressShow = true;
    event.bizCondition.statisticsType = StatisticsTypeEnum.facility;
    this.$alarmStatisticalService.alarmIncrementalStatistics(event).subscribe((res: ResultModel<AlarmStatisticsGroupInfoModel[]>) => {
      this.progressShow = false;
      if (res.code === ResultCodeEnum.success) {
        this.display.brokenLine = true;
        const x = [];
        const y = [];
        this.timeSort(res.data).forEach(item => {
          x.push(item.groupLevel);
          y.push(item.groupNum);
        });
        // 等dom渲染完成之后 eCharts Dom有了宽高再进行画图
        setTimeout(() => {
          this.brokenLine(x, y);
        });
      }
    });
  }

  /**
   * 先进行时间排序
   */
  private timeSort(data: AlarmStatisticsGroupInfoModel[]): AlarmStatisticsGroupInfoModel[] {
    data.forEach(item => {
      item.time = +new Date(item.groupLevel);
    });
    return data.sort((a, b) => a.time - b.time);
  }

  /**
   * 折线图配置
   * param x
   * param y
   */
  private brokenLine(x: string[], y: number[]): void {
    this.options = ChartUtil.brokenLine(x, y, this.language);
  }
}
