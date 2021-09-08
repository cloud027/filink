import {Observable} from 'rxjs';

export interface DownloadInterface {
  /**
   *查询导出任务列表
   */
  queryExportTaskList(body): Observable<Object>;

  /**
   * 停止导出任务列表
   */
  stopExport(id: string): Observable<Object>;

  /**
   * 中止导出后在执行
   */
  excelExport(path, body): Observable<Object>;

  /**
   * 删除导出任务
   */
  deleteTask(id: string): Observable<Object>;

  /**
   * 异常后重试
   */
  // batchDownLoadImages(body): Observable<Object>;
}


