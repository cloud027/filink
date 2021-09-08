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
 * 资产公共服务接口
 */
@Injectable()
export class FacilityForCommonService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 设施列表请求
   */
  public deviceListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${FacilityRequestUrl.deviceListByPage}`, queryCondition);
  }

  /**
   * new设施列表请求
   */
  public deviceListByPageForListPage(queryCondition: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${FacilityRequestUrl.deviceListByPageForListPage}`, queryCondition);
  }
  /**
   * 已拆除设施列表请求
   */
  public deviceListByPageForListPageNew(queryCondition: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${FacilityRequestUrl.deviceListByPageForListPageNew}`, queryCondition);
  }
  /**
   *  查询设备列表
   */
  public equipmentListByPage(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.equipmentListByPage, body);
  }

  /**
   *  new查询设备列表
   */
  public equipmentListByPageForListPage(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.equipmentListByPageForListPage, body);
  }
  /**
   *  new查询设备已拆除列表
   */
   public equipmentListByPageForListPageNew(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.equipmentListByPageForListPageNew, body);
  }

  /**
   * 查询分组详情中的设施列表
   */
  public queryGroupDeviceInfoList(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(FacilityRequestUrl.queryGroupDeviceInfoList, body);
  }

  /**
   *  查询分组详情中的设备列表
   */
  public queryGroupEquipmentInfoList(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.queryGroupEquipmentInfoList, body);
  }
  /**
   *   设施列表不带分页查询
   */
  public queryDeviceDataList(body: AreaDeviceParamModel): Observable<ResultModel<DeviceFormModel[]>> {
    return this.$http.post<ResultModel<DeviceFormModel[]>>(FacilityRequestUrl.queryDeviceBaseInfo, body);
  }
  /**
   * 根据部门code查区域信息
   */
  public queryAreaByDeptCode(body: string): Observable<ResultModel<NzTreeNode[]>> {
    return this.$http.post<ResultModel<NzTreeNode[]>> (`${FacilityRequestUrl.listAreaByDeptCode}/${body}`, null);
  }

  /**
   * 查询最近图片
   */
  public getPicDetailForNew(body: QueryRecentlyPicModel): Observable<ResultModel<PictureListModel[]>> {
    return this.$http.post<ResultModel<PictureListModel[]>>(FacilityRequestUrl.getPicDetailForNew, body);
  }

  /**
   * 根据区域code及用户id查询同级和下级的单位信息
   */
  public listDepartmentByAreaAndUserId(body: AreaDeviceParamModel): Observable<ResultModel<NzTreeNode[]>> {
    return this.$http.post<ResultModel<NzTreeNode[]>>(FacilityRequestUrl.listDepartmentByAreaAndUserId, body);
  }

  /**
   * 根据区域code查询设备不带分页
   */
  public listEquipmentBaseInfoByAreaCode(body: AreaDeviceParamModel): Observable<ResultModel<EquipmentFormModel[]>> {
    return this.$http.post<ResultModel<EquipmentFormModel[]>>(FacilityRequestUrl.listEquipmentBaseInfoByAreaCode, body);
  }

  /**
   * 获取区域列表
   */
 public queryAreaList(): Observable<ResultModel<AreaModel[]>> {
   return this.$http.get<ResultModel<AreaModel[]>>(FacilityRequestUrl.queryAreaBaseInfoList);
  }

  /**
   * new获取区域列表
   */
 public queryMigrationAreaBaseInfoList(body): Observable<Object> {
   return this.$http.post(FacilityRequestUrl.queryMigrationAreaBaseInfoList, body);
  }
  /**
   * 获取设备所在的分组列表信息
   */
  public queryGroupInfoByEquipmentId(body: QueryConditionModel): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(FacilityRequestUrl.queryGroupInfoByEquipmentId, body);
  }
  /**
   * 根据设备型号获取设备配置项
   */
  public getEquipmentConfigByModel(body: { equipmentModel?: string , equipmentId?: string}): Observable<Object> {
    return this.$http.post(FacilityRequestUrl.getEquipmentConfigByModel, body);
  }

  /**
   * 查询网关子集
   */
  public queryGatewaySubsetListByPage(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.queryGatewaySubsetListByPage, body);
  }
  /**
   * 上传图片
   */
  public uploadImg(formData: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityRequestUrl.uploadImageForLive, formData);
  }
  /**
   * 删除设备
   */
  public deleteEquipmentByIds(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityRequestUrl.deleteEquipmentByIds, body);
  }
  /**
   * 查询实景图
   */
  public getPicDetail(body: QueryRealPicModel[]): Observable<ResultModel<PictureListModel[]>> {
    return this.$http.post<ResultModel<PictureListModel[]>>(FacilityRequestUrl.getPicDetail, body);
  }
  /**
   * 根据设备id查询设备信息
   */
  public getEquipmentById(body: { equipmentId: string }): Observable<ResultModel<EquipmentAddInfoModel[]>> {
    return this.$http.post<ResultModel<EquipmentAddInfoModel[]>>(FacilityRequestUrl.getEquipmentById, body);
  }
  /**
   * 查询设备日志
   */
  public queryEquipmentLog(body: QueryConditionModel): Observable<ResultModel<EquipmentLogModel[]>> {
    return this.$http.post<ResultModel<EquipmentLogModel[]>>(FacilityRequestUrl.queryEquipmentLog, body);
  }
  /**
   * 查询设备模型的详情卡片code
   */
  public getDetailCode(body: any): Observable<ResultModel<EquipmentDetailCodeModel[]>> {
    return this.$http.post<ResultModel<EquipmentDetailCodeModel[]>>(FacilityRequestUrl.getDetailCode, body);
  }
  /**
   * 查询设备绑定列表
   */
  public queryEquipmentBind(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.queryEquipmentBind, body);
  }
  /**
   * 校验档案编码的唯一性
   */
  public queryEquipmentDocNumIsExist(
    body: { centerControlId: string, equipmentDocNum: string, singleControlId: string}): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(FacilityRequestUrl.queryEquipmentDocNumIsExist, body);
  }
  /**
   *  查询历史告警等级
   */
  public queryAlarmHistorySourceLevel(body: QueryAlarmStatisticsModel): Observable<ResultModel<AlarmLevelStatisticsModel>> {
    return this.$http.post<ResultModel<AlarmLevelStatisticsModel>>(FacilityRequestUrl.queryAlarmHistorySourceLevel, body);
  }

  /**
   *  查询历史告警名称统计
   */
  public queryAlarmHistorySourceName(body: QueryAlarmStatisticsModel): Observable<ResultModel<AlarmNameStatisticsModel[]>> {
    return this.$http.post<ResultModel<AlarmNameStatisticsModel[]>>(FacilityRequestUrl.queryAlarmHistorySourceName, body);
  }

  /**
   *  查询当前告警名称统计
   */
  public queryAlarmNameStatistics(body: QueryAlarmStatisticsModel): Observable<ResultModel<AlarmNameStatisticsModel[]>> {
    return this.$http.post<ResultModel<AlarmNameStatisticsModel[]>>(FacilityRequestUrl.queryAlarmNameStatistics, body);
  }

  /**
   * 查询告警增量统计
   */
  public queryAlarmSourceIncremental(body: QueryAlarmStatisticsModel): Observable<ResultModel<AlarmSourceIncrementalModel[]>> {
    return this.$http.post<ResultModel<AlarmSourceIncrementalModel[]>>(FacilityRequestUrl.queryAlarmSourceIncremental, body);
  }

  /**
   * 查询当前告警等级统计
   */
  public queryCurrentAlarmLevelStatistics(body: QueryAlarmStatisticsModel): Observable<ResultModel<AlarmLevelStatisticsModel>> {
    return this.$http.post<ResultModel<AlarmLevelStatisticsModel>>(FacilityRequestUrl.queryCurrentAlarmLevelStatistics, body);
  }

  /**
   * 查询历史告警列表
   */
  public queryHistoryAlarmList(equipmentId: string): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${FacilityRequestUrl.getAlarmHisInfoListById}/${equipmentId}`, null);
  }

  /**
   *  查询当前告警的列表
   */
  public queryEquipmentCurrentAlarm(equipmentId: string): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${FacilityRequestUrl.getAlarmInfoListByEquipmentId}/${equipmentId}`, {});
  }

  /**
   * 根据设备查询设备配置信息
   */
  public queryEquipmentConfigById(body: ConfigDetailRequestModel): Observable<Object> {
    return this.$http.post(FacilityRequestUrl.queryEquipmentById, body);
  }
  /**
   * 获取设备电子锁配置信息
   */
  public getEquipmentLockConfigByModel(body: { equipmentId: string }): Observable<ResultModel<ConfigResponseContentModel[]>> {
    return this.$http.post<ResultModel<ConfigResponseContentModel[]>>(FacilityRequestUrl.getEquipmentLockConfigByModel, body);
  }

  /**
   * 根据设备查询应用策略信息
   */
  public listStrategyByCondAndEquipIdPage(body: { equipmentId: string, queryCondition: QueryConditionModel }): Observable<ResultModel<ApplicationPolicyListModel[]>> {
    return this.$http.post<ResultModel<ApplicationPolicyListModel[]>>(FacilityRequestUrl.queryStrategyListByRefId, body);
  }
  /**
   * 查询上报信息所要显示的字段
   */
  public getSensor(body: { equipmentId: string }): Observable<ResultModel<EquipmentSensorModel[]>> {
    return this.$http.post<ResultModel<EquipmentSensorModel[]>>(FacilityRequestUrl.getSensor, body);
  }

  /**
   * 获取上报信息的value值
   */
  public queryPerformData(body: PerformDataModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityRequestUrl.queryEquipmentById, body);
  }
  /**
   * new设备配置详情
   */
  public getEquipmentDataByType(body: PerformDataModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityRequestUrl.getEquipmentDataByType, body);
  }
  /**
   *  查询设备列表
   */
  public queryConfigureEquipmentInfo(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.queryConfigureEquipmentInfo, body);
  }
  /**
   * 查询区域列表
   */
  public areaListByPage(body): Observable<ResultModel<AreaModel[]>> {
    return this.$http.post<ResultModel<AreaModel[]>>(FacilityRequestUrl.areaListByPage, body);
  }

  /**
   * 根据部门id查询区域信息
   */
  public queryAreaByDeptId(body: string[]): Observable<ResultModel<AreaModel[]>> {
    return this.$http.post<ResultModel<AreaModel[]>>(FacilityRequestUrl.selectAreaInfoByDeptIdsForView, body);
  }
  /**
   * 区域关联设施接口
   * body为any是因为数据对象中将id作为key
   */
  public setAreaDevice(body: any): Observable<ResultModel<string>> {
    return this.$http.put<ResultModel<string>>(FacilityRequestUrl.setAreaDevice, body);
  }

  /**
   * 查询锁设施列表
   */
  public deviceListOfLockByPage(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityRequestUrl.deviceListOfLockByPage, body);
  }

  /**
   * 根据id查询设施详情
   */
  public queryDeviceById(body: { deviceId: string }): Observable<ResultModel<FacilityDetailInfoModel[]>> {
    return this.$http.post<ResultModel<FacilityDetailInfoModel[]>>(FacilityRequestUrl.queryDeviceInfo, body);
  }

  /**
   * 查询设施详情卡片code
   */
  public getDeviceDetailCode(body: { deviceType: string, deviceId: string }): Observable<ResultModel<ViewDetailCodeModel[]>> {
    return this.$http.post<ResultModel<ViewDetailCodeModel[]>>(FacilityRequestUrl.getDeviceDetailCode, body);
  }

  /**
   * 获取参数配置
   * 每一种设备类型的配置对象不一样此处结果有any
   */
  public getPramsConfig(body: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${FacilityRequestUrl.getPramsConfig}/${body}`);
  }
  /**
   * 查询操作日志
   */
  public findOperateLog(body: QueryConditionModel): Observable<ResultModel<OperateLogModel[]>> {
    return this.$http.post<ResultModel<OperateLogModel[]>>(FacilityRequestUrl.findOperateLog, body);
  }
  /**
   * 查询设施类型数量
   */
  public queryDeviceTypeCount(): Observable<ResultModel<DeviceTypeCountModel[]>> {
    return this.$http.get<ResultModel<DeviceTypeCountModel[]>>(FacilityRequestUrl.queryDeviceTypeCount);
  }
  /**
  * 查询设施类型数量
  */
  public queryDeviceTypeCountNew(): Observable<ResultModel<DeviceTypeCountModel[]>> {
    return this.$http.get<ResultModel<DeviceTypeCountModel[]>>(FacilityRequestUrl.queryDeviceTypeCountNew);
  }
  /**
   * 查询设备统计
   */
  public equipmentCount(): Observable<ResultModel<EquipmentStatisticsModel[]>> {
    return this.$http.post<ResultModel<EquipmentStatisticsModel[]>>(FacilityRequestUrl.equipmentCount, null);
  }
    /**
   * 查询设备统计
   */
     public equipmentCountNew(): Observable<ResultModel<EquipmentStatisticsModel[]>> {
        return this.$http.post<ResultModel<EquipmentStatisticsModel[]>>(FacilityRequestUrl.equipmentCountNew, null);
      }
  /**
   * 查询回路详情
   */
  public queryLoopDetail(body: { loopId: string }): Observable<ResultModel<LoopViewDetailModel>> {
    return this.$http.post<ResultModel<LoopViewDetailModel>>(`${FacilityRequestUrl.queryLoopDetail}`, body);
  }

  /**
   * 查询回路关联设施列表
   */
  public queryLoopDevicePageByLoopId(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${FacilityRequestUrl.queryLoopDevicePageByLoopId}`, body);
  }
  /**
   * 移除回路
   */
  public moveOutLoop(body: MoveInOrOutModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${FacilityRequestUrl.moveOutLoop}`, body);
  }

  /**
   * 查询最近一条设施日志的时间
   */
  public deviceLogTime(id: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${FacilityRequestUrl.queryRecentDeviceLogTime}/${id}`);
  }

  /**
   * 根据id查询工单
   */
  public getProcessByProcId(id: string): Observable<ResultModel<{ status: PicResourceStatusEnum }>> {
    return this.$http.post<ResultModel<{ status: PicResourceStatusEnum }>>(`${FacilityRequestUrl.getProcessByProcId}`, {procId: id});
  }

  /**
   * 查询状态
   */
  public queryIsStatus(id: string): Observable<ResultModel<{ status: PicResourceStatusEnum }>> {
    return this.$http.get<ResultModel<{ status: PicResourceStatusEnum }>>(`${FacilityRequestUrl.queryIsStatus}${id}`);
  }
  /**
   * 根据设施ids分页查询回路列表
   */
  public loopListByPageByDeviceIds(body: QueryConditionModel): Observable<ResultModel<LoopListModel[]>> {
    return this.$http.post<ResultModel<LoopListModel[]>>(`${FacilityRequestUrl.loopListByPageByDeviceIds}`, body);
  }
  /**
   * 获取回路列表分页
   */
  public queryLoopList(body: QueryConditionModel): Observable<ResultModel<LoopListModel[]>> {
    return this.$http.post<ResultModel<LoopListModel[]>>(`${FacilityRequestUrl.queryLoopListByPage}`, body);
  }
  /**
   * 移入回路
   */
  public moveIntoLoop(body: MoveInOrOutModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${FacilityRequestUrl.moveIntoLoop}`, body);
  }
  /**
   * 查询回路地图设施
   */
  public queryDeviceMapByLoop(body: { loopId: string }[]): Observable<ResultModel<LoopDrawDeviceModel>> {
    return this.$http.post<ResultModel<LoopDrawDeviceModel>>(`${FacilityRequestUrl.queryDeviceMapByLoop}`, body);
  }
  /**
   * 校验分组名称是否重复
   */
  public checkGroupInfoByName(body: { groupName: string, groupId: string }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${FacilityRequestUrl.checkGroupInfoByName}`, body);
  }
  /**
   * 查询分组的列表
   */
  public queryGroupInfoList(body: QueryConditionModel): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(FacilityRequestUrl.queryGroupInfoList, body);
  }
  /**
   * 移除分组
   */
  public moveOutGroupById(body: GroupDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityRequestUrl.moveOutGroupById, body);
  }

  /**
   * 更新分组
   */
  public updateGroupInfo(body: GroupDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityRequestUrl.updateGroupInfo, body);
  }
  /**
   * 新增分组
   */
  public addGroupInfo(body: GroupDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityRequestUrl.addGroupInfo, body);
  }

  /**
   * 新增分组
   */
  public getPoleInfoByDeviceId(body: any): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityRequestUrl.getPoleInfoByDeviceId, body);
  }

  /**
   * 配置设备信息
   */
  public setInstructDeviceInfo(body: any, url: string): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(url, body);
  }
  /**
   * 查询未分组设备信息
   */
  public notInGroupForEquipmentMap(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(GroupServiceUrlConst.notInGroupForEquipmentMap, body);
  }

  /**
   * 根据分组id查询地图位置信息
   */
  public getEquipmentMapByGroupIds(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(GroupServiceUrlConst.getEquipmentMapByGroupIds, body);
  }

  /**
   * 获取设备配置动态值
   */
  public  queryGatewayPropertyConfig(gatewayId: string): Observable<ResultModel<{ any}>> {
    return this.$http.get<ResultModel<any>>(`${FacilityRequestUrl.queryGatewayPropertyConfig}/${gatewayId}`);
  }

  /**
   * 根据网关id获取传感器列表
   * param gatewayId
   */
  public getSensorListByGatewayId(body: QueryConditionModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${FacilityRequestUrl.getSensorListByGatewayId}`, body);
  }

  /**
   * 批量配置
   */
  public batchConfigurationDevice(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityRequestUrl.equipmentBatchConfig, body);
  }

  /**
   * 查询设施总数
   */
  public  countDeviceAreaList(): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${DEVICE_SERVER}/deviceInfo/countDeviceAreaList`);
  }

  /**
   * 区域选择器设施查询
   */
  public queryDeviceInfo(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DEVICE_SERVER}/deviceInfo/queryDeviceInfo`, body);
  }

  /**
   * 选择设施组件列表请求
   */
  public queryDeviceListForComp(queryCondition: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(FacilityRequestUrl.listDeviceByPage, queryCondition);
  }

  /**
   *  选择设备组件列表请求
   */
  public queryEquipmentListForComp(queryCondition: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(FacilityRequestUrl.listEquipmentByPage, queryCondition);
  }
  /**
   * 查询设备设施指令模式是自动或手动
   * @param body 查询的分组或回路
   */
  public checkEquipmentMode(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityRequestUrl.checkEquipmentMode, body);
  }

  /**
   * 获取权限区域
   */
  public queryAreaListForPageSelection(): Observable<ResultModel<NzTreeNode[]>> {
    return this.$http.post<ResultModel<NzTreeNode[]>>(`${QUERY_AREA}`, new QueryConditionModel());
  }

  /**
   * 通过资产类型的code分页查询编码标准列表
   */
  public queryCodingRulePageByType(queryCondition: QueryConditionModel): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(FacilityRequestUrl.queryCodingRulePageByType, queryCondition);
  }

  /**
   * 通过选择的编码标准查询中标的设施列表
   */
  public getHitDevicePage(queryCondition: QueryConditionModel): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(FacilityRequestUrl.getHitDevicePage, queryCondition);
  }

  /**
   * 通过选择的编码标准查询中标的设备列表
   */
  public getHitEquipmentPage(queryCondition: QueryConditionModel): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(FacilityRequestUrl.getHitEquipmentPage, queryCondition);
  }

  /**
   * 设施批量编码
   */
  public batchUpdateDeviceCode(body): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(FacilityRequestUrl.batchUpdateDeviceCode, body);
  }

  /**
   * 设备批量编码
   */
  public batchUpdateEquipmentCode(body): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(FacilityRequestUrl.batchUpdateEquipmentCode, body);
  }
  /**
   * 查询杆型图详情
   */
  public poleImageInfo(productId: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${FacilityRequestUrl.poleImageInfo}/${productId}`);
  }

    /**
     * 新增或编辑设施设备时，判断表单资产编码字段是否禁用
     */
    public checkCodingRule(body): Observable<ResultModel<boolean>> {
        return this.$http.post<ResultModel<boolean>>(FacilityRequestUrl.checkCodingRule, body);
    }
}
