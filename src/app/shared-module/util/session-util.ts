import storage from 'localstorage-expires';

/**
 * session工具类
 */
export class SessionUtil {
  /**
   * 获取用户信息
   */
  static getUserInfo() {
    if (localStorage.getItem('userInfo') && localStorage.getItem('userInfo') !== 'undefined') {
      return JSON.parse(localStorage.getItem('userInfo'));
    } else {
      return {};
    }
  }

  /**
   * 获取用户ID
   */
  static getUserId() {
    const userInfo = this.getUserInfo();
    return userInfo.id;
  }

  /**
   * 获取权限ID
   */
  static getRoleId() {
    const userInfo = this.getUserInfo();
    if (userInfo.role) {
      return userInfo.role.id;
    } else {
      return '';
    }
  }

  /**
   * 获取tenant ID
   */
  static getTenantId() {
    const userInfo = this.getUserInfo();
    if (userInfo.tenantId) {
      return userInfo.tenantId;
    } else {
      return '';
    }
  }

  /**
   * 存入租户id 和用户名
   * param tenantId
   * param userName
   */
  static setTenantIdAndUserName(tenantId: string, userName: string) {
    if (tenantId && userName) {
      localStorage.setItem('userInfo', JSON.stringify({tenantId, userName}));
    }
  }

  /**
   * 获取角色名称
   */
  static getRoleName() {
    const userInfo = this.getUserInfo();
    if (userInfo.role) {
      return userInfo.role.roleName;
    } else {
      return '';
    }
  }

  /**
   * 获取token信息
   */
  static getToken() {
    return storage.getItem('token');
  }

  /**
   * 设置token
   * param value
   * param time
   */
  static setToken(value: string, time: number) {
    storage.setItem('token', value, time);
  }

  /**
   * 获取显示配置
   */
  static getDisplaySettings() {
    if (localStorage.getItem('platformDisplaySettings') && localStorage.getItem('platformDisplaySettings') !== 'undefined') {
      return JSON.parse(localStorage.getItem('platformDisplaySettings'));
    } else {
      return {};
    }
  }

  /**
   * 获取消息提醒配置
   */
  static getMsgSetting(): any {
    if (localStorage.getItem('messageNotification') && localStorage.getItem('messageNotification') !== 'undefined') {
      return JSON.parse(localStorage.getItem('messageNotification'));
    } else {
      return {messageRemind: ''};
    }
  }

  /**
   * 推送是否弹框提示 true 为弹框
   * returns {boolean}
   */
  static isMessageNotification(): boolean {
    return this.getMsgSetting().messageRemind === '1';
  }

  /**
   * 获取系统语言环境
   */
  static getLanguage() {
    if (localStorage.getItem('localLanguage')) {
      return JSON.parse(localStorage.getItem('localLanguage')) || '';
    } else {
      return this.getDisplaySettings().systemLanguage || '';
    }

  }

  /**
   * 判断操作有没有权限
   * param {string} appAccessPermission 权限id
   * returns {boolean}
   */
  static checkHasRole(appAccessPermission: string): boolean {
    // 从用户信息里面获取权限列表
    const userInfo: any = this.getUserInfo();
    let role: any[];
    if (userInfo.role && userInfo.role.permissionList) {
      role = userInfo.role.permissionList.map(item => item.id);
    }
    return role.includes(appAccessPermission);
  }

  /**
   * 判断操作有没有项目规划集
   * param {string} appAccessPermission
   * returns {boolean}
   */
  static checkHasProjectPlanningTypes(appAccessPermission: string): boolean {
    // 从用户信息里面获取权限列表
    const userInfo: any = this.getUserInfo();
    let role: any[];
    if (userInfo.role && userInfo.role.roleDeviceTypeDto.projectPlanningTypes) {
      role = userInfo.role.roleDeviceTypeDto.projectPlanningTypes;
    }
    return role.includes(appAccessPermission);
  }

  /**
   * 校验是否有某类型设施权限
   * @param appAccessPermission 设施的类型
   */
  static checkHasDeviceType(appAccessPermission: string): boolean {
    // 从用户信息里面获取权限列表
    const userInfo: any = this.getUserInfo();
    let role: any[];
    if (userInfo.role && userInfo.role.roleDeviceTypeDto.deviceTypes) {
      role = userInfo.role.roleDeviceTypeDto.deviceTypes;
    }
    return role.includes(appAccessPermission);
  }
  /**
   * 租户权限数据递归
   */
  static tenantDataRecursion(list, role) {
    if (list) {
      list.forEach(item => {
        role.push({elementId: item.elementId, isShow: item.isShow});
        if (item.children && item.children.length) {
          this.tenantDataRecursion(item.children, role);
        }
      });
    }
  }

  /**
   * 判断租户前端操作有没有权限
   * param {string} appTenantPermission 权限id
   * returns {boolean}
   */
  static checkHasTenantRole(appTenantPermission: string): boolean {
    // 从用户信息里面获取权限列表
    const userInfo: any = SessionUtil.getUserInfo();
    let roleTenant: any[] = [];
    let showOrHidden = false;
    // 将取出对象的values,构造数据结构
    // 由于后台可能会传null，添加filter过滤
    const tenantInfo = Object.values(userInfo.tenantElement).filter(n => n);
    if (tenantInfo) {
      tenantInfo.forEach((tenant => {
        roleTenant = roleTenant.concat(this.tenantDataRecursion(Object.values(tenant), roleTenant));
      }));
    }
    // 存在某项为空导致报错
    roleTenant = roleTenant.filter(v => v);
    // 判断是否有租户前台权限是否展示
    roleTenant.forEach(item => {
      // 判断租户项是否展示
      if (appTenantPermission === item.elementId) {
        showOrHidden = item.isShow === '1';
      }
    });

    return showOrHidden;

  }
}
