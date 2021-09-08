import {SMART_SERVER} from '../../../../core-module/api-service/api-common.config';

/**
 * 纤芯服务接口路径常量
 */
export const CodeServiceUrlConst = {
  // 获取纤芯成端初始化信息
  getPortCableCoreInfo: `${SMART_SERVER}/portCableCoreInfo/getPortCableCoreInfo`,
  // 获取光缆段信息
  selectOpticCableSectionByDeviceId: `${SMART_SERVER}/opticCableSectionInfo/selectOpticCableSectionByDeviceId`,
  // 获取箱的AB面信息
  queryFormationByDeviceId: `${SMART_SERVER}/template/queryFormationByDeviceId`,
  // 查询设施框信息
  queryFormationByFrameId: `${SMART_SERVER}/template/queryFormationByFrameId`,
  // 保存纤芯成端信息
  savePortCableCoreInfo: `${SMART_SERVER}/portCableCoreInfo/savePortCableCoreInfo`,
  // 获取其他设施成端信息
  getPortCableCoreInfoNotInDevice: `${SMART_SERVER}/portCableCoreInfo/getPortCableCoreInfoNotInDevice`,
  // 获取其他设施熔纤信息
  queryCoreCoreInfoNotInDevice: `${SMART_SERVER}/coreCoreInfo/queryCoreCoreInfoNotInDevice`,
  // 根据2条光缆段id获取熔纤信息(在设施里)
  queryCoreCoreInfo: `${SMART_SERVER}/coreCoreInfo/queryCoreCoreInfo`,
  // 保存熔纤信息
  saveCoreCoreInfo: `${SMART_SERVER}/coreCoreInfo/saveCoreCoreInfo`
};
