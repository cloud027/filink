/**
 * Created by wh1709040 on 2019/1/7.
 */
import {
  ALARM_CURRENT_SERVER,
  COMMON_PREFIX,
  DEVICE_SERVER,
  LOCK_SERVER,
  SMART_SERVER,
  USER_SERVER,
  WORK_ORDER_SERVER,
} from '../api-common.config';
// import {COMMON_PREFIX, DEVICE_SERVER, DEVICE_PICTURE} from '../api-common.config';

// 获取区域列表
const USER = `${USER_SERVER}/user`;
const AREA_INFO = `${DEVICE_SERVER}/areaInfo`;
const DEVICE_PREFIX = `${DEVICE_SERVER}/deviceInfo`;
const PARTS_PREFIX = `${DEVICE_SERVER}/partInfo`;
const DEVICE_CONFIG_PREFIX = `${DEVICE_SERVER}/deviceConfig`;
const DEVICE_LOG = `${DEVICE_SERVER}/deviceLog`;
const PICTURE_VIEW = `${DEVICE_SERVER}/picRelationInfo`;
const SMART_TEMPLATE = `${SMART_SERVER}/template`;
const SMART_INFO = `${SMART_SERVER}`;
const CORE_END = `${SMART_SERVER}`;
const CONTROL = `${LOCK_SERVER}/control`;

export const GET_AREA_LIST = `${AREA_INFO}/areaListByPage`;
export const QUERY_AREA_LIST = `${AREA_INFO}/queryAreaBaseInfoList`;
export const SELECT_FOREIGN_AREA_INFO = `${AREA_INFO}/selectForeignAreaInfo`;
export const SELECT_FOREIGN_AREA_INFO_FOR_PAGE_COLLECTION = `${AREA_INFO}/selectForeignAreaInfoForPageSelection`;
// 新增区域信息
export const ADD_AREA = `${AREA_INFO}/addArea`;
// 修改区域信息
export const UPDATE_AREA_BY_ID = `${AREA_INFO}/updateAreaById`;
// 删除区域信息
export const DELETE_AREA_BY_IDS = `${AREA_INFO}/deleteAreaByIds`;
// 查看区域详情信息
export const QUERY_AREA_BY_ID = `${AREA_INFO}/queryAreaById`;
// 查询区域是否可以更改
export const QUERY_NAME_CAN_CHANGE = `${AREA_INFO}/queryAreaDetailsCanChange`;
// 关联设施信息
export const SET_AREA_DEVICE = `${AREA_INFO}/setAreaDevice`;
// 查询区域名称是否存在
export const QUERY_AREA_NAME_IS_EXIST = `${AREA_INFO}/queryAreaNameIsExist`;
// 导出区域列表数据
export const EXPORT_AREA_DATA = `${AREA_INFO}/exportData`;
// 根据部门id查区域信息
export const QUERY_AREA_BY_DEPT_ID = `${AREA_INFO}/selectAreaInfoByDeptIdsForView`;
// 查询统一授权范围
export const DEVICE_LIST_BY_Lock_PAGE = `${DEVICE_PREFIX}/deviceListOfLockByPage`;
// 查询设施类型数量
export const QUERY_DEVICE_TYPE_COUNT = `${DEVICE_SERVER}/statistics/queryDeviceTypeCount`;
// 查询设施详情是否可以修改
export const DEVICE_CAN_CHANGE_DETAIL = `${DEVICE_PREFIX}/deviceCanChangeDetail`;
// 获取设施配置策略
export const GET_DEVICE_STRATEGY = `${DEVICE_PREFIX}/getDeviceStrategy`;
// 设置设施配置策略
export const SET_DEVICE_STRATEGY = `${DEVICE_PREFIX}/setDeviceStrategy`;
// 查询设施名称是否存在
export const QUERY_DEVICE_NAME_IS_EXIST = `${DEVICE_PREFIX}/queryDeviceNameIsExist`;
// 查询设施日志
export const DEVICE_LOG_LIST_BY_PAGE = `${DEVICE_LOG}/deviceLogListByPage`;
// 最后一条设施日志的时间
export const DEVICE_LOG_TIME = `${DEVICE_LOG}/queryRecentDeviceLogTime`;
// 获取详情页的code码
export const GET_DETAIL_CODE = `${DEVICE_SERVER}/deviceProtocol/getDetailCode`;
// 获取配置策略配置项
export const GET_PRAMS_CONFIG = `${DEVICE_CONFIG_PREFIX}/getPramsConfig`;
// 导出设施列表数据
export const EXPORT_DEVICE_LIST = `${DEVICE_PREFIX}/exportDeviceList`;
// 查询设施心跳时间
export const QUERY_HEARTBEAT_TIME = `${DEVICE_LOG}/queryRecentDeviceLogTime`;
// 导出设施日志列表
export const EXPORT_LOG_LIST = `${DEVICE_LOG}/exportDeviceLogList`;

// 设施图片
export const PIC_RELATION_INFO = `${PICTURE_VIEW}/getPicDetailForNew`;

// 获取配件列表
export const PARTS_LIST_PAGE = `${PARTS_PREFIX}/partListByPage`;
// 添加配件
export const ADD_PARTS = `${PARTS_PREFIX}/addPart`;
// 异步校验配件名称
export const PART_NAME_XSI = `${PARTS_PREFIX}/queryPartNameIsExisted`;
// 删除配件
export const DElETE_PARTS = `${PARTS_PREFIX}/deletePartByIds`;
// 查询单个配件详情
export const FIND_PART_BY_ID = `${PARTS_PREFIX}/findPartById`;
// 修改单个配件
export const UPDATE_PARTS = `${PARTS_PREFIX}/updatePartById`;
// 导出配件列表
export const EXPORT_PARTS = `${PARTS_PREFIX}/exportPartList`;
// 根单位查询所属人域查询
export const QUERY_USER_BY_DEPT = `${USER}/queryUserByDept`;
// 图片查看相关httpUrl
export const pictureViewHttpUrl = {
  imageListByPage: `${PICTURE_VIEW}/imageListByPage`,
  deleteImageIsDeletedByIds: `${PICTURE_VIEW}/deleteImageIsDeletedByIds`,
  batchDownLoadImages: `${PICTURE_VIEW}/batchDownLoadImages`,
  getPicUrlByAlarmIdAndDeviceId: `${PICTURE_VIEW}/getPicUrlByAlarmIdAndDeviceId`,
  getPicUrlByAlarmId: `${PICTURE_VIEW}/getPicUrlByAlarmId`,
  getProcessByProcId: `${WORK_ORDER_SERVER}/order/picture/getLocationTypeByProcId`,
  queryIsStatus: `${ALARM_CURRENT_SERVER}/alarmCurrent/queryIsStatus/`
};
// 实景图相关httpUrl
export const smartHttpUrl = {
  createTemplate: `${SMART_TEMPLATE}/createTemplate`,
  queryDetailedTemplate: `${SMART_TEMPLATE}/queryDetailedTemplate`,
  queryAllTemplate: `${SMART_TEMPLATE}/queryAllTemplate`,
  queryRealPosition: `${SMART_TEMPLATE}/queryRealPosition`,
  queryRealPositionByFrame: `${SMART_TEMPLATE}/queryRealPositionByFrame`,
  queryPortInfoByPortId: `${SMART_TEMPLATE}/queryPortInfoByPortId`,
  // 查询对端端口信息
  queryJumpFiberInfoByPortInfo: `${COMMON_PREFIX}${SMART_SERVER}/jumpFiberInfo/queryJumpFiberInfoByPortInfo`,
  // 删除对端端口信息
  deleteJumpFiberInfoById: `${COMMON_PREFIX}${SMART_SERVER}/jumpFiberInfo/deleteJumpFiberInfoById`,
  // 获取智能标签信息
  querySmartInfo: `${SMART_INFO}/facility/queryFacilityInfo`,
  // 更新设施专属业务信息
  uploadFacilityBusinessInfo: `${SMART_INFO}/facility/uploadFacilityBusInfo`,
  // 通过id查询设施专属业务信息
  queryFacilityBusInfoById: `${SMART_INFO}/facility/queryFacilityBusInfoById`,
  // 跳纤侧端口统计
  queryLocalPortInformation: `${SMART_INFO}/odnFacilityResources/devicePortStatistics`,
  // 导出对端端口信息
  exportJumpFiberInfoByPortInfo: `${SMART_SERVER}/jumpFiberInfo/exportJumpFiberList`,
  // 端口右键上下架状态修改
  updatePortState: `${SMART_TEMPLATE}/updatePortState`,
  // 模板删除
  deleteTemplate: `${SMART_TEMPLATE}/deleteTemplate`,
  // 模板修改
  updateTemplate: `${SMART_TEMPLATE}/updateTemplate`,
};

// 获取光缆信息列表
export const GET_CABLE_LIST = `${SMART_SERVER}/opticCableInfo/opticCableListByPage`;
// 新增光缆信息
export const ADD_CABLE = `${SMART_SERVER}/opticCableInfo/addOpticCable`;
// 根据光缆id查询详情
export const QUERY_CABLE_BY_ID = `${SMART_SERVER}/opticCableInfo/queryOpticCableById`;
// 光缆名称校验
export const CHECK_CABLE_NAME = `${SMART_SERVER}/opticCableInfo/checkOpticCableName`;
// 编辑光缆信息
export const UPDATE_CABLE = `${SMART_SERVER}/opticCableInfo/updateOpticCableById`;
// 删除光缆信息
export const DELETE_CABLE_BY_ID = `${SMART_SERVER}/opticCableInfo/deleteOpticCableById`;
// 光缆列表导出
export const EXPORT_CABLE_LIST = `${SMART_SERVER}/opticCableInfo/exportOpticCableList`;

// 获取光缆段列表
export const GET_CABLE_SEGMENT_LIST = `${SMART_SERVER}/opticCableSectionInfo/opticCableSectionById`;
// 根据光缆段id查询光缆段gis信息
export const GET_OPTICCABLESECTIONID = `${SMART_SERVER}/opticCableSectionRfidInfo/queryOpticCableSectionRfidInfoByOpticCableId`;
export const UPDATE_CABLEQUERYBYID = `${SMART_SERVER}/opticCableSectionRfidInfo/updateOpticCableSectionRfidInfoPositionById`;
export const FIND_FO_BYOPTIC_CABLE = `${SMART_SERVER}/opticCableSectionRfidInfo/queryOpticCableSectionRfidInfoByOpticCableSectionId`;
// 根据光缆ID查询光缆拓扑
export const GET_TOPOLGY = `filink-rfid-server/opticCableSectionInfo/opticCableSectionByIdForTopology`;
// 获取智能标签列表
export const GET_SMART_LABEL_LIST = `${SMART_SERVER}/opticCableSectionRfidInfo/OpticCableSectionRfidInfoById`;
// 智能标签列表删除
export const DELETE_RFID_INFO_BY_ID = `${SMART_SERVER}/opticCableSectionRfidInfo/deleteOpticCableSectionRfidInfoById`;
// 获取纤芯成端初始化信息
export const GET_THE_CORE_END_INITIALIZATION = `${CORE_END}/portCableCoreInfo/getPortCableCoreInfo`;
// 获取光缆段信息
export const GET_CABLE_SEGMENT_INFORMATION = `${CORE_END}/opticCableSectionInfo/selectOpticCableSectionByDeviceId`;
// 光缆段列表导出
export const EXPORT_CABLE_SECTION_LIST = `${SMART_SERVER}/opticCableSectionInfo/exportOpticCableSectionList`;
// 删除光缆段信息
export const DELETE_CABLE_SECTION_BY_ID = `${SMART_SERVER}/opticCableSectionInfo/deleteOpticCableSectionByOpticCableSectionId`;
// 获取箱的AB面信息
export const GET_THE_AB_SURFACE_INFORMATION_OF_THE_BOX = `${CORE_END}/template/queryFormationByDeviceId`;
// 查询设施框信息
export const QUERY_FACILITY_BOX_INFORMATION = `${CORE_END}/template/queryFormationByFrameId`;
// 保存纤芯成端信息
export const SAVE_CORE_INFORMATION = `${CORE_END}/portCableCoreInfo/savePortCableCoreInfo`;
// 获取其他设施成端信息
export const GET_PORT_CABLE_CORE_INFO_NOT_IN_DEVICE = `${CORE_END}/portCableCoreInfo/getPortCableCoreInfoNotInDevice`;
// 获取其他设施熔纤信息
export const QUERY_CORE_CORE_INFO_NOT_IN_DEVICE = `${CORE_END}/coreCoreInfo/queryCoreCoreInfoNotInDevice`;

// 根据2条光缆段id获取熔纤信息(在设施里)
export const GET_THE_FUSE_INFORMATION = `${SMART_SERVER}/coreCoreInfo/queryCoreCoreInfo`;
// 查询设施里的成端的信息
export const GET_PORT_CABLE_CORE_INFORMATION = `${SMART_SERVER}/portCableCoreInfo/getPortCableCoreInfo`;
// 根据2条光缆段id及设施id获取不在设施熔纤信息
export const GET_THE_FUSED_FIBER_INFORMATION = `${SMART_SERVER}/coreCoreInfo/queryCoreCoreInfoNotInDevice`;
// 保存熔纤信息
export const SAVE_THE_CORE_INFORMATION = `${SMART_SERVER}/coreCoreInfo/saveCoreCoreInfo`;
// 单个光缆详情
export const QUERY_TOPOLOGY_BY_ID = `${SMART_SERVER}/opticCableInfo/queryOpticCableById`;
// 根据设施id查询当前用户是否存在全部设施权限
export const DEVICEID_CHECK_USER_IF_DEVICE_PERMISSION = `${SMART_SERVER}/opticCableSectionInfo/existIsPermissionDeviceByDeviceIdList`;
// 根据设施id查询当前用户有权限的设施信息
export const DEVICEID_CHECK_USER_IF_DEVICEDATA = `${SMART_SERVER}/opticCableSectionInfo/checkIsPermissionDeviceByDeviceIdList`;
// 导出主控信息
export const EXPERT_CONTROL = `${CONTROL}/exportControl`;
// 获取主控列表
export const GET_CONTROL_BY_PACKAGE = `${CONTROL}/getControlByPage`;
// 更新套餐
export const UPDATE_SIM_PACKAGE = `${CONTROL}/updateSimPackage`;


// 查询设施列表 DEVICE_SERVER
export const DEVICE_LIST_BY_PAGE = `${DEVICE_SERVER}/deviceInfo/deviceListByPage`;
// 根据设施类型获取型号、供应商、报废年限信息
export const GET_MODEL = `${DEVICE_SERVER}/deviceInfo/getDeviceModelByType`;
// 名称自动生成
export const AUTO_DEVICE_NAME = `${DEVICE_PREFIX}/getDeviceNameByCityAndType`;
export const DEVICE_MIGRATION = `${DEVICE_PREFIX}/deviceMigration`;
export const DEVICE_MIGRATION_WITH_NEW_AREA = `${DEVICE_PREFIX}/deviceMigrationWithNewArea`;
export const EQUIPMENT_MIGRATION = `${DEVICE_SERVER}/equipmentInfo/equipmentMigration`;
export const EQUIPMENT_MIGRATION_WITH_NEW_AREA = `${DEVICE_SERVER}/equipmentInfo/equipmentMigrationWithNewArea`;
// 设施详情挂载设备概览列表
export const QUERY_MOUNT_EQUIPMENT = `${DEVICE_SERVER}/equipmentInfo/queryEquipmentInfoList`;
// 编辑设施
export const UPDATE_DEVICE_BY_ID = `${DEVICE_SERVER}/deviceInfo/updateDeviceById`;

// 上传图片
export const UPLOAD_IMG = `${DEVICE_SERVER}/picRelationInfo/uploadImageForLive`;
// 查询项目列表
export const GET_PROJECT_LIST = `${DEVICE_PREFIX}/queryProjectInfoList`;
// 下载模板
export const DOWNLOAD_TEMPLATE = `${DEVICE_PREFIX}/downloadTemplate`;
// 导入
export const IMPORT_DEVICE = `${DEVICE_PREFIX}/importDeviceInfo`;
// 查询带权限区域
export const QUERY_AREA = `${DEVICE_SERVER}/areaInfo/areaListByPage`;
// 查询实景图
export const GET_PIC_DETAIL =  `${DEVICE_SERVER}/picRelationInfo/getPicDetail`;
// 校验资产编码
export const CHECK_DEVICE_CODE = `${DEVICE_SERVER}/deviceInfo/checkDeviceCodeIsExist`;


