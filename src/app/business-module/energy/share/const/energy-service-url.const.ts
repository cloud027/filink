import {
  DEVICE_SERVER,
  ENERGY_SERVER_STATISTIC,
  STRATEGY,
  CENTER_CONTROLLER,
} from '../../../../core-module/api-service/api-common.config';

/**
 * 后端服务api路径常量
 */
export const EnergyServiceUrlConst = {
  // 查询项目列表
  getProjectListURL: `${DEVICE_SERVER}/deviceInfo/queryProjectInfoList`,
  // 获取能耗节点数据
  energyNodesListURL: `${DEVICE_SERVER}/energyConsumptionNode/energyConsumptionNodeListByPage`,
  // 能耗节点 列表 导出
  energyNodesListExportURL: `${DEVICE_SERVER}/energyConsumptionNode/exportEnergyConsumptionNodeList`,
  /** 能耗节点 列表 导入 */
  energyNodesListImportURL: `${DEVICE_SERVER}/energyConsumptionNode/batchImportEnergyConsumptionNodeInfo`,
  // 新增能耗节点
  energyNodesInsertURL: `${DEVICE_SERVER}/energyConsumptionNode/addEnergyConsumptionNode`,
  // 删除能耗节点
  energyNodesDeleteURL: `${DEVICE_SERVER}/energyConsumptionNode/deleteEnergyConsumptionNodeByIds`,
  // 修改能耗节点
  energyNodesUpdateURL: `${DEVICE_SERVER}/energyConsumptionNode/updateEnergyConsumptionNode`,
  // 根据 id 获取能耗节点数据
  energyNodesQueryByIdURL: `${DEVICE_SERVER}/energyConsumptionNode/getEnergyConsumptionNodeById`,
  /** 能耗节点 模板下载 */
  energyNodesDownloadTempURL: `${DEVICE_SERVER}/energyConsumptionNode/downloadTemplate`,

  // 根据 id 查询 采集设施
  energyNodesDeviceQueryByIdURL: `${DEVICE_SERVER}/energyConsumptionNode/getDeviceByPage`,
  // 根据 id 查询 采集设备
  energyNodesEquipmentQueryByIdURL: `${DEVICE_SERVER}/energyConsumptionNode/getNodeEquipmentByPage`,
  // 根据 id 查询 采集回路
  energyNodesLoopQueryByIdURL: `${DEVICE_SERVER}/energyConsumptionNode/getNodeLoopByPage`,

  // 查询设备名称是否已经存在
  queryEnergyNodesNameIsExist: `${DEVICE_SERVER}/equipmentInfo/queryEquipmentNameIsExist`,
  // 根据设施id查询挂载位置
  findMountPositionById: `${DEVICE_SERVER}/poleInfo/findMountPositionById`,
  // 查询网关端口
  queryGatewayPort: `${DEVICE_SERVER}/equipmentInfo/queryGatewayPort`,

  // 实时数据---------------------------------------------
  /** 监测实时数据的采集任务名称是否重复 */
  queryCollectionNameIsExistURL: `${DEVICE_SERVER}/dataCollect/checkCollectTaskNameExist`,
  // 实时数据
  realTimeDataListURL: `${CENTER_CONTROLLER}/realTimeData/listByPage`,

  /** 实时数据导出 */
  realTimeDataExportURL: `${CENTER_CONTROLLER}/realTimeData/exportList`,

  // 数据采集任务 列表
  dataCollectionTaskListURL: `${DEVICE_SERVER}/dataCollect/queryDataCollectList`,

  /** 数据采集任务 导出 */
  dataCollectionExportURL: `${DEVICE_SERVER}/dataCollect/exportList`,

  //  数据采集任务的启用状态 修改
  enableOrDisableStrategyURL: `${DEVICE_SERVER}/dataCollect/taskeEableOrDisable`,

  // 删除数据采集任务
  dataCollectionTaskDeleteURL: `${DEVICE_SERVER}/dataCollect/deleteDataCollectTask`,
  // 数据采集任务详情
  dataCollecttionTaskInfoURL: `${DEVICE_SERVER}/dataCollect/getDataCollectInfoById`,

  // 分组列表 详情
  queryGroupInfoListURL: `${DEVICE_SERVER}/groupInfo/queryGroupInfoList`,
  // 设备分组列表
  queryEquipmentGroupInfoListURL: `${DEVICE_SERVER}/groupInfo/queryGroupInfoListByEquipmentType`,

  /** 数据采集任务 获取区域分组  */
  queryAreaListURL: `${DEVICE_SERVER}/areaInfo/selectAreaInfoByAreaIds`,
  /** 数据采集任务 获取区域分组new  */
  areaDataCollectListByPage: `${DEVICE_SERVER}/areaInfo/areaDataCollectListByPage`,
  // 设备列表
  equipmentListByPageURL: `${DEVICE_SERVER}/equipmentInfo/equipmentListByPage`,

  // 数据采集任务 新增
  dataCollectTaskInsertURL: `${DEVICE_SERVER}/dataCollect/addDataCollectTask`,

  // 数据采集任务 编辑
  dataCollectTaskUpdateURL: `${DEVICE_SERVER}/dataCollect/updateDataCollectTask`,

  // 实时数据---------------------------------------------

  // ----------------------------------能耗统计-------------------------------------------------------
  // 能耗统计页面 头部的 card-list
  queryTotalEnergy_URL: `${ENERGY_SERVER_STATISTIC}/energyStatistics/queryTotalEnergy`,

  /** 能耗统计 查询 */
  queryEnergyStatisticData_URL: `${ENERGY_SERVER_STATISTIC}/energyStatistics/queryEnergyByCondition`,

  /** 统计排名 查询 */
  queryEnergyRankByCondition_URL: `${ENERGY_SERVER_STATISTIC}/energyStatistics/queryEnergyRankByCondition`,

  /** 能耗分析 查询 */
  queryEnergyAnalysisData_URL: `${ENERGY_SERVER_STATISTIC}/energyStatistics/analysisEnergyByCondition`,

  /** 能耗统计 列表导出 */
  exportEnergyStatistics_URL: `${ENERGY_SERVER_STATISTIC}/energyStatistics/exportEnergyStatistics`,
  // ----------------------------------能耗统计-------------------------------------------------------
};
