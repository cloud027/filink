import {DEVICE_SERVER} from '../../../../core-module/api-service/api-common.config';

export const CodingStandardServiceUrlConst = {
  // 查询编码标准列表
  codingRuleListByPage: `${DEVICE_SERVER}/codingRule/codingRuleListByPage`,
  // 查询可选字段
  queryCodingRuleField: `${DEVICE_SERVER}/codingRule/queryCodingRuleField`,
  // 启用编码标准
  enableCodingRule: `${DEVICE_SERVER}/codingRule/enableCodingRule`,
  // 禁用编码标准
  disableCodingRule: `${DEVICE_SERVER}/codingRule/disableCodingRule`,
  // 删除编码标准
  deleteCodingRule: `${DEVICE_SERVER}/codingRule/deleteCodingRule`,
  // 获取资产类型设施设备集
  queryDeviceTypeList: `${DEVICE_SERVER}/codingRule/queryDeviceTypeList`,
  // 新增编码标准
  addCodingRule: `${DEVICE_SERVER}/codingRule/addCodingRule`,
  // 编辑编码标准
  updateCodingRule: `${DEVICE_SERVER}/codingRule/updateCodingRule`,
  // 查询编码标准明细
  queryCodingRuleInfo: `${DEVICE_SERVER}/codingRule/queryCodingRuleInfo`,
  // 编码标准名称重复性校验
  queryCodingRuleNameIsExist: `${DEVICE_SERVER}/codingRule/queryCodingRuleNameIsExist`
};
