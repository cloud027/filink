import {Injectable} from '@angular/core';
import {CallInterface} from './call.interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  AVAILABLE_SIP_USER
} from '../application-system-request-url';

@Injectable()
export class CallService implements CallInterface {

  constructor(private $http: HttpClient) {
  }

  /**
   * 获取sip账号
   * @ param body
   */
  availableSipUser(body): Observable<Object> {
    return this.$http.post(`${AVAILABLE_SIP_USER}`, body);
  }
}
