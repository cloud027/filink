import {Component, Input, OnInit} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';

/**
 * 告警诊断详情-告警基本信息
 */
@Component({
  selector: 'app-alarm-basic-info',
  templateUrl: './alarm-basic-info.component.html',
  styleUrls: ['./alarm-basic-info.component.scss']
})
export class AlarmBasicInfoComponent implements OnInit {
  // 告警信息
  @Input() alarmInfo;
  // 告警国际化引用
  public language: AlarmLanguageInterface;

  constructor(
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  ngOnInit() {
  }

}
