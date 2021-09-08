/**
 * 后台返回状态码枚举
 */
export enum ResultCodeEnum {
  success = '00000',
  z4042 = 'Z4042',
  areaCode = '130109',
  fail = -1,
  userNotExist = 120310,
  roleNotExist = 120270,
  roleOrDeptNotExist = 120610,
  deviceExceptionCode = 130204,
  // 无该数据
  noSuchData = 170219,
  notOnLine = 120290,
  // 配置加载失败
  configLoadingFail = 125040,
  deleteOnlineUser = 120210,
  deleteDefaultUser = 120220,
  deleteInfo = 120280,
  deleteInfoTip = 120300,
  // 已启用不能被删除
  hasEnable = 120540,
  // 有工单的不能删
  hasWorkOrder = 125500,
  // 上传的脚本协议文件的设备型号已存在
  hasFileEquipmentModel = 'O0301',
  // license已经过期
  licenseIsExpired = 125060,
  // license不存在
  licenseIsNull = 125080,
  // 协议新增成功，订阅失败
  subscribeFailed = 'O0308',
  // 在职状态不能被删除
  noDeleteWork = 'B0322',
  // 不能选择离职人员
  cannotSelectResignPerson = 'B0624',
}
