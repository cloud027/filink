import { Component, OnInit, Input } from '@angular/core';
import { FaultLanguageInterface } from '../../../../../../../assets/i18n/fault/fault-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
/**
 * 历史记录
 */
@Component({
  selector: 'app-history-process-record-table',
  templateUrl: './history-process-record-table.component.html',
})
export class HistoryProcessRecordTableComponent implements OnInit {
  @Input() troubleId: string;
  // 告警国际化引用
  public language: FaultLanguageInterface;
  constructor(
    public $nzI18n: NzI18nService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.fault);
  }

  ngOnInit() {
  }
}
