import {Component, Input, OnInit} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {PageTypeEnum} from '../../../../../../core-module/enum/alarm/alarm-page-type.enum';

/**
 * 告警诊断详情-告警分析
 */
@Component({
  selector: 'app-alarm-analysis',
  templateUrl: './alarm-analysis.component.html',
  styleUrls: ['./alarm-analysis.component.scss']
})
export class AlarmAnalysisComponent implements OnInit {
  // 告警编码
  @Input() alarmCode: string;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 页面类型
  public pageType: PageTypeEnum = PageTypeEnum.alarm;
  constructor(
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  ngOnInit() {
    this.pageType = PageTypeEnum.alarm;
  }
}
