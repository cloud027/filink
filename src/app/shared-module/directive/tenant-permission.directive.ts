import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {SessionUtil} from '../util/session-util';

/**
 * 租户权限指令
 */
@Directive({
  selector: '[appTenantPermission]'
})
export class TenantPermissionDirective implements AfterViewInit {
  // 租户权限
  @Input() appTenantPermission: string = '';
  // 租户权限列表
  public role = [];

  constructor(private el: ElementRef) {
    // 从用户信息里面获取权限列表
    const userInfo = SessionUtil.getUserInfo();
    // 将取出对象的values
    // 由于后台可能会传null，添加filter过滤
    const tenantInfo = Object.values(userInfo.tenantElement).filter(n => n);
    if (tenantInfo) {
      tenantInfo.forEach((tenant => {
        this.role = this.role.concat(SessionUtil.tenantDataRecursion(Object.values(tenant), this.role)).filter(v => v);
      }));
    }
  }


  ngAfterViewInit(): void {
    if (!this.hasTenantPermission()) {
      this.el.nativeElement.style.display = 'none';
    }
  }


  /**
   * 判断租户是否有该操作
   */
  private hasTenantPermission() {
    // 判断是否有appTenantPermission
    if (this.appTenantPermission) {
      let showOrHidden = false;
      this.role.forEach(item => {
        // 判断租户项是否展示
        if (this.appTenantPermission === item.elementId) {
          showOrHidden = item.isShow === '1';
        }
      });

      if (showOrHidden) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }

  }
}
