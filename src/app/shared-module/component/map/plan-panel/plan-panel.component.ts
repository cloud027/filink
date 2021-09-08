import {Component, Input, OnInit} from '@angular/core';
import {ViewEnum} from '../../../../core-module/enum/index/index.enum';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import { NzI18nService } from 'ng-zorro-antd';

@Component({
  selector: 'app-plan-panel',
  templateUrl: './plan-panel.component.html',
  styleUrls: ['./plan-panel.component.scss']
})
export class PlanPanelComponent implements OnInit {
  @Input() infoData;
  @Input() viewIndex;
  // 项目视图
  public projectView = ViewEnum.projectView;
  // 规划视图
  public planView = ViewEnum.planView;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  constructor(
    public $nzI18n: NzI18nService
  ) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
  }

  ngOnInit() {
  }

}
