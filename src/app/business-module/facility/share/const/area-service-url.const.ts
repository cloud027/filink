import {DEVICE_SERVER} from '../../../../core-module/api-service/api-common.config';

export const AreaServiceUrlConst = {
  // 删除区域
  deleteAreaByIds: `${DEVICE_SERVER}/areaInfo/deleteAreaByIds`,
  // 导出区域列表数据
  exportAreaData: `${DEVICE_SERVER}/areaInfo/exportData`,
  // 新增区域信息
  addArea: `${DEVICE_SERVER}/areaInfo/addArea`,
  // 修改区域信息
  updateAreaById: `${DEVICE_SERVER}/areaInfo/updateAreaById`,
  // 查看区域详情信息
  queryAreaById: `${DEVICE_SERVER}/areaInfo/queryAreaById`,
  // 查询区域名称是否存在
  queryAreaNameIsExist: `${DEVICE_SERVER}/areaInfo/queryAreaNameIsExist`,
};
