/**
 * 产品管理接口路径常量
 */
import {DEVICE_SERVER, PRODUCT_SERVER, SYSTEM_SERVER} from '../../../../core-module/api-service/api-common.config';

export const ProductServiceUrlConst = {
  // 新增产品
  addProduct: `${PRODUCT_SERVER}/productInfo/insertProduct`,
  // 保存产品和图片信息
  insertBatchPictures:  `${PRODUCT_SERVER}/productInfo/insertBatchPictures`,
  // 修改产品
  updateProduct: `${PRODUCT_SERVER}/productInfo/updateProduct`,
  // 删除产品
  deleteProduct: `${PRODUCT_SERVER}/productInfo/deleteProduct`,
  // 导出产品数据
  exportProduct: `${PRODUCT_SERVER}/productInfo/exportProduct`,
  // 导入产品数据
  importProductInfo: `${PRODUCT_SERVER}/productInfo/importProduct`,
  // 根据产品查询配置模版信息
  queryConfigTemplateByProductId: `${PRODUCT_SERVER}/productInfo/queryConfigTemplate`,
  // 保存配置模版
  insertConfigTemplate: `${PRODUCT_SERVER}/productInfo/insertConfigTemplate`,
  // 上传杆型图
  uploadPoleImage: `${PRODUCT_SERVER}/productImage/uploadPoleImage`,
  //  杆型图详情
  poleImageInfo: `${PRODUCT_SERVER}/productImage/poleImageInfo`,
  // 保存杆型图
  insertPoleImage: `${PRODUCT_SERVER}/productImage/updatePoleImage`,
  // 网关图详情
  gatewayImageInfo: `${PRODUCT_SERVER}/productImage/gatewayImageInfo`,
  // 上传网关图
  uploadGatewayImage: `${PRODUCT_SERVER}/productImage/uploadGatewayImage`,
  // 保存网关图
  updateGatewayImage: `${PRODUCT_SERVER}/productImage/updateGatewayImage`,
  // 查询供应商下拉选
  querySupplier: `${PRODUCT_SERVER}/productInfo/querySupplier`,
  // 查询云平台产品
  queryPlatformProduct: `${SYSTEM_SERVER}/platformApp/findPlatformAppInfoMapByType`,
  // 查询模版json字符串
  queryConfigTemplateInfo: `${PRODUCT_SERVER}/productInfo/queryConfigTemplateInfo`,
  // 获取使用数量
  getProductUseCountForFeign: `${DEVICE_SERVER}/product/getProductUseCountForFeign`

};
