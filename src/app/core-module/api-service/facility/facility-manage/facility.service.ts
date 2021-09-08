import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  EXPERT_CONTROL,
  FIND_FO_BYOPTIC_CABLE,
  GET_CONTROL_BY_PACKAGE,
  QUERY_DEVICE_TYPE_COUNT,
  QUERY_HEARTBEAT_TIME,
  QUERY_TOPOLOGY_BY_ID,
  UPDATE_CABLEQUERYBYID,
  UPDATE_SIM_PACKAGE,
} from '../facility-request-url-old';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ControlInfo} from '../../../../business-module/facility/share/model/control-info';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {DeviceTypeCountModel} from '../../../model/facility/device-type-count.model';

/**
 * Created by xiaoconghu on 2019/1/14.
 */
@Injectable()
export class FacilityService {
  constructor(private $http: HttpClient) {
  }
  /**
   * 查询设施类型统计数量
   */
  public queryDeviceTypeCount(): Observable<ResultModel<Array<DeviceTypeCountModel>>> {
    return this.$http.get<ResultModel<Array<DeviceTypeCountModel>>>(`${QUERY_DEVICE_TYPE_COUNT}`);
  }

  public queryHeartbeatTime(id: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${QUERY_HEARTBEAT_TIME}/${id}`);
  }
  public queryEquipmentHeartbeatTime(id: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${QUERY_HEARTBEAT_TIME}/equipment/${id}`);
  }

  public queryTopologyById(id): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${QUERY_TOPOLOGY_BY_ID}/${id}`);
  }

  public updateCableQueryById(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${UPDATE_CABLEQUERYBYID}`, body);
  }

  public findFindCable(id): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${FIND_FO_BYOPTIC_CABLE}/${id}`);
  }

  public updateSimPackage(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${UPDATE_SIM_PACKAGE}`, body);
  }

  public getControlByPackage(queryCondition: QueryConditionModel): Observable<ResultModel<ControlInfo[]>> {
    return this.$http.post<ResultModel<ControlInfo[]>>(`${GET_CONTROL_BY_PACKAGE}`, queryCondition);
  }

  public  expertControl(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${EXPERT_CONTROL}`, body);
  }
}
