import { Component, OnInit } from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {

  // 国际化
  language: any;
  constructor(private $I18n: NzI18nService) {
    this.language = $I18n.getLocale();
  }

  ngOnInit() {
  }

}
