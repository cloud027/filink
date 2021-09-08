import {LOG_SERVER} from '../../../../core-module/api-service/api-common.config';

const LOG_STATISTICAL = `${LOG_SERVER}/log`;
const LOG_STATISTICAL_TEMPLATE = `${LOG_SERVER}/logTemplate`;
export const LogUrl = {
  LOG_STATISTICAL_TEMPLATE_LIST: `${LOG_STATISTICAL_TEMPLATE}/queryList`,

// 日志统计模板id查询
  LOG_STATISTICAL_TEMPLATE_BY_ID: `${LOG_STATISTICAL_TEMPLATE}/query`,

// 新增日志统计模板
  LOG_STATISTICAL_TEMPLATE_INSERT: `${LOG_STATISTICAL_TEMPLATE}/insert`,

// 修改日志统计模板
  LOG_STATISTICAL_TEMPLATE_UPDATE: `${LOG_STATISTICAL_TEMPLATE}/update`,

// 删除日志统计模板
  LOG_STATISTICAL_TEMPLATE_DELETE: `${LOG_STATISTICAL_TEMPLATE}/delete`,

// 日志类型统计
  LOG_STATISTICAL_BY_LOG_TYPE: `${LOG_STATISTICAL}/countByLogType`,

// 操作类型统计
  LOG_STATISTICAL_BY_OPERATE_TYPE: `${LOG_STATISTICAL}/countByOperateType`,

// 危险级别统计
  LOG_STATISTICAL_BY_SECURITY_TYPE: `${LOG_STATISTICAL}/countBySecurityType`,
  // 日志类型导出
  LOG_TYPE_EXPORT: `${LOG_STATISTICAL}/exportLogType`,

// 操作类型导出
  OPERATE_TYPE_EXPORT: `${LOG_STATISTICAL}/exportOperateType`,

// 危险级别导出
  SECURITY_LEVEL_EXPORT: `${LOG_STATISTICAL}/exportSecurityLevel`,
};
