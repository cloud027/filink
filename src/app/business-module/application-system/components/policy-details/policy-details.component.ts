import {Component, Input, OnInit} from '@angular/core';
import {StrategyListModel} from '../../share/model/policy.control.model';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';

@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.scss']
})
export class PolicyDetailsComponent implements OnInit {
  @Input() lightingData: StrategyListModel;
  // 设备列表多语言
  public languageTable: ApplicationInterface;

  constructor(
    // 多语言配置
    public $nzI18n: NzI18nService,
  ) {
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  ngOnInit() {
  }

}
