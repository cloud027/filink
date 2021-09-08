import {Observable} from 'rxjs';

export interface CallInterface {
  /**
   * 获取sip账号
   * @ param body
   */
  availableSipUser(body): Observable<Object>;

}
