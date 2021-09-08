import {DEVICE_SERVER, TROUBLE_SERVER} from '../api-common.config';

// 故障类型
export const QUERY_TROUBLE_TYPE = `${TROUBLE_SERVER}/trouble/queryTroubleTypeList`;
// 故障详情
export const QUERY_TROUBLE_DETAIL = `${TROUBLE_SERVER}/trouble/queryTroubleById`;
// 根据区域code及用户id查询同级和下级单位信息
export const QUERY_UNIT_BY_AREA_CODE = `${DEVICE_SERVER}/areaInfo/listDepartmentByAreaAndUserId`;
