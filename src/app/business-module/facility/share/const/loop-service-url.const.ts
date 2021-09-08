import {DEVICE_SERVER, STRATEGY} from '../../../../core-module/api-service/api-common.config';

/**
 * 回路后端服务api路径常量
 */
export const LoopRequestUrlConst = {
  // 根据区域id查询设施信息
  queryLoopMapByDevice: `${DEVICE_SERVER}/deviceInfo/queryDevicePolymerizations`,
  // 检验回路名称是否唯一
  queryLoopNameIsExist: `${DEVICE_SERVER}/loopInfo/queryLoopNameIsExist`,
  // 新增回路
  addLoop: `${DEVICE_SERVER}/loopInfo/addLoop`,
  // 编辑回路
  updateLoopById: `${DEVICE_SERVER}/loopInfo/updateLoopById`,
  // 删除回路
  deleteLoopByIds: `${DEVICE_SERVER}/loopInfo/deleteLoopByIds`,
  // 根据设施ids分页查询回路列表
  loopListByPageByDeviceIds: `${DEVICE_SERVER}/loopInfo/loopListByPageByDeviceIds`,
  // 移入回路
  moveIntoLoop: `${DEVICE_SERVER}/loopInfo/moveInLoopById`,
  // 检验回路编号是否唯一
  queryLoopCodeIsExist: `${DEVICE_SERVER}/loopInfo/queryLoopCodeIsExist`,
  // 拉合闸下发
  pullBrakeOperate: `${STRATEGY}/instruct/instructDistribute`,
  // 设备配置详情
  queryEquipmentById: `${STRATEGY}/equipmentData/queryEquipmentById`,
  // 导出回路列表
  exportLoopList: `${DEVICE_SERVER}/loopInfo/exportLoopList`,
  // 查询设施下挂载设备
  queryEquipmentInfoList: `${DEVICE_SERVER}/equipmentInfo/queryEquipmentInfoList`,
};
