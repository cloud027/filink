import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzTreeNode} from 'ng-zorro-antd';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../shared-module/model/result.model';
import {AreaDeviceParamModel} from '../../model/work-order/area-device-param.model';
import {FacilityRequestUrl} from './facility-request-url';
import {QueryRecentlyPicModel} from '../../model/picture/query-recently-pic.model';
import {PictureListModel} from '../../model/picture/picture-list.model';
import {EquipmentFormModel} from '../../model/work-order/equipment-form.model';
import {DeviceFormModel} from '../../model/work-order/device-form.model';
import {EquipmentListModel} from '../../model/equipment/equipment-list.model';
import {FacilityListModel} from '../../model/facility/facility-list.model';
import {GroupListModel} from '../../model/group/group-list.model';
import {EquipmentAddInfoModel} from '../../model/equipment/equipment-add-info.model';
import {QueryRealPicModel} from '../../model/picture/query-real-pic.model';
import {QueryAlarmStatisticsModel} from '../../model/alarm/query-alarm-statistics.model';
import {AlarmLevelStatisticsModel} from '../../model/alarm/alarm-level-statistics.model';
import {AlarmNameStatisticsModel} from '../../model/alarm/alarm-name-statistics.model';
import {AlarmListModel} from '../../model/alarm/alarm-list.model';
import {AlarmSourceIncrementalModel} from '../../model/alarm/alarm-source-incremental.model';
import {EquipmentDetailCodeModel} from '../../model/equipment/equipment-detail-code.model';
import {EquipmentLogModel} from '../../model/equipment/equipment-log.model';
import {ConfigDetailRequestModel} from '../../model/equipment/config-detail-request.model';
import {ApplicationPolicyListModel} from '../../model/application-system/application-policy-list.model';
import {EquipmentSensorModel} from '../../model/equipment/equipment-sensor.model';
import {PerformDataModel} from '../../model/group/perform-data.model';
import {AreaModel} from '../../model/facility/area.model';
import {FacilityDetailInfoModel} from '../../model/facility/facility-detail-info.model';
import {ViewDetailCodeModel} from '../../model/facility/view-detail-code.model';
import {OperateLogModel} from '../../model/facility/operate-log.model';
import {DeviceTypeCountModel} from '../../model/facility/device-type-count.model';
import {EquipmentStatisticsModel} from '../../model/equipment/equipment-statistics.model';
import {LoopViewDetailModel} from '../../model/loop/loop-view-detail.model';
import {MoveInOrOutModel} from '../../model/loop/move-in-or-out.model';
import {ConfigResponseContentModel} from '../../model/equipment/config-response-content.model';
import {PicResourceStatusEnum} from '../../../business-module/facility/share/enum/picture.enum';
import {LoopListModel} from '../../model/loop/loop-list.model';
import {LoopDrawDeviceModel} from '../../model/facility/loop-draw-device.model';
import {GroupDetailModel} from '../../model/facility/group-detail.model';
import {GroupServiceUrlConst} from '../../../business-module/facility/share/const/group-service-url.const';
import {DEVICE_SERVER} from '../api-common.config';
import {QUERY_AREA} from './facility-request-url-old';
/**
 * ????????????????????????
 */
@Injectable()
export class FacilityForCommonService {
  constructor(private $http: HttpClient) {
  }

  /**
   * ??????????????????
   */
  public deviceListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${FacilityRequestUrl.deviceListByPage}`, queryCondition);
  }

  /**
   * new??????????????????
   */
  public deviceListByPageForListPage(queryCondition: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${FacilityRequestUrl.deviceListByPageForListPage}`, queryCondition);
  }
  /**
   * ???????????????????????????
   */
  public deviceListByPageForListPageNew(queryCondition: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${FacilityRequestUrl.deviceListByPageForListPageNew}`, queryCondition);
  }
  /**
   *  ??????????????????
   */
  public equipmentListByPage(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.equipmentListByPage, body);
  }

  /**
   *  new??????????????????
   */
  public equipmentListByPageForListPage(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.equipmentListByPageForListPage, body);
  }
  /**
   *  new???????????????????????????
   */
   public equipmentListByPageForListPageNew(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.equipmentListByPageForListPageNew, body);
  }

  /**
   * ????????????????????????????????????
   */
  public queryGroupDeviceInfoList(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(FacilityRequestUrl.queryGroupDeviceInfoList, body);
  }

  /**
   *  ????????????????????????????????????
   */
  public queryGroupEquipmentInfoList(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.queryGroupEquipmentInfoList, body);
  }
  /**
   *   ??????????????????????????????
   */
  public queryDeviceDataList(body: AreaDeviceParamModel): Observable<ResultModel<DeviceFormModel[]>> {
    return this.$http.post<ResultModel<DeviceFormModel[]>>(FacilityRequestUrl.queryDeviceBaseInfo, body);
  }
  /**
   * ????????????code???????????????
   */
  public queryAreaByDeptCode(body: string): Observable<ResultModel<NzTreeNode[]>> {
    return this.$http.post<ResultModel<NzTreeNode[]>> (`${FacilityRequestUrl.listAreaByDeptCode}/${body}`, null);
  }

  /**
   * ??????????????????
   */
  public getPicDetailForNew(body: QueryRecentlyPicModel): Observable<ResultModel<PictureListModel[]>> {
    return this.$http.post<ResultModel<PictureListModel[]>>(FacilityRequestUrl.getPicDetailForNew, body);
  }

  /**
   * ????????????code?????????id????????????????????????????????????
   */
  public listDepartmentByAreaAndUserId(body: AreaDeviceParamModel): Observable<ResultModel<NzTreeNode[]>> {
    return this.$http.post<ResultModel<NzTreeNode[]>>(FacilityRequestUrl.listDepartmentByAreaAndUserId, body);
  }

  /**
   * ????????????code????????????????????????
   */
  public listEquipmentBaseInfoByAreaCode(body: AreaDeviceParamModel): Observable<ResultModel<EquipmentFormModel[]>> {
    return this.$http.post<ResultModel<EquipmentFormModel[]>>(FacilityRequestUrl.listEquipmentBaseInfoByAreaCode, body);
  }

  /**
   * ??????????????????
   */
 public queryAreaList(): Observable<ResultModel<AreaModel[]>> {
   return this.$http.get<ResultModel<AreaModel[]>>(FacilityRequestUrl.queryAreaBaseInfoList);
  }

  /**
   * new??????????????????
   */
 public queryMigrationAreaBaseInfoList(body): Observable<Object> {
   return this.$http.post(FacilityRequestUrl.queryMigrationAreaBaseInfoList, body);
  }
  /**
   * ???????????????????????????????????????
   */
  public queryGroupInfoByEquipmentId(body: QueryConditionModel): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(FacilityRequestUrl.queryGroupInfoByEquipmentId, body);
  }
  /**
   * ???????????????????????????????????????
   */
  public getEquipmentConfigByModel(body: { equipmentModel?: string , equipmentId?: string}): Observable<Object> {
    return this.$http.post(FacilityRequestUrl.getEquipmentConfigByModel, body);
  }

  /**
   * ??????????????????
   */
  public queryGatewaySubsetListByPage(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.queryGatewaySubsetListByPage, body);
  }
  /**
   * ????????????
   */
  public uploadImg(formData: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityRequestUrl.uploadImageForLive, formData);
  }
  /**
   * ????????????
   */
  public deleteEquipmentByIds(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityRequestUrl.deleteEquipmentByIds, body);
  }
  /**
   * ???????????????
   */
  public getPicDetail(body: QueryRealPicModel[]): Observable<ResultModel<PictureListModel[]>> {
    return this.$http.post<ResultModel<PictureListModel[]>>(FacilityRequestUrl.getPicDetail, body);
  }
  /**
   * ????????????id??????????????????
   */
  public getEquipmentById(body: { equipmentId: string }): Observable<ResultModel<EquipmentAddInfoModel[]>> {
    return this.$http.post<ResultModel<EquipmentAddInfoModel[]>>(FacilityRequestUrl.getEquipmentById, body);
  }
  /**
   * ??????????????????
   */
  public queryEquipmentLog(body: QueryConditionModel): Observable<ResultModel<EquipmentLogModel[]>> {
    return this.$http.post<ResultModel<EquipmentLogModel[]>>(FacilityRequestUrl.queryEquipmentLog, body);
  }
  /**
   * ?????????????????????????????????code
   */
  public getDetailCode(body: any): Observable<ResultModel<EquipmentDetailCodeModel[]>> {
    return this.$http.post<ResultModel<EquipmentDetailCodeModel[]>>(FacilityRequestUrl.getDetailCode, body);
  }
  /**
   * ????????????????????????
   */
  public queryEquipmentBind(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.queryEquipmentBind, body);
  }
  /**
   * ??????????????????????????????
   */
  public queryEquipmentDocNumIsExist(
    body: { centerControlId: string, equipmentDocNum: string, singleControlId: string}): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(FacilityRequestUrl.queryEquipmentDocNumIsExist, body);
  }
  /**
   *  ????????????????????????
   */
  public queryAlarmHistorySourceLevel(body: QueryAlarmStatisticsModel): Observable<ResultModel<AlarmLevelStatisticsModel>> {
    return this.$http.post<ResultModel<AlarmLevelStatisticsModel>>(FacilityRequestUrl.queryAlarmHistorySourceLevel, body);
  }

  /**
   *  ??????????????????????????????
   */
  public queryAlarmHistorySourceName(body: QueryAlarmStatisticsModel): Observable<ResultModel<AlarmNameStatisticsModel[]>> {
    return this.$http.post<ResultModel<AlarmNameStatisticsModel[]>>(FacilityRequestUrl.queryAlarmHistorySourceName, body);
  }

  /**
   *  ??????????????????????????????
   */
  public queryAlarmNameStatistics(body: QueryAlarmStatisticsModel): Observable<ResultModel<AlarmNameStatisticsModel[]>> {
    return this.$http.post<ResultModel<AlarmNameStatisticsModel[]>>(FacilityRequestUrl.queryAlarmNameStatistics, body);
  }

  /**
   * ????????????????????????
   */
  public queryAlarmSourceIncremental(body: QueryAlarmStatisticsModel): Observable<ResultModel<AlarmSourceIncrementalModel[]>> {
    return this.$http.post<ResultModel<AlarmSourceIncrementalModel[]>>(FacilityRequestUrl.queryAlarmSourceIncremental, body);
  }

  /**
   * ??????????????????????????????
   */
  public queryCurrentAlarmLevelStatistics(body: QueryAlarmStatisticsModel): Observable<ResultModel<AlarmLevelStatisticsModel>> {
    return this.$http.post<ResultModel<AlarmLevelStatisticsModel>>(FacilityRequestUrl.queryCurrentAlarmLevelStatistics, body);
  }

  /**
   * ????????????????????????
   */
  public queryHistoryAlarmList(equipmentId: string): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${FacilityRequestUrl.getAlarmHisInfoListById}/${equipmentId}`, null);
  }

  /**
   *  ???????????????????????????
   */
  public queryEquipmentCurrentAlarm(equipmentId: string): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${FacilityRequestUrl.getAlarmInfoListByEquipmentId}/${equipmentId}`, {});
  }

  /**
   * ????????????????????????????????????
   */
  public queryEquipmentConfigById(body: ConfigDetailRequestModel): Observable<Object> {
    return this.$http.post(FacilityRequestUrl.queryEquipmentById, body);
  }
  /**
   * ?????????????????????????????????
   */
  public getEquipmentLockConfigByModel(body: { equipmentId: string }): Observable<ResultModel<ConfigResponseContentModel[]>> {
    return this.$http.post<ResultModel<ConfigResponseContentModel[]>>(FacilityRequestUrl.getEquipmentLockConfigByModel, body);
  }

  /**
   * ????????????????????????????????????
   */
  public listStrategyByCondAndEquipIdPage(body: { equipmentId: string, queryCondition: QueryConditionModel }): Observable<ResultModel<ApplicationPolicyListModel[]>> {
    return this.$http.post<ResultModel<ApplicationPolicyListModel[]>>(FacilityRequestUrl.queryStrategyListByRefId, body);
  }
  /**
   * ???????????????????????????????????????
   */
  public getSensor(body: { equipmentId: string }): Observable<ResultModel<EquipmentSensorModel[]>> {
    return this.$http.post<ResultModel<EquipmentSensorModel[]>>(FacilityRequestUrl.getSensor, body);
  }

  /**
   * ?????????????????????value???
   */
  public queryPerformData(body: PerformDataModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityRequestUrl.queryEquipmentById, body);
  }
  /**
   * new??????????????????
   */
  public getEquipmentDataByType(body: PerformDataModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityRequestUrl.getEquipmentDataByType, body);
  }
  /**
   *  ??????????????????
   */
  public queryConfigureEquipmentInfo(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.queryConfigureEquipmentInfo, body);
  }
  /**
   * ??????????????????
   */
  public areaListByPage(body): Observable<ResultModel<AreaModel[]>> {
    return this.$http.post<ResultModel<AreaModel[]>>(FacilityRequestUrl.areaListByPage, body);
  }

  /**
   * ????????????id??????????????????
   */
  public queryAreaByDeptId(body: string[]): Observable<ResultModel<AreaModel[]>> {
    return this.$http.post<ResultModel<AreaModel[]>>(FacilityRequestUrl.selectAreaInfoByDeptIdsForView, body);
  }
  /**
   * ????????????????????????
   * body???any???????????????????????????id??????key
   */
  public setAreaDevice(body: any): Observable<ResultModel<string>> {
    return this.$http.put<ResultModel<string>>(FacilityRequestUrl.setAreaDevice, body);
  }

  /**
   * ?????????????????????
   */
  public deviceListOfLockByPage(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityRequestUrl.deviceListOfLockByPage, body);
  }

  /**
   * ??????id??????????????????
   */
  public queryDeviceById(body: { deviceId: string }): Observable<ResultModel<FacilityDetailInfoModel[]>> {
    return this.$http.post<ResultModel<FacilityDetailInfoModel[]>>(FacilityRequestUrl.queryDeviceInfo, body);
  }

  /**
   * ????????????????????????code
   */
  public getDeviceDetailCode(body: { deviceType: string, deviceId: string }): Observable<ResultModel<ViewDetailCodeModel[]>> {
    return this.$http.post<ResultModel<ViewDetailCodeModel[]>>(FacilityRequestUrl.getDeviceDetailCode, body);
  }

  /**
   * ??????????????????
   * ????????????????????????????????????????????????????????????any
   */
  public getPramsConfig(body: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${FacilityRequestUrl.getPramsConfig}/${body}`);
  }
  /**
   * ??????????????????
   */
  public findOperateLog(body: QueryConditionModel): Observable<ResultModel<OperateLogModel[]>> {
    return this.$http.post<ResultModel<OperateLogModel[]>>(FacilityRequestUrl.findOperateLog, body);
  }
  /**
   * ????????????????????????
   */
  public queryDeviceTypeCount(): Observable<ResultModel<DeviceTypeCountModel[]>> {
    return this.$http.get<ResultModel<DeviceTypeCountModel[]>>(FacilityRequestUrl.queryDeviceTypeCount);
  }
  /**
  * ????????????????????????
  */
  public queryDeviceTypeCountNew(): Observable<ResultModel<DeviceTypeCountModel[]>> {
    return this.$http.get<ResultModel<DeviceTypeCountModel[]>>(FacilityRequestUrl.queryDeviceTypeCountNew);
  }
  /**
   * ??????????????????
   */
  public equipmentCount(): Observable<ResultModel<EquipmentStatisticsModel[]>> {
    return this.$http.post<ResultModel<EquipmentStatisticsModel[]>>(FacilityRequestUrl.equipmentCount, null);
  }
    /**
   * ??????????????????
   */
     public equipmentCountNew(): Observable<ResultModel<EquipmentStatisticsModel[]>> {
        return this.$http.post<ResultModel<EquipmentStatisticsModel[]>>(FacilityRequestUrl.equipmentCountNew, null);
      }
  /**
   * ??????????????????
   */
  public queryLoopDetail(body: { loopId: string }): Observable<ResultModel<LoopViewDetailModel>> {
    return this.$http.post<ResultModel<LoopViewDetailModel>>(`${FacilityRequestUrl.queryLoopDetail}`, body);
  }

  /**
   * ??????????????????????????????
   */
  public queryLoopDevicePageByLoopId(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${FacilityRequestUrl.queryLoopDevicePageByLoopId}`, body);
  }
  /**
   * ????????????
   */
  public moveOutLoop(body: MoveInOrOutModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${FacilityRequestUrl.moveOutLoop}`, body);
  }

  /**
   * ???????????????????????????????????????
   */
  public deviceLogTime(id: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${FacilityRequestUrl.queryRecentDeviceLogTime}/${id}`);
  }

  /**
   * ??????id????????????
   */
  public getProcessByProcId(id: string): Observable<ResultModel<{ status: PicResourceStatusEnum }>> {
    return this.$http.post<ResultModel<{ status: PicResourceStatusEnum }>>(`${FacilityRequestUrl.getProcessByProcId}`, {procId: id});
  }

  /**
   * ????????????
   */
  public queryIsStatus(id: string): Observable<ResultModel<{ status: PicResourceStatusEnum }>> {
    return this.$http.get<ResultModel<{ status: PicResourceStatusEnum }>>(`${FacilityRequestUrl.queryIsStatus}${id}`);
  }
  /**
   * ????????????ids????????????????????????
   */
  public loopListByPageByDeviceIds(body: QueryConditionModel): Observable<ResultModel<LoopListModel[]>> {
    return this.$http.post<ResultModel<LoopListModel[]>>(`${FacilityRequestUrl.loopListByPageByDeviceIds}`, body);
  }
  /**
   * ????????????????????????
   */
  public queryLoopList(body: QueryConditionModel): Observable<ResultModel<LoopListModel[]>> {
    return this.$http.post<ResultModel<LoopListModel[]>>(`${FacilityRequestUrl.queryLoopListByPage}`, body);
  }
  /**
   * ????????????
   */
  public moveIntoLoop(body: MoveInOrOutModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${FacilityRequestUrl.moveIntoLoop}`, body);
  }
  /**
   * ????????????????????????
   */
  public queryDeviceMapByLoop(body: { loopId: string }[]): Observable<ResultModel<LoopDrawDeviceModel>> {
    return this.$http.post<ResultModel<LoopDrawDeviceModel>>(`${FacilityRequestUrl.queryDeviceMapByLoop}`, body);
  }
  /**
   * ??????????????????????????????
   */
  public checkGroupInfoByName(body: { groupName: string, groupId: string }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${FacilityRequestUrl.checkGroupInfoByName}`, body);
  }
  /**
   * ?????????????????????
   */
  public queryGroupInfoList(body: QueryConditionModel): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(FacilityRequestUrl.queryGroupInfoList, body);
  }
  /**
   * ????????????
   */
  public moveOutGroupById(body: GroupDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityRequestUrl.moveOutGroupById, body);
  }

  /**
   * ????????????
   */
  public updateGroupInfo(body: GroupDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityRequestUrl.updateGroupInfo, body);
  }
  /**
   * ????????????
   */
  public addGroupInfo(body: GroupDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityRequestUrl.addGroupInfo, body);
  }

  /**
   * ????????????
   */
  public getPoleInfoByDeviceId(body: any): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityRequestUrl.getPoleInfoByDeviceId, body);
  }

  /**
   * ??????????????????
   */
  public setInstructDeviceInfo(body: any, url: string): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(url, body);
  }
  /**
   * ???????????????????????????
   */
  public notInGroupForEquipmentMap(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(GroupServiceUrlConst.notInGroupForEquipmentMap, body);
  }

  /**
   * ????????????id????????????????????????
   */
  public getEquipmentMapByGroupIds(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(GroupServiceUrlConst.getEquipmentMapByGroupIds, body);
  }

  /**
   * ???????????????????????????
   */
  public  queryGatewayPropertyConfig(gatewayId: string): Observable<ResultModel<{ any}>> {
    return this.$http.get<ResultModel<any>>(`${FacilityRequestUrl.queryGatewayPropertyConfig}/${gatewayId}`);
  }

  /**
   * ????????????id?????????????????????
   * param gatewayId
   */
  public getSensorListByGatewayId(body: QueryConditionModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${FacilityRequestUrl.getSensorListByGatewayId}`, body);
  }

  /**
   * ????????????
   */
  public batchConfigurationDevice(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityRequestUrl.equipmentBatchConfig, body);
  }

  /**
   * ??????????????????
   */
  public  countDeviceAreaList(): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${DEVICE_SERVER}/deviceInfo/countDeviceAreaList`);
  }

  /**
   * ???????????????????????????
   */
  public queryDeviceInfo(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DEVICE_SERVER}/deviceInfo/queryDeviceInfo`, body);
  }

  /**
   * ??????????????????????????????
   */
  public queryDeviceListForComp(queryCondition: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(FacilityRequestUrl.listDeviceByPage, queryCondition);
  }

  /**
   *  ??????????????????????????????
   */
  public queryEquipmentListForComp(queryCondition: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.listEquipmentByPage, queryCondition);
  }
  /**
   * ????????????????????????????????????????????????
   * @param body ????????????????????????
   */
  public checkEquipmentMode(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityRequestUrl.checkEquipmentMode, body);
  }

  /**
   * ??????????????????
   */
  public queryAreaListForPageSelection(): Observable<ResultModel<NzTreeNode[]>> {
    return this.$http.post<ResultModel<NzTreeNode[]>>(`${QUERY_AREA}`, new QueryConditionModel());
  }

  /**
   * ?????????????????????code??????????????????????????????
   */
  public queryCodingRulePageByType(queryCondition: QueryConditionModel): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(FacilityRequestUrl.queryCodingRulePageByType, queryCondition);
  }

  /**
   * ??????????????????????????????????????????????????????
   */
  public getHitDevicePage(queryCondition: QueryConditionModel): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(FacilityRequestUrl.getHitDevicePage, queryCondition);
  }

  /**
   * ??????????????????????????????????????????????????????
   */
  public getHitEquipmentPage(queryCondition: QueryConditionModel): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(FacilityRequestUrl.getHitEquipmentPage, queryCondition);
  }

  /**
   * ??????????????????
   */
  public batchUpdateDeviceCode(body): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(FacilityRequestUrl.batchUpdateDeviceCode, body);
  }

  /**
   * ??????????????????
   */
  public batchUpdateEquipmentCode(body): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(FacilityRequestUrl.batchUpdateEquipmentCode, body);
  }
  /**
   * ?????????????????????
   */
  public poleImageInfo(productId: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${FacilityRequestUrl.poleImageInfo}/${productId}`);
  }

    /**
     * ???????????????????????????????????????????????????????????????????????????
     */
    public checkCodingRule(body): Observable<ResultModel<boolean>> {
        return this.$http.post<ResultModel<boolean>>(FacilityRequestUrl.checkCodingRule, body);
    }
}
