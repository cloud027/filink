import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EXPORT_TASK_LIST, STOP_EXPORT, DELETE_TASK} from '../const/download-url.const';
import {Observable} from 'rxjs';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ExcelExportModel} from '../model/excel-export.model';

@Injectable()
export class DownloadService {
  constructor(private $http: HttpClient) {
  }

  queryExportTaskList(body: QueryConditionModel): Observable<Object> {
    return this.$http.post(`${EXPORT_TASK_LIST}`, body);
  }

  stopExport(id: string): Observable<Object> {
    return this.$http.get(`${STOP_EXPORT}/${id}`);
  }

  excelExport(path, body: ExcelExportModel): Observable<Object> {
    return this.$http.post(`${path}`, body);
  }

  deleteTask(body: Array<string>): Observable<Object> {
    return this.$http.post(`${DELETE_TASK}`, body);
  }
}
