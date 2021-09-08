import { Component, OnInit, Input } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';

import { ApplicationInterface } from '../../../../../../assets/i18n/application/application.interface';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';

import { MonitorConvenientEntranceModel } from '../../../share/model/monitor.model';
import { WorkOrDetailEnum } from '../../../share/enum/monitor-config.enum';

@Component({
  selector: 'app-meteorological-info',
  templateUrl: './meteorological-info.component.html',
  styleUrls: ['./meteorological-info.component.scss'],
})
export class MeteorologicalInfoComponent implements OnInit {
  /** 数据 */
  @Input()
  MonitorConvenientEntranceList: MonitorConvenientEntranceModel = new MonitorConvenientEntranceModel(
    {},
  );
  /** 工作台 还是 详情页面 */
  @Input() workOrDetail: WorkOrDetailEnum = WorkOrDetailEnum.workPage;
  public WorkOrDetailEnum = WorkOrDetailEnum;
  // 国际化
  public language: ApplicationInterface;
  constructor(private $nzI18n: NzI18nService) {}

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }
}
