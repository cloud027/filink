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
  // 分组控制指令下发接口
  groupControl: `${STRATEGY}/instruct/groupControl`,
  // 根据分组id查询分组下面可用设备类型
  listEquipmentTypeByGroupId: `${DEVICE_SERVER}/groupInfo/listEquipmentTypeByGroupId`
};
