import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NzNotificationDataFilled, NzNotificationService} from 'ng-zorro-antd';
import {SessionUtil} from '../../util/session-util';

class Options {
  title: string;
  msg: string;
  button: Button[];
}

class Button {
  text: string;
  handle: (closeNz: EventEmitter<any>) => void;
}

@Component({
  selector: 'app-export-message-push',
  templateUrl: './export-message-push.component.html',
  styleUrls: ['./export-message-push.component.scss']
})
export class ExportMessagePushComponent implements OnInit, OnDestroy {
  // 传入的参数
  @Input() options: Options = new Options();
  // 关闭事件
  @Output() closeNz = new EventEmitter();
  // 导出成功模板
  @ViewChild('exportOkTemp') exportOkTemp: TemplateRef<any>;
  // 弹窗实列
  private instance: NzNotificationDataFilled;

  constructor(private $NzNotificationService: NzNotificationService,) {
  }

  ngOnInit() {
  }

  /**
   * 导出成功提示
   */
  public showNotification(): void {
    this.$NzNotificationService.config({
      nzPlacement: 'bottomRight',
      nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000,
    });
    this.instance = this.$NzNotificationService.template(this.exportOkTemp);
    this.instance.onClose.subscribe(() => {
      this.closeNz.emit();
    });
  }

  /**
   * 处理点击事件
   * param button
   */
  public click(button: Button): void {
    if (button.handle) {
      button.handle(this.closeNz);
    }
  }

  ngOnDestroy(): void {
    // 触发销毁控制消息通知的关闭
    this.$NzNotificationService.remove(this.instance.messageId);
  }
}
