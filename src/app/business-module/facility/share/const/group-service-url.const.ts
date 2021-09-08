import {DEVICE_SERVER, STRATEGY} from '../../../../core-module/api-service/api-common.config';

/**
 * 分组管理后台api 访问地址
 */
export const GroupServiceUrlConst = {
  // 校验分组名称是否重复
  checkGroupInfoByName: `${DEVICE_SERVER}/groupInfo/checkGroupInfoByName`,
  // 查询分组列表
  queryGroupInfoList: `${DEVICE_SERVER}/groupInfo/queryGroupInfoList`,
  // 新增分组信息
  addGroupInfo: `${DEVICE_SERVER}/groupInfo/addGroupInfo`,
  // 移除分组
  moveOutGroupById: `${DEVICE_SERVER}/groupInfo/moveOutGroupById`,
  // 删除分组
  delGroupInfByIds: `${DEVICE_SERVER}/groupInfo/delGroupInfByIds`,
  // 快速分组选择设备
  quickSelectGroupEquipmentInfoList: `${DEVICE_SERVER}/equipmentInfo/equipmentListByPage`,
  // 快速分组时选择设施
  quickSelectGroupDeviceInfoList: `${DEVICE_SERVER}/deviceInfo/deviceListByPage`,
  // 修改功能查询分组下的设施和设备id
  queryGroupDeviceAndEquipmentByGroupInfoId: `${DEVICE_SERVER}/groupInfo/queryGroupDeviceAndEquipmentByGroupInfoId`,
  // 修改分组信息
  updateGroupInfo: `${DEVICE_SERVER}/groupInfo/updateGroupInfo`,
  // 查询分组控制的节目信息
  queryProgramList: `${STRATEGY}/program/queryProgramList`,
  // 根据分组id查询所有的设备类型
  listEquipmentTypeByGroupId: `${DEVICE_SERVER}/groupInfo/listEquipmentTypeByGroupId`,
  // 未分组设施接口
  notInGroupForDeviceMap  : `${DEVICE_SERVER}/groupInfo/notInGroupForDeviceMap`,
  notInGroupForEquipmentMap  : `${DEVICE_SERVER}/groupInfo/notInGroupForEquipmentMap`,
  getDeviceMapByGroupIds  : `${DEVICE_SERVER}/groupInfo/getGroupDevicePointCenterMap`,
  getEquipmentMapByGroupIds  : `${DEVICE_SERVER}/groupInfo/getGroupEquipmentPointCenterMap`,
};
