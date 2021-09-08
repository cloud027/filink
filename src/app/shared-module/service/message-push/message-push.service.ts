import {ComponentRef, Injectable} from '@angular/core';
import {ExportMessagePushComponent} from '../../component/export-message-push/export-message-push.component';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';

@Injectable()
export class ExportMessagePushService {
  private exportMessagePushRef: ComponentRef<ExportMessagePushComponent> | any;
  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay) {
  }

  /**
   * 将导出成功提示绑定到business模块
   * param msg
   */
  messagePush(options) {
    this.overlayRef = this.overlay.create();
    this.exportMessagePushRef = this.overlayRef.attach(new ComponentPortal(ExportMessagePushComponent));
    if (options) {
      this.exportMessagePushRef.instance.options = options;
      this.exportMessagePushRef.instance.showNotification();
    }
    /**
     * 推送导出成功消息点击确定后关闭提示框
     */
    this.exportMessagePushRef.instance.closeNz.subscribe(() => {
      this.exportMessagePushRef.destroy();
      this.overlayRef.detach();
    });
  }
}
