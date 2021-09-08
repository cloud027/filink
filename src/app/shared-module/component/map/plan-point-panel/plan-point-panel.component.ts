import {Component, Input, OnInit} from '@angular/core';
import {ViewEnum} from '../../../../core-module/enum/index/index.enum';
import {PointStatusEnum} from '../../../../core-module/enum/plan/point-status.enum';
import {LanguageEnum} from '../../../enum/language.enum';
import {PlanProjectLanguageInterface} from '../../../../../assets/i18n/plan-project/plan-project.language.interface';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-plan-point-panel',
  templateUrl: './plan-point-panel.component.html',
  styleUrls: ['./plan-point-panel.component.scss']
})
export class PlanPointPanelComponent implements OnInit {
  @Input() infoData;
  @Input() viewIndex;
  // 项目视图
  public projectView = ViewEnum.projectView;
  // 规划视图
  public planView = ViewEnum.planView;
  // 智慧杆建设状态枚举
  public pointStatusEnum = PointStatusEnum;
  // 语言包枚举
  public languageEnum = LanguageEnum;
  public language: PlanProjectLanguageInterface;
  constructor(
    private $nzI18n: NzI18nService,
  ) { }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
  }

}
