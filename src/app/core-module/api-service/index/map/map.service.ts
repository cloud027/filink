import {MapInterface} from './map.interface';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {INDEX_URL} from '../index-request-url';
import {Injectable} from '@angular/core';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {OperationRecordsModel} from '../../../../business-module/index/shared/model/log-operating.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {Result} from '../../../../shared-module/entity/result';
import {DEVICE_SERVER, ENERGY_SERVER_STATISTIC, PLAN_PROJECT_SERVER, TROUBLE_SERVER, WORK_ORDER_SERVER} from '../../api-common.config';
import {AreaFacilityDataModel, AreaFacilityModel} from '../../../../business-module/index/shared/model/area-facility-model';
import {AlarmLevelStatisticsModel} from '../../../model/alarm/alarm-level-statistics.model';
import {DeviceTypeCountModel} from '../../../model/facility/device-type-count.model';
import {AlarmStatisticsGroupInfoModel} from '../../../model/alarm/alarm-statistics-group-Info.model';
import {FacilityLogTopNumModel} from '../../../model/facility/facility-log-top-num.model';
import {EquipmentAreaModel} from '../../../model/index/equipment-area.model';
import {DeviceAreaModel} from '../../../../business-module/index/shared/model/device-area.model';

@Injectable()
export class MapService implements MapInterface {
  constructor(private $http: HttpClient) {
  }

  // 查询所有设施列表
  getALLFacilityList(): Observable<Result> {
    return this.$http.get<Result>(`${INDEX_URL.GET_FACILITY_LIST_ALL}`);
  }

  // 查询所有设施列表(基本数据，key值简化)
  getALLFacilityListBase(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_FACILITY_LIST_ALL_BASE}`);
  }

  // 查询所有设施列表(key值简化)
  getALLFacilityListSimple(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_FACILITY_LIST_ALL_SIMPLE}`);
  }

  // 查询所有区域列表
  getALLAreaList(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_AREA_LIST_ALL}`);
  }

  // 获取设施类型配置信息
  getALLFacilityConfig(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_FACILITY_CONFIG_ALL}`);
  }

  // 修改用户地图设施类型配置的设施类型启用状态
  modifyFacilityTypeConfig(body): Observable<Object> {
    return this.$http.post(`${INDEX_URL.UPDATE_FACILITY_TYPE_STATUS}`, body);
  }

  // 修改用户地图设施类型配置的设施图标尺寸
  modifyFacilityIconSize(body): Observable<Object> {
    return this.$http.post(`${INDEX_URL.UPDATE_FACILITY_ICON_SIZE}`, body);
  }

  // 收藏设施
  collectFacility(id): Observable<Object> {
    return this.$http.get(`${INDEX_URL.COLLECT_FACILITY}/${id}`);
  }

  // 取消收藏设施
  unCollectFacility(id): Observable<Object> {
    return this.$http.get(`${INDEX_URL.CANCEL_COLLECT_FACILITY}/${id}`);
  }

  // 获取收藏设施统计
  getCollectFacilityListStatistics(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_COLLECT_FACILITY_LIST_STATISTICS}`);
  }

  // 获取收藏设施列表
  getCollectFacilityList(body): Observable<Object> {
    return this.$http.post(`${INDEX_URL.GET_COLLECT_FACILITY_LIST}`, body);
  }

  // 获取所有收藏设施列表
  getAllCollectFacilityList(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_COLLECT_FACILITY_LIST_ALL}`);
  }

  // 查询当前用户区域列表
  getALLAreaListForCurrentUser(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.GET_AREA_LIST_FOR_CURRENT_USER}`);
  }

  // 查询设施当前告警各级别数量
  getQueryAlarmLevelGroups(params): Observable<Object> {
    return this.$http.post(`${INDEX_URL.QUERY_ALARM_LEVEL_GROUPS}`, params);
  }

  // 查询当前告警各级别数量
  queryAlarmCurrentLevelGroup(): Observable<ResultModel<Array<AlarmLevelStatisticsModel>>> {
    return this.$http.get<ResultModel<Array<AlarmLevelStatisticsModel>>>(`${INDEX_URL.QUERY_ALARM_CURRENT_LEVEL_GROUPS}`);
  }

  // 查询告警设施Top10
  queryScreenDeviceIdsGroup(): Observable<Object> {
    return this.$http.get<ResultModel<any>>(`${INDEX_URL.QUERY_SCREEN_DEVICE_IDS_GROUP}`);
  }

  // 查询告警设施Top10名称
  queryDeviceByIds(params): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${INDEX_URL.QUERY_HOME_DEVICE_IDS}`, params);
  }

  // 查询各设施状态数量
  queryUserDeviceStatusCount(): Observable<ResultModel<Array<DeviceTypeCountModel>>> {
    return this.$http.get<ResultModel<Array<DeviceTypeCountModel>>>(`${INDEX_URL.QUERY_USER_DEVICE_STATUS_COUNT}`);
  }

  // 工单增量
  queryHomeProcAddListCountGroupByDay(params): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${INDEX_URL.QUERY_HOME_PROC_ADD_LIST_COUNT_GROUP_BY_DAY}`, params);
  }

  // 查询各设施状态数量
  queryAlarmDateStatistics(id: string, body): Observable<ResultModel<Array<AlarmStatisticsGroupInfoModel>>> {
    return this.$http.post<ResultModel<Array<AlarmStatisticsGroupInfoModel>>>(`${INDEX_URL.ALARM_DATE_STATISTICS}/${id}`, body);
  }

  // 查询繁忙TOP
  queryUserUnlockingTopNum(): Observable<ResultModel<Array<FacilityLogTopNumModel>>> {
    return this.$http.get<ResultModel<Array<FacilityLogTopNumModel>>>(`${INDEX_URL.QUERY_USER_UNLOCKING_TOP_NUM}`);
  }

  // 根据光缆ID查询光缆所有设施
  queryDeviceInfoListByOpticCableId(id): Observable<Object> {
    return this.$http.get(`${INDEX_URL.QUERY_DEVICE_INFO_LIST_BY_ID}/${id}`);
  }

  // 根据设备id询端口使用率
  queryDeviceUsePortStatistics(id): Observable<Object> {
    return this.$http.get(`${INDEX_URL.QUERY_DEVICE_USE_PORT_STATISTICS}/${id}`);
  }

  // 根据Id 查询设施接口信息
  findDeviceId(id): Observable<Object> {
    return this.$http.get(`${INDEX_URL.FIND_DEVICE_ID}/${id}`);
  }

  // 根据Id 查询设施接口信息
  queryHomeDeviceById(id): Observable<Object> {
    return this.$http.get(`${INDEX_URL.QUERY_HOME_DEVICE_BY_ID}/${id}`);
  }

  // 首次加载
  queryHomeDeviceArea(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.QUERY_HOME_DEVICE_AREA}`);
  }

  // 首页大数据刷新
  refreshHomeDeviceAreaHuge(params): Observable<Object> {
    return this.$http.post(`${INDEX_URL.REFRESH_HOME_DEVICE_AREA_HUGE}`, params);
  }

  // 首页数据刷新
  refreshHomeDeviceArea(): Observable<Object> {
    return this.$http.get(`${INDEX_URL.REFRESH_HOME_DEVICE_AREA}`);
  }

  // 批量操作
  instructDistribute(body): Observable<Object> {
    return this.$http.post(`${INDEX_URL.INSTRUCT_INSTIUCT_DISTRIBUTE}`, body);
  }

  // 获取右侧详情卡亮度,或者音量初始值
  getLightnessVoice(body): Observable<Object> {
    return this.$http.post(`${INDEX_URL.QUERY_EQUIPMENT_BY_ID}`, body);
  }

  // 根据区域id查询区域中心点
  queryDevicePolymerizationsPointCenter(body: AreaFacilityModel): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${DEVICE_SERVER}/deviceInfo/queryDevicePolymerizationsPointCenter`, body);
  }

  // 根据区域id查询区域中心点
  queryEquipmentPolymerizationsPointCenter(body: AreaFacilityModel): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${DEVICE_SERVER}/equipmentInfo/queryEquipmentPolymerizationsPointCenter`, body);
  }

  // 根据区域id查询区域下所有设施信息
  queryDevicePolymerizations(body: AreaFacilityDataModel): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${DEVICE_SERVER}/deviceInfo/queryDevicePolymerizations`, body);
  }

  // 根据区域id查询区域下所有设备信息
  queryEquipmentPolymerizations(body: AreaFacilityDataModel): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${DEVICE_SERVER}/equipmentInfo/queryEquipmentPolymerizations`, body);
  }

  // 设施名称模糊查询
  queryDeviceByName(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${DEVICE_SERVER}/deviceInfo/queryDeviceByName`, body);
  }

  // 设备名称模糊查询
  queryEquipmentByName(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${DEVICE_SERVER}/equipmentInfo/queryEquipmentByName`, body);
  }

  // 操作记录
  findOperateLog(params: QueryConditionModel): Observable<ResultModel<OperationRecordsModel[]>> {
    return this.$http.post<ResultModel<OperationRecordsModel[]>>(`${INDEX_URL.FIND_OPERATE_LOG}`, params);
  }

  // 设施坐标调整保存
  deviceUpdateCoordinates(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${DEVICE_SERVER}/deviceInfo/updateCoordinates`, body);
  }

  // 设备坐标调整保存
  equipmentUpdateCoordinates(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${DEVICE_SERVER}/equipmentInfo/updateCoordinates`, body);
  }

  // 项目规划坐标调整保存
  updateCoordinates(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${PLAN_PROJECT_SERVER}/planData/updateCoordinates`, body);
  }

  // 查询首页设备的区域点
  queryEquipmentPolymerizationList(body: EquipmentAreaModel): Observable<Object> {
    return this.$http.post(`${DEVICE_SERVER}/equipmentInfo/queryEquipmentAreaListByMap`, body);
  }

  // 查询首页设施的区域点
  queryDevicePolymerizationList(body: DeviceAreaModel): Observable<Object> {
    return this.$http.post(`${DEVICE_SERVER}/deviceInfo/queryDeviceAreaListByMap`, body);
  }

  // 获取地图项目中心点
  public getProjectPolymerizationPointCenter(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${PLAN_PROJECT_SERVER}/projectData/queryProjectPolymerizationPointCenter`, body);
  }

  // 获取地图规划中心点
  public getPlanPolymerizationPointCenter(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${PLAN_PROJECT_SERVER}/planData/queryPlanPolymerizationPointCenter`, body);
  }

  // 根据区域id查询项目下设施
  getProjectNonPolymerizationPoint(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${PLAN_PROJECT_SERVER}/projectData/getProjectNonPolymerizationPoint`, body);
  }

  // 根据区域id查询规划下设施
  getPlanNonPolymerizationPoint(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${PLAN_PROJECT_SERVER}/planData/getPlanNonPolymerizationPoint`, body);
  }

  // 规划下设施名称模糊查询
  queryDeviceByNameOfPlan(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${PLAN_PROJECT_SERVER}/planData/queryPoleByName`, body);
  }

  // 项目下设施名称模糊查询
  queryDeviceByNameOfProject(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${PLAN_PROJECT_SERVER}/projectData/queryPoleByName`, body);
  }

  // 设备在线率统计图
  equipmentOnlineRateStatistics(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${DEVICE_SERVER}/maintenanceData/equipmentOnlineRateStatistics`, body);
  }

  // 故障类型统计图
  troubleTypeStatistics(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${TROUBLE_SERVER}/maintenanceData/troubleTypeStatistics`, body);
  }

  // 规划数据统计图
  planStatistics(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${PLAN_PROJECT_SERVER}/planData/planStatistics`, body);
  }

  // 项目数据统计图
  projectStatistics(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${PLAN_PROJECT_SERVER}/projectData/projectStatistics`, body);
  }

  // 工单类型统计图
  workOrderStatistics(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${WORK_ORDER_SERVER}/maintenanceData/workOrderStatistics`, body);
  }

  // 设备总能耗统计图
  equipmentTotalEnergyConsumptionStatistics(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${DEVICE_SERVER}/maintenanceData/equipmentTotalEnergyConsumptionStatistics`, body);
  }

  // 设备总能耗统计
  equipmentTotalEnergyStatistics(type): Observable<Object> {
    return this.$http.get<ResultModel<any>>(`${ENERGY_SERVER_STATISTIC}/energyStatistics/queryEnergyForHomePage/${type}`);
  }

  // 设备传输有效率统计图
  equipmentTransmissionEfficiencyStatistics(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${DEVICE_SERVER}/maintenanceData/equipmentTransmissionEfficiencyStatistics`, body);
  }

  // 故障率分析统计图
  troubleRateStatistics(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(`${TROUBLE_SERVER}/maintenanceData/troubleGrowRateStatistics`, body);
  }
}
