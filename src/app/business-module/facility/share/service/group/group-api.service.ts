import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {GroupDetailModel} from '../../../../../core-module/model/facility/group-detail.model';
import {GroupServiceUrlConst} from '../../const/group-service-url.const';
import {ProgramListModel} from '../../../../../core-module/model/group/program-list.model';
import {GroupListModel} from '../../../../../core-module/model/group/group-list.model';
import {FacilityListModel} from '../../../../../core-module/model/facility/facility-list.model';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';

/**
 * 分组管理api接口
 */
@Injectable()
export class GroupApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询分组的列表
   */
  public queryGroupInfoList(body: QueryConditionModel): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(GroupServiceUrlConst.queryGroupInfoList, body);
  }

  /**
   * 新增分组
   */
  public addGroupInfo(body: GroupDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(GroupServiceUrlConst.addGroupInfo, body);
  }

  /**
   * 移除分组
   */
  public moveOutGroupById(body: GroupDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(GroupServiceUrlConst.moveOutGroupById, body);
  }

  /**
   * 校验分组名称是否重复
   */
  public checkGroupInfoByName(body: { groupName: string, groupId: string }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${GroupServiceUrlConst.checkGroupInfoByName}`, body);
  }

  /**
   * 删除分组信息
   */
  public delGroupInfByIds(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(GroupServiceUrlConst.delGroupInfByIds, body);
  }

  /**
   * 查询分组的基本信息
   */
  public queryGroupDeviceAndEquipmentByGroupInfoId(body: {groupId: string}): Observable<ResultModel<GroupDetailModel>> {
    return this.$http.post<ResultModel<GroupDetailModel>>(
      GroupServiceUrlConst.queryGroupDeviceAndEquipmentByGroupInfoId, body);
  }

  /**
   * 快速分组选择设施
   */
  public quickSelectGroupDeviceInfoList(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(GroupServiceUrlConst.quickSelectGroupDeviceInfoList, body);
  }

  /**
   * 快速分组选择设备
   */
  public quickSelectGroupEquipmentInfoList(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(GroupServiceUrlConst.quickSelectGroupEquipmentInfoList, body);
  }

  /**
   * 更新分组
   */
  public updateGroupInfo(body: GroupDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(GroupServiceUrlConst.updateGroupInfo, body);
  }

  /**
   * 查询节目信息
   */
  public queryProgramList(body: QueryConditionModel): Observable<ResultModel<ProgramListModel[]>> {
    return this.$http.post<ResultModel<ProgramListModel[]>>(GroupServiceUrlConst.queryProgramList, body);
  }

  /**
   * 根据分组ids查询所有的可操作的设备类型
   */
  public listEquipmentTypeByGroupId(body: {groupIds: string[]}): Observable<ResultModel<string[]>> {
    return this.$http.post<ResultModel<string[]>>(GroupServiceUrlConst.listEquipmentTypeByGroupId, body);
  }

  /**
   * 查询未分组设施/设备信息
   */
  public notInGroupForDeviceMap(body: QueryConditionModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(GroupServiceUrlConst.notInGroupForDeviceMap, body);
  }
  /**
   * 查询未分组设备信息
   */
  public getDeviceMapByGroupIds(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(GroupServiceUrlConst.getDeviceMapByGroupIds, body);
  }
}
