import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {SessionUtil} from '../../util/session-util';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../enum/language.enum';

/**
 * 导入消息推送
 */
@Component({
  selector: 'app-import-message-push',
  templateUrl: './import-message-push.component.html',
  styleUrls: ['./import-message-push.component.scss']
})
export class ImportMessagePushComponent implements OnInit {
  // 提示语
  @Input() message: string;
  // 关闭事件
  @Output() closeNz = new EventEmitter();
  // 提示模版
  @ViewChild('importOkTemp') importOkTemp: TemplateRef<any>;
  public language: CommonLanguageInterface;
  constructor(private $NzNotificationService: NzNotificationService,
              private $router: Router, private $nzi18n: NzI18nService) {
    this.language = this.$nzi18n.getLocaleData(LanguageEnum.common);
  }

  public ngOnInit(): void {
  }

  /**
   * 导入之后进行页面刷新
   */
  public showNotification(): void {
    this.$NzNotificationService.config({
      nzPlacement: 'bottomRight',
      nzDuration: SessionUtil.getMsgSetting().retentionTime * 2000
    });
    this.$NzNotificationService.template(this.importOkTemp);
  }
}
