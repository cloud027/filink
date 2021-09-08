import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LogUrl} from '../const/log-url';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {EditLogTemplateModel} from '../model/log/edit-log-template.model';
import {LogTemplateDetailModel} from '../model/log/log-template-detail.model';
import {LogResultModel} from '../model/log/log-result.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';

@Injectable()
export class LogStatisticalService {

  constructor(private $http: HttpClient) {
  }
  /**
   *查询日志统计模板列表
   */
  queryLogTemplateList(body: QueryConditionModel): Observable<ResultModel<LogTemplateDetailModel[]>> {
    return this.$http.post<ResultModel<LogTemplateDetailModel[]>>(`${LogUrl.LOG_STATISTICAL_TEMPLATE_LIST}`, body);
  }


  /**
   *id查询日志统计模板
   */
  queryLogTemplateById(id: string): Observable<ResultModel<LogTemplateDetailModel>> {
    return this.$http.get<ResultModel<LogTemplateDetailModel>>(`${LogUrl.LOG_STATISTICAL_TEMPLATE_BY_ID}/${id}`);
  }

  /**
   *新增日志统计模板
   */
  addLogTemplate(body: EditLogTemplateModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LogUrl.LOG_STATISTICAL_TEMPLATE_INSERT}`, body);
  }


  /**
   *修改日志统计模板
   */
  updateLogTemplate(body: EditLogTemplateModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LogUrl.LOG_STATISTICAL_TEMPLATE_UPDATE}`, body);
  }


  /**
   *删除日志统计模板
   */
  deleteLogTemplate(body: EditLogTemplateModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LogUrl.LOG_STATISTICAL_TEMPLATE_DELETE}`, body);
  }


  /**
   * 查询日志类型统计信息
   */
  queryLogTypeCount(body: QueryConditionModel): Observable<ResultModel<LogResultModel>> {
    return this.$http.post<ResultModel<LogResultModel>>(`${LogUrl.LOG_STATISTICAL_BY_LOG_TYPE}`, body);
  }

  /**
   * 查询操作类型统计信息
   */
  queryOperateTypeCount(body: QueryConditionModel): Observable<ResultModel<LogResultModel>> {
    return this.$http.post<ResultModel<LogResultModel>>(`${LogUrl.LOG_STATISTICAL_BY_OPERATE_TYPE}`, body);
  }


  /**
   * 查询危险级别类型统计信息
   */
  querySecurityTypeCount(body: QueryConditionModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${LogUrl.LOG_STATISTICAL_BY_SECURITY_TYPE}`, body);
  }


  /**
   * 日志类型导出
   */
  logTypeExport(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LogUrl.LOG_TYPE_EXPORT}`, body);
  }


  /**
   * 操作类型导出
   */
  operateTypeExport(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LogUrl.OPERATE_TYPE_EXPORT}`, body);
  }


  /**
   * 危险级别导出
   */
  securityLevelExport(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LogUrl.SECURITY_LEVEL_EXPORT}`, body);
  }
}
