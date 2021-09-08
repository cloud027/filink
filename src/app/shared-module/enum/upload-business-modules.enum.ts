/**
 * 业务模块业务id, 需要使用大文件上传时，可在枚举中添加对应模块
 * 在同一用户同一业务id下，同时只能上传一个文件
 * 请勿随意更改业务模块上传标识id！！！
 */
export enum UploadBusinessModulesEnum {
  // 首页
  index = 'upload-index',
  // 告警模块
  alarm = 'upload-alarm',
  // 工单
  workOrder = 'upload-work-order',
  // 设施
  facility = 'upload-facility',
  // 产品上传杆型图
  productWisdom = 'upload-product-wisdom',
  // 产品上传网关图
  productGateway = 'upload-product-gateway',
  // 用户
  user = 'upload-user'
}
