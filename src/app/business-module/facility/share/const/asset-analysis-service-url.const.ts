import {DEVICE_SERVER, PRODUCT_SERVER, TROUBLE_SERVER} from '../../../../core-module/api-service/api-common.config';

export const AssetAnalysisServiceUrlConst = {
  // 资产占比设施列表查询接口
  queryDeviceTypeCountByCondition: `${DEVICE_SERVER}/statistics/queryDeviceTypeCountByCondition`,
  // 资产占比设备列表查询接口
  queryEquipmentTypeCountByCondition: `${DEVICE_SERVER}/statistics/queryEquipmentTypeCountByCondition`,
  // 资产占比设施表格数据导出接口
  exportDeviceTypeCount: `${DEVICE_SERVER}/statistics/exportDeviceTypeCount`,
  // 资产占比设备表格数据导出接口
  exportEquipmentTypeCount: `${DEVICE_SERVER}/statistics/exportEquipmentTypeCount`,
  // 项目列表接口
  queryProjectInfoListByPage: `${PRODUCT_SERVER}/projectInfo/queryProjectInfoListByPage`,
  // 资产故障分布设施列表查询接口
  deviceProductTroubleGrowthRate: `${TROUBLE_SERVER}/troubleStatistics/deviceProductTroubleGrowthRate`,
  // 资产故障分布设备列表查询接口
  equipmentProductTroubleGrowthRate: `${TROUBLE_SERVER}/troubleStatistics/equipmentProductTroubleGrowthRate`,
  // 资产故障分布表格数据导出接口
  exportProductTroubleGrowthRate: `${TROUBLE_SERVER}/troubleStatistics/exportProductTroubleGrowthRate`,
  // 资产增长率设施列表查询接口
  queryDeviceTypeGrowthRate: `${DEVICE_SERVER}/statistics/queryDeviceTypeGrowthRate`,
  // 资产增长率设备列表查询接口
  queryEquipmentTypeGrowthRate: `${DEVICE_SERVER}/statistics/queryEquipmentTypeGrowthRate`,
  // 资产增长率设施表格数据导出接口
  exportDeviceTypeGrowthRate: `${DEVICE_SERVER}/statistics/exportDeviceTypeGrowthRate`,
  // 资产增长率设备表格数据导出接口
  exportEquipmentTypeGrowthRate: `${DEVICE_SERVER}/statistics/exportEquipmentTypeGrowthRate`,
};
