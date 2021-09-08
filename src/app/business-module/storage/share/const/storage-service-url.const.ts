/**
 * 库存管理接口路径常量
 */
import {STORAGE_SERVER} from '../../../../core-module/api-service/api-common.config';

export const StorageServiceUrlConst = {
  // 查询物料数量
  queryMaterialTotal: `${STORAGE_SERVER}/inventory/queryInventoryTotal`,
  // 查询入库总览列表
  queryStorageList: `${STORAGE_SERVER}/inventory/queryInventoryListByPage`,
  // 导出入库总览列表
  exportInventoryList: `${STORAGE_SERVER}/inventory/exportInventoryList`,
  // 查询入库列表
  queryWarehousingList: `${STORAGE_SERVER}/warehousing/queryWarehousingList`,
  // 新增入库物料
  addWarehousing: `${STORAGE_SERVER}/warehousing/addWarehousing`,
  // 修改入库物料
  updateWarehousingById: `${STORAGE_SERVER}/warehousing/updateWarehousingById`,
  // 根据id获取单个入库信息
  queryWarehousingById: `${STORAGE_SERVER}/warehousing/queryWarehousingById`,
  // 提交入库信息
  submitWarehousingByIds: `${STORAGE_SERVER}/warehousing/submitWarehousingByIds`,
  // 单个、批量删除入库信息
  deleteWarehousingByIds: `${STORAGE_SERVER}/warehousing/deleteWarehousingByIds`,
  // 入库导出
  exportWarehousingProcess: `${STORAGE_SERVER}/warehousing/exportWarehousingProcess`,
  // 入库模板下载
  downloadTemplate: `${STORAGE_SERVER}/warehousing/downloadTemplate`,
  // 入库导入
  importWarehousing: `${STORAGE_SERVER}/warehousing/importWarehousing`,
  // 入库统计图
  warehousingTrend: `${STORAGE_SERVER}/warehousing/warehousingTrend`,
  // 出库列表
  queryDeliveryList: `${STORAGE_SERVER}/delivery/queryDeliveryList`,
  // 出库统计图
  deliveryTrend: `${STORAGE_SERVER}/delivery/deliveryTrend`,
  // 新增出库物料
  addDelivery: `${STORAGE_SERVER}/delivery/addDelivery`,
  // 修改出库物料
  updateDeliveryById: `${STORAGE_SERVER}/delivery/updateDeliveryById`,
  // 根据id获取单个出库信息
  queryDeliveryById: `${STORAGE_SERVER}/delivery/queryDeliveryById`,
  // 提交出库信息
  submitDelivery: `${STORAGE_SERVER}/delivery/submitDeliveryByIds`,
  // 单个、批量删除出库物料
  deleteDeliveryByIds: `${STORAGE_SERVER}/delivery/deleteDeliveryByIds`,
  // 出库导出
  exportDeliveryList: `${STORAGE_SERVER}/delivery/exportDeliveryProcess`,
  // 出库模板下载
  downloadDeliveryTemplate: `${STORAGE_SERVER}/delivery/downloadTemplate`,
  // 出库导入
  importDeliveryList: `${STORAGE_SERVER}/delivery/importDelivery`
};
