/**
 * 配件管理服务接口路径常量
 */
import {DEVICE_SERVER, USER_SERVER} from '../../../../core-module/api-service/api-common.config';

export const PartsServiceUrlConst = {
  // 获取配件列表
  partListByPage: `${DEVICE_SERVER}/partInfo/partListByPage`,
  // 添加配件
  addPart: `${DEVICE_SERVER}/partInfo/addPart`,
  // 异步校验配件名称
  queryPartNameIsExisted: `${DEVICE_SERVER}/partInfo/queryPartNameIsExisted`,
  // 删除配件
  deletePartByIds: `${DEVICE_SERVER}/partInfo/deletePartByIds`,
  // 查询单个配件详情
  findPartById: `${DEVICE_SERVER}/partInfo/findPartById`,
  // 修改单个配件
  updatePartById: `${DEVICE_SERVER}/partInfo/updatePartById`,
  // 导出配件列表
  exportPartList: `${DEVICE_SERVER}/partInfo/exportPartList`,
  // 根单位查询所属人域查询
  queryUserByDept: `${USER_SERVER}/user/queryUserByDept`,
};

