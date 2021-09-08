import {Component, OnInit} from '@angular/core';
import { FaultLanguageInterface } from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
/**
 * 故障维护建议
 */
@Component({
  selector: 'app-fault-experience',
  templateUrl: './fault-experience.component.html',
})
export class FaultExperienceComponent implements OnInit {
  // 告警国际化引用
  public language: FaultLanguageInterface;
  // 当前时间初始化
  public updateTime: string = String(new Date().getTime());
  constructor(
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
  }

  ngOnInit() {}
}
