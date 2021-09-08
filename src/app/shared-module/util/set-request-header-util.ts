/**
 * 手动获取请求头部分信息
 * （注： 根据需要获取相关信息）
 */
import {Base64} from './base64';

export class SetRequestHeaderUtil {
  public static setHeadersInfo() {
    const header = {
      Accept: 'application/json, text/plain, */*',
      Authorization: '',
      language: '',
      roleId: '',
      roleName: '',
      tenantId: '',
      userId: '',
      userName: '',
      zone: 'GMT+00:00'
    };
    // 取token
    if (localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined') {
      header.Authorization = JSON.parse(localStorage.token).value;
    }
    // 取用户信息
    if (localStorage.getItem('userInfo') && localStorage.getItem('userInfo') !== 'undefined') {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      header.roleId = userInfo.roleId;
      // header.roleName = encodeURIComponent(userInfo.role.roleName);
      header.roleName = (userInfo.role.roleName) ? Base64.encode(userInfo.role.roleName) : '';
      header.tenantId = userInfo.tenantId;
      header.userId = userInfo.id;
      // header.userName = encodeURIComponent(userInfo.userName);
      header.userName = (userInfo.userName) ? Base64.encode(userInfo.userName) : '';
    }
    // 语言类型
    if (localStorage.getItem('localLanguage') && localStorage.getItem('localLanguage') !== 'undefined') {
      header.language = localStorage.localLanguage.replace(/"/g, '');
    }
    return header;
  }
}
