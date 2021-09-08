import {AfterViewInit, Directive, ElementRef, HostListener, Input} from '@angular/core';
import {SessionUtil} from '../util/session-util';
import {FiLinkModalService} from '../service/filink-modal/filink-modal.service';
import {NzI18nService} from 'ng-zorro-antd';

/**
 * 权限指令
 */
@Directive({
  selector: '[appAccessPermission]'
})
export class AccessPermissionDirective implements AfterViewInit {

  @Input() appAccessPermission: string = '';
  // 用户权限列表
  role = [];
  // 国际化
  language: any;

  constructor(private el: ElementRef,
              private $i18n: NzI18nService,
              private $message: FiLinkModalService) {
    // 从用户信息里面获取权限列表
    const userInfo = SessionUtil.getUserInfo();
    if (userInfo.role && userInfo.role.permissionList) {
      this.role = userInfo.role.permissionList.map(item => item.id);
    }
    this.language = $i18n.getLocale();
  }

  /**
   * 监听点击事件 权限判断防止页面改 disabled
   * param event
   */
  @HostListener('click', ['$event'])
  onClick(event) {
    if (!this.hasPermission()) {
      this.$message.warning(this.language.common.permissionMsg);
      throw new Error(this.language.common.permissionMsg);
    }
  }

  ngAfterViewInit(): void {
    if (!this.hasPermission()) {
      this.el.nativeElement.disabled = 'disabled';
    }
  }

  /**
   * 判断用户是否有该操作
   */
  private hasPermission() {
    if (this.appAccessPermission) {
      if (this.role.includes(this.appAccessPermission)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }

  }
}
