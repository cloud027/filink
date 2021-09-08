import {WORK_ORDER_SERVER} from '../../../../core-module/api-service/api-common.config';

const WORK_ORDER_STATISTICAL = `${WORK_ORDER_SERVER}/procStatistical`;
const WORK_ORDER_STATISTICAL_API = WORK_ORDER_SERVER;
// const WORK_ORDER_STATISTICAL_API = 'filink-workflow-business-server-ds';
export const WORK_ORDER_URL = {
  // 工单状态统计
  SALES_ORDER_STATUS: `${WORK_ORDER_STATISTICAL}/queryListProcGroupByProcStatus`,
  // 销障工单状态统计+
  QUERY_REPAIR_ORDER_STATUS_COUNT: `${WORK_ORDER_STATISTICAL_API}/repairOrder/queryRepairOrderStatusCount`,
// 工单处理方案统计
  SALES_ORDER_PROCESSING: `${WORK_ORDER_STATISTICAL}/queryListProcGroupByProcProcessingScheme`,
  // 销障工单处理方案统计+
  QUERY_REPAIR_ORDER_TREATMENT_PLAN_COUNT: `${WORK_ORDER_STATISTICAL_API}/repairOrder/queryRepairOrderTreatmentPlanCount`,
// 工单故障原因统计
  SALES_ORDER_FAILURE: `${WORK_ORDER_STATISTICAL}/queryListProcGroupByErrorReason`,
// 销障工单故障原因统计+
  QUERY_REPAIR_ORDER_CAUSE_REASON_COUNT: `${WORK_ORDER_STATISTICAL_API}/procStatistical/queryRepairOrderCauseReasonCount`,
// 工单设施类型统计
  WORK_ORDER_DEVICE_TYPE: `${WORK_ORDER_STATISTICAL}/queryListProcGroupByDeviceType`,
  // 销障工单设施类型统计+
  QUERY_REPAIR_ORDER_DEVICE_COUNT: `${WORK_ORDER_STATISTICAL_API}/repairOrder/queryRepairOrderDeviceCount`,
  // 巡检工单设施类型统计+
  QUERY_INSPECTION_DEVICE_COUNT: `${WORK_ORDER_STATISTICAL_API}/inspectionOrder/queryInspectionDeviceCount`,
// 工单区域工单比统计
  SALES_ORDER_AREA_PERCENT: `${WORK_ORDER_STATISTICAL}/queryListProcGroupByAreaPercent`,
// 工单区域工单比统计+
  QUERY_PROC_COUNT: `${WORK_ORDER_STATISTICAL_API}/procStatistical/queryProcCount`,
// 工单处理单位统计
  SALES_ORDER_UNITS: `${WORK_ORDER_STATISTICAL}/queryDeptListGroupByAccountabilityDept`,

// 工单增量统计
  WORK_ORDER_INCREMENT: `${WORK_ORDER_STATISTICAL}/queryProcAddListCountGroupByDay`,
// 工单统计列表导出相关
// 销障工单设施类型导出
  CLEAR_BARRIER_DEVICE_TYPE_EXPORT: `${WORK_ORDER_STATISTICAL}/procClearDeviceTypeStatisticalExport`,

// 销障工单状态导出
  CLEAR_BARRIER_STATUS_EXPORT: `${WORK_ORDER_STATISTICAL}/procClearStatusStatisticalExport`,

// 销障工单处理方案导出
  CLEAR_BARRIER_PROCESSING_EXPORT: `${WORK_ORDER_STATISTICAL}/procClearProcessingSchemeStatisticalExport`,

// 销障工单故障原因导出
  CLEAR_BARRIER_FAILURE_EXPORT: `${WORK_ORDER_STATISTICAL}/procClearErrorReasonStatisticalExport`,


// 销障工单区域比导出
  CLEAR_BARRIER_AREA_PERCENT_EXPORT: `${WORK_ORDER_STATISTICAL}/procClearAreaPercentStatisticalExport`,


// 巡检工单设施类型导出
  INSPECTION_DEVICE_TYPE_EXPORT: `${WORK_ORDER_STATISTICAL}/procInspectionDeviceTypeStatisticalExport`,

// 巡检工单状态导出
  INSPECTION_STATUS_EXPORT: `${WORK_ORDER_STATISTICAL}/procInspectionStatusStatisticalExport`,

// 巡检工单区域比导出
  INSPECTION_AREA_PERCENT_EXPORT: `${WORK_ORDER_STATISTICAL}/procInspectionAreaPercentStatisticalExport`,

  // 拆除工单设施类型导出
  DISMANTLE_DEVICE_TYPE_EXPORT: `${WORK_ORDER_STATISTICAL}/dismantleProcInspectionDeviceTypeStatisticalExport`,

// 拆除状态导出
  DISMANTLE_STATUS_EXPORT: `${WORK_ORDER_STATISTICAL}/dismantleProcInspectionStatusStatisticalExport`,

// 拆除工单区域比导出
  DISMANTLE_AREA_PERCENT_EXPORT: `${WORK_ORDER_STATISTICAL}/dismantleProcInspectionAreaPercentStatisticalExport`,
};
