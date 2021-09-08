import { Observable } from 'rxjs';

export interface LogStatisticalInterface {

    queryLogTemplateList(body): Observable<Object>;

    queryLogTemplateById(id): Observable<Object>;

    addLogTemplate(body): Observable<Object>;

    updateLogTemplate(body): Observable<Object>;

    deleteLogTemplate(body): Observable<Object>;

    queryLogTypeCount(body): Observable<Object>;

    queryOperateTypeCount(body): Observable<Object>;

    querySecurityTypeCount(body): Observable<Object>;

    logTypeExport(body): Observable<Object>;

    operateTypeExport(body): Observable<Object>;

    securityLevelExport(body): Observable<Object>;

}

