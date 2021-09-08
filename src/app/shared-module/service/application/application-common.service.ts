import {ApplicationCommonInterface} from './application-common.interface';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CURRENT_PLAY_PROGRAM} from './application-common-url';

@Injectable()
export class ApplicationCommonService implements ApplicationCommonInterface {
  constructor(
    private $http: HttpClient
  ) {
  }

  /**
   * 根据设备ID 查询当前设备播放的节目信息
   * @ param id
   */
  queryEquipmentCurrentPlayProgram(id: string): Observable<Object> {
    return this.$http.get(`${CURRENT_PLAY_PROGRAM}/${id}`);
  }
}
