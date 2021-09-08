import {Observable} from 'rxjs';

export interface ApplicationCommonInterface {
  /**
   * 根据设备ID 查询当前设备播放的节目信息
   * @ param id
   */
  queryEquipmentCurrentPlayProgram(id: string): Observable<Object>;
}
