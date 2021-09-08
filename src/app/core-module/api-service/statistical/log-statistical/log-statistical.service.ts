import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LogStatisticalInterface } from './log-statistical.interface';
import { Observable } from 'rxjs';
import {
    LOG_STATISTICAL_TEMPLATE_LIST,
    LOG_STATISTICAL_TEMPLATE_BY_ID,
    LOG_STATISTICAL_TEMPLATE_INSERT,
    LOG_STATISTICAL_TEMPLATE_UPDATE,
    LOG_STATISTICAL_TEMPLATE_DELETE,
    LOG_STATISTICAL_BY_LOG_TYPE,
    LOG_STATISTICAL_BY_OPERATE_TYPE,
    LOG_STATISTICAL_BY_SECURITY_TYPE,
    LOG_TYPE_EXPORT,
    OPERATE_TYPE_EXPORT,
    SECURITY_LEVEL_EXPORT
} from '../statistical-request-url';

@Injectable()
export class LogStatisticalService implements LogStatisticalInterface {

    constructor(private $http: HttpClient) { }
    /**
     *查询日志统计模板列表
     */
    queryLogTemplateList(body): Observable<Object> {
        return this.$http.post(`${LOG_STATISTICAL_TEMPLATE_LIST}`, body);
    }


    /**
     *id查询日志统计模板
     */
    queryLogTemplateById(id): Observable<Object> {
        return this.$http.get(`${LOG_STATISTICAL_TEMPLATE_BY_ID}/${id}`);
    }

    /**
     *新增日志统计模板
     */
    addLogTemplate(body): Observable<Object> {
        return this.$http.post(`${LOG_STATISTICAL_TEMPLATE_INSERT}`, body);
    }


    /**
    *修改日志统计模板
    */
    updateLogTemplate(body): Observable<Object> {
        return this.$http.post(`${LOG_STATISTICAL_TEMPLATE_UPDATE}`, body);
    }


    /**
    *删除日志统计模板
    */
    deleteLogTemplate(body): Observable<Object> {
        return this.$http.post(`${LOG_STATISTICAL_TEMPLATE_DELETE}`, body);
    }


    /**
     * 查询日志类型统计信息
     */
    queryLogTypeCount(body): Observable<Object> {
        return this.$http.post(`${LOG_STATISTICAL_BY_LOG_TYPE}`, body);
    }

    /**
    * 查询操作类型统计信息
    */
    queryOperateTypeCount(body): Observable<Object> {
        return this.$http.post(`${LOG_STATISTICAL_BY_OPERATE_TYPE}`, body);
    }


    /**
    * 查询危险级别类型统计信息
    */
    querySecurityTypeCount(body): Observable<Object> {
        return this.$http.post(`${LOG_STATISTICAL_BY_SECURITY_TYPE}`, body);
    }


    /**
    * 日志类型导出
    */
    logTypeExport(body): Observable<Object> {
        return this.$http.post(`${LOG_TYPE_EXPORT}`, body);
    }


    /**
    * 操作类型导出
    */
    operateTypeExport(body): Observable<Object> {
        return this.$http.post(`${OPERATE_TYPE_EXPORT}`, body);
    }


    /**
   * 危险级别导出
   */
    securityLevelExport(body): Observable<Object> {
        return this.$http.post(`${SECURITY_LEVEL_EXPORT}`, body);
    }

}


