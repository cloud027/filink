import {LOG_SERVER, SYSTEM_SERVER, USER_SERVER} from '../api-common.config';

// 日志
const logBaseUrl = '/log';
// 安全协议
const securityStrategy = '/securityStrategy';
// 系统参数设置
const systemParameter = '/systemParameter';
export const systemSettingRequireUrl = {
  // 日志管理相关
  findOperateLog: `${LOG_SERVER}${logBaseUrl}/findOperateLog`,
  // 安全策略
  queryPasswordSecurity: `${SYSTEM_SERVER}${securityStrategy}/queryPasswordSecurity`,
  queryAccountSecurity: `${SYSTEM_SERVER}${securityStrategy}/queryAccountSecurity`,
  // 系统参数
  queryLanguageAll: `${SYSTEM_SERVER}${systemParameter}/queryLanguageAll`,
  selectDisplaySettingsParamBySys: `${SYSTEM_SERVER}${systemParameter}/selectDisplaySettingsParamBySys`,
  selectDisplaySettingsParamByTenant: `${SYSTEM_SERVER}${systemParameter}/selectDisplaySettingsParamByTenant`,
  // 列设置相关
  queryColumnSettings: `${SYSTEM_SERVER}/boxHead/query`,
  saveColumnSettings: `${SYSTEM_SERVER}/boxHead/save`,
  // 获取所有的城市信息
  getAllCityInfo: `${SYSTEM_SERVER}/map/queryAllCityInfo`,
  // 上传License
  uploadLicense: `zuul/${SYSTEM_SERVER}/licenseInfo/uploadLicense`,
  // 角色切换到管理员菜单
  switchAccountToSuper: `${USER_SERVER}/switchAccount/toSuper`,
  // 角色切换到租户菜单
  switchAccountToTenant: `${USER_SERVER}/switchAccount/toTenant`,
  // 菜单国际化切换
  queryTenantMenuById: `${USER_SERVER}/menu/queryTenantMenuById`,
  // 登录页面上传license
  uploadLicenseForAdmin: `zuul/${SYSTEM_SERVER}/licenseInfo/uploadLicenseForAdmin`,
  // 验证license时间
  validateLicenseTime: `${SYSTEM_SERVER}/licenseInfo/validateLicenseTime`,
};
