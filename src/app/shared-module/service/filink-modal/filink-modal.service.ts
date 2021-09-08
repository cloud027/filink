/**
 * Created by xiaoconghu on 2019/1/28.
 * 弹框服务类
 */
import {Injectable} from '@angular/core';
import {NzI18nService, NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';

@Injectable()
export class FiLinkModalService {
  language: FacilityLanguageInterface;
  errorModalInstance: NzModalRef<any>;

  constructor(private $modalService: NzModalService,
              private $i18n: NzI18nService,
              private $messageService: NzMessageService) {
    this.language = $i18n.getLocaleData('facility');
  }

  /**
   * 正常信息
   * param msg
   */
  info(msg: string): void {
    this.$modalService.info({
      nzTitle: this.language.prompt,
      nzContent: msg,
    });
  }

  /**
   * 成功信息
   * param msg
   */
  success(msg: string): void {
    this.$modalService.success({
      nzTitle: this.language.prompt,
      nzContent: msg
    });
  }

  /**
   * 错误信息
   * param msg
   */
  error(msg: string, callback = null): void {
    // 如果已经有弹框先把弹框销毁
    if (this.errorModalInstance) {
      this.errorModalInstance.destroy();
    }
    this.errorModalInstance = this.$modalService.error({
      nzTitle: this.language.prompt,
      nzContent: msg,
      nzOnOk: callback,
    });
  }

  /**
   * 警告信息
   * param msg
   */
  warning(msg: string, title?: string): void {
    this.$modalService.warning({
      nzTitle: title ? title : this.language.prompt,
      nzContent: msg
    });
  }

  /**
   * 加载
   * param msg
   */
  loading(msg: string, duration = 3000): void {
    this.$messageService.remove();
    this.$messageService.loading(msg, {nzDuration: duration});
  }

  /**
   * 加载
   * param msg
   */
  remove(): void {
    this.$messageService.remove();
  }

  /**
   * 确认弹框
   * param msg
   * param okFunc
   * param cancelFunc
   * param title
   */
  confirm(msg: string, handleOk: () => void, handleCancel?: () => void, title?: string): void {
    this.$modalService.confirm({
      nzTitle: title ? title : this.language.prompt,
      nzContent: `<span>${msg}</span>`,
      nzOkText: this.language.handleCancel,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: handleCancel ? handleCancel : () => {},
      nzCancelText: this.language.handleOk,
      nzOnCancel: handleOk
    });
  }
}
