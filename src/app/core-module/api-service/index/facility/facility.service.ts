import {Injectable} from '@angular/core';
import {FacilityInterface} from './facility.interface';
import {Observable} from 'rxjs';
import {DEVICE_SERVER, STRATEGY_SERVER} from '../../api-common.config';
import {HttpClient} from '@angular/common/http';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {SelectGroupDataModel} from '../../../../business-module/index/shared/model/facility-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AddGroupResultModel, AddToExistGroupModel} from '../../../../business-module/index/shared/model/select-grouping.model';
import {GroupListModel} from '../../../../business-module/application-system/share/model/equipment.model';
import {EquipmentListModel, FacilityListModel} from '../../../model/index/facility-list.modle';

@Injectable()
export class IndexFacilityService implements FacilityInterface {
  constructor(private $http: HttpClient) {
  }

  /**
   * 设备监控信息监控状态
   */
  queryPerformData(body): Observable<Object> {
    return this.$http.post(`${STRATEGY_SERVER}/equipPerform/queryPerformData`, body);
  }

  /**
   * 分组列表
   */
  queryGroupInfoList(body: QueryConditionModel): Observable<ResultModel<SelectGroupDataModel[]>> {
    return this.$http.post<ResultModel<SelectGroupDataModel[]>>(`${DEVICE_SERVER}/groupInfo/selectGroupInfoListForHomePage`, body);
  }

  /**
   * 向已有分组中添加设备设施
   */
  addToExistGroupInfo(body: AddToExistGroupModel): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>
    (`${DEVICE_SERVER}/groupInfo/addToExistGroupInfo`, body);
  }

  /**
   * 新增分组信息
   */
  addGroupInfo(body: AddGroupResultModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>
    (`${DEVICE_SERVER}/groupInfo/addGroupInfo`, body);
  }

  /**
   * 检测分组名
   */
  checkGroupInfoByName(id): Observable<object> {
    return this.$http.post(`${DEVICE_SERVER}/groupInfo/checkGroupInfoByName`, id);
  }

  // 获取我的关注设施列表
  queryCollectingDeviceList(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${DEVICE_SERVER}/deviceCollecting/queryCollectingDeviceList`, body);
  }

  // 获取我的关注设备列表
  queryCollectingEquipmentList(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(`${DEVICE_SERVER}/equipmentInfo/queryCollectingEquipmentList`, body);
  }
  // 设施列表取消关注
  deviceDelCollectingById(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>
    (`${DEVICE_SERVER}/deviceCollecting/delCollectingById`, body);
  }
  // 设备列表取消关注
  equipmentDelCollectingById(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>
    (`${DEVICE_SERVER}/equipmentInfo/delCollectingById`, body);
  }
  // 根据设施id查询杆体示意图
  getPoleInfoByDeviceId(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>
    (`${DEVICE_SERVER}/poleInfo/getPoleInfoByDeviceId`, body);
  }
  // 根据设施id查询设施信息
  queryDeviceInfo(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>
    (`${DEVICE_SERVER}/deviceInfo/queryDeviceInfo`, body);
  }
  // 批量获取设备详细信息
  queryEquipmentInfoList(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>
    (`${DEVICE_SERVER}/equipmentInfo/queryEquipmentBaseInfoByIds`, body);
  }
}
