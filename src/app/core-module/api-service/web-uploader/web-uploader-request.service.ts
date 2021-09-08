import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WebUploaderUrl} from './web-uploader-request-url';
import {ResultModel} from '../../../shared-module/model/result.model';
import {WebUploaderModel} from '../../../shared-module/model/web-uploader.model';

/**
 * 大文件上传
 */
@Injectable()
export class WebUploaderRequestService {

  constructor(
    private $http: HttpClient
  ) {}

  /**
   * 获取配置
   */
  getConfigInfo(): Observable<Object> {
    return this.$http.get(WebUploaderUrl.configUrl);
  }

  /**
   * 校验文件
   */
  checkLoadFile(body: WebUploaderModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(WebUploaderUrl.checkUrl, body);
  }

  /**
   * 删除文件
   */
  deleteLoadFile(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WebUploaderUrl.deleteUrl, body);
  }

  /**
   * 回调方法配置
   */
  callbackUpload(body: WebUploaderModel): Observable<Object> {
    return this.$http.post(WebUploaderUrl.callbackUrl, body);
  }
}
