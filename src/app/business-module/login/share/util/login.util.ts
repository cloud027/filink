import {LoginInfoModel} from '../../../../core-module/model/login/login-info.model';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {MenuModel} from '../../../../core-module/model/system-setting/menu.model';

export class LoginUtil {
  /**
   * 处理登录信息
   * param loginInfo
   */
  public static dealLoginInfo(loginInfo: LoginInfoModel): void {
    if (!loginInfo.loginInfo.admin) {
      loginInfo.loginInfo['tenantInfo'] = loginInfo.showMenuTemplate ? loginInfo.showMenuTemplate.menuInfoTrees : '';
    }
    SessionUtil.setToken(loginInfo.accessToken.value, loginInfo.loginInfo.expireTime);
    localStorage.setItem('userInfo', JSON.stringify(loginInfo.loginInfo));
    if (loginInfo.showMenuTemplate) {
      localStorage.setItem('menuList', JSON.stringify(loginInfo.showMenuTemplate.menuInfoTrees));
    }
  }

  /**
   * 寻找菜单的第一层可跳转url
   * param menuInfoTrees
   */
  public static findLink(menuInfoTrees: MenuModel[], curUrl = ''): string {
    let noUpdate = true;
    let url = '';
    const findUrl = (_menuInfoTrees, currentUrl) => {
      for (let i = 0; i < _menuInfoTrees.length; i++) {
        if (_menuInfoTrees[i].children && _menuInfoTrees[i].children.length > 0 && noUpdate) {
          findUrl(_menuInfoTrees[i].children, currentUrl);
        } else {
          if (noUpdate && _menuInfoTrees[i].menuHref !== currentUrl) {
            url = _menuInfoTrees[i].menuHref;
            noUpdate = false;
            break;
          }
        }
      }
    };
    findUrl(menuInfoTrees, curUrl);
    return url;
  }
}
