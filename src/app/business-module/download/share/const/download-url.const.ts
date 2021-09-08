import {SYSTEM_SERVER} from '../../../../core-module/api-service/api-common.config';

// 查询导出任务列表
export const EXPORT_TASK_LIST = `${SYSTEM_SERVER}/taskInfo/exportTaskListForPageSelection`;

// 停止导出任务列表
export const STOP_EXPORT = `${SYSTEM_SERVER}/taskInfo/stopExportForPageSelection`;

// 删除导出任务
export const DELETE_TASK = `${SYSTEM_SERVER}/taskInfo/deleteTaskForPageSelection`;
