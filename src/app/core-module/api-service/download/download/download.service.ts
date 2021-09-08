import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DownloadInterface} from './download.interface';
import {Observable} from 'rxjs';
import { DELETE_TASK, EXPORT_TASK_LIST, STOP_EXPORT} from '../download-request-url';

@Injectable()
export class DownloadService implements DownloadInterface {

  constructor(private $http: HttpClient) {
  }

  queryExportTaskList(body): Observable<Object> {
    return this.$http.post(`${EXPORT_TASK_LIST}`, body);
  }

  stopExport(id: string): Observable<Object> {
    return this.$http.get(`${STOP_EXPORT}/${id}`);
  }

  excelExport(path, body): Observable<Object> {
    return this.$http.post(`${path}`, body);
  }

  deleteTask(body): Observable<Object> {
    return this.$http.post(`${DELETE_TASK}`, body);
  }

  // queryExportTaskList(body): Observable<Object> {
  //   return this.$http.post(`${EXPORT_TASK_LIST}`, body);
  // }
  // batchDownLoadImages(body): Observable<Object> {
  //   return this.$http.post(`${BATCH_DOWN_LOAD_IMAGES}`, body);
  // }
}
