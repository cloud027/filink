import {COMMON_PREFIX, SYSTEM_SERVER, USER_SERVER} from '../../../../core-module/api-service/api-common.config';


const menuLogin = '/filink';
// 系统参数设置
const systemParameter = '/systemParameter';
export const LoginRequireUrl = {
  // 登录接口
  login: `${COMMON_PREFIX}${menuLogin}/login`,
  // 验证license时间
  validateLicenseTime: `${SYSTEM_SERVER}/licenseInfo/validateLicenseTime`,
  // 上传license
  uploadLicense: `zuul/${SYSTEM_SERVER}/licenseInfo/uploadLicenseForAdmin`,
  // 获取验证码
  getVerificationCode: `${USER_SERVER}/user/sendMessage`,
  // 手机登录
  phoneLogin: `/auth/phone`,
  // 获取备案号
  querySiteRecordNumber: `${SYSTEM_SERVER}${systemParameter}/querySiteRecordNumber`,
};
