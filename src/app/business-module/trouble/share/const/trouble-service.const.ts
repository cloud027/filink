import {DEVICE_SERVER, TROUBLE_SERVER, USER_SERVER, WORK_FLOW_SERVER} from '../../../../core-module/api-service/api-common.config';

// 故障列表
export const QUERY_TROUBLE_LIST = `${TROUBLE_SERVER}/trouble/troubleListByPage`;
// 故障卡片
export const QUERY_TROUBLE_SHOW_TYPE = `${TROUBLE_SERVER}/trouble/countTroubleByType`;
// 新增故障
export const ADD_TROUBLE = `${TROUBLE_SERVER}/trouble/addTrouble`;
// 删除故障
export const DELETE_TROUBLE = `${TROUBLE_SERVER}/trouble/deleteTroubleByIds`;
// 故障备注
export const TROUBLE_REMARK = `${TROUBLE_SERVER}/trouble/updateTroubleRemark`;
// 编辑故障
export const UPDATE_TROUBLE = `${TROUBLE_SERVER}/trouble/updateTroubleById`;
// 查看故障流程
export const QUERY_TROUBLE_PROCESS = `${TROUBLE_SERVER}/trouble/queryTroubleProcess`;
// 查看故障历史流程
export const QUERY_TROUBLE_PROCESS_HISTORY = `${TROUBLE_SERVER}/trouble/queryTroubleProcesslistHistory`;
// 查看故障历史流程带分分页
export const QUERY_TROUBLE_PROCESS_HISTORY_PAGE = `${TROUBLE_SERVER}/trouble/queryTroubleProcesslistHistoryPage`;
// 获取当前单位上级单位
export const GET_SUPERIOR_DEPARTMENT = `${USER_SERVER}/department/superiorDepartment`;
// 根据ID查询部门责任人
export const QUERY_DEPART_NAME = `${USER_SERVER}/department/queryDepartmentById`;
// 获取流程图
export const GET_FLOWCHART = `${WORK_FLOW_SERVER}/process/flowChart`;
// 故障指派
export const TROUBLE_ASSIGN = `${TROUBLE_SERVER}/trouble/assignTrouble`;
// 批量故障指派
export const TROUBLE_ASSIGN_ALL = `${TROUBLE_SERVER}/trouble/assignTroubles`;
// 故障设施
export const QUERY_DEVICE_LIST = `${DEVICE_SERVER}/deviceInfo/deviceListByPage`;
// 故障设备
export const QUERY_EQUIPMENT_LIST = `${DEVICE_SERVER}/equipmentInfo/equipmentListByPage`;
// 获取单位下所有人
export const QUERY_PERSON = `${USER_SERVER}/user/queryUserByDeptList`;
// 获取详情图片
export const GET_ALARM_PIC = `${DEVICE_SERVER}/picRelationInfo/getPicDetailForNew`;
// 查询设施信息
export const QUERY_FACILITY_INFO = `${DEVICE_SERVER}/deviceInfo/queryDeviceInfo`;
// 导出列表
export const EXPORT_TROUBLE_LIST = `${TROUBLE_SERVER}/trouble/exportTroubleList`;
