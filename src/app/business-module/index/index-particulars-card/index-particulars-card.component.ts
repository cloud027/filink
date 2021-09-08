import {AfterContentInit, Component, OnInit} from '@angular/core';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {NzI18nService} from 'ng-zorro-antd';

/**
 * 设施详情卡片
 */
@Component({
  selector: 'app-index-particulars-card',
  templateUrl: './index-particulars-card.component.html',
  styleUrls: ['./index-particulars-card.component.scss']
})
export class IndexParticularsCardComponent implements OnInit, AfterContentInit {
  // 国际化
  public indexLanguage: IndexLanguageInterface;

  constructor(public $nzI18n: NzI18nService) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
  }

  ngOnInit() {
  }

  ngAfterContentInit() {

  }
}
