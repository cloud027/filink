import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {EnergyServiceUrlConst} from '../../const/energy-service-url.const';
import {EnergyNodesAddInfoModel} from '../../model/energy-nodes-add-info.model';
import {EnergyDataCollectionTaskList} from '../../model/energy-dataCollection-task-list.model';
import {GroupListModel} from '../../../../application-system/share/model/equipment.model';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';

export class Project {
  /**
   * 项目ID
   */
  public projectId: string;
  /**
   * 项目名称
   */
  public projectName: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnergyApiService {
  // 消息订阅流
  messageTopic = new Subject<any>();
  // 通过订阅的方式拿到消息
  subscribeMessage: Observable<any>;

  constructor(private $http: HttpClient) {
    this.subscribeMessage = this.messageTopic.asObservable();
  }

  // 获取项目数据
  public getProjectList_API(): Observable<ResultModel<Array<Project>>> {
    return this.$http.post<ResultModel<Array<Project>>>(EnergyServiceUrlConst.getProjectListURL, {});
  }

  // 获取能耗节点数据
  public energyNodesListData_API(body) {
    return this.$http.post(EnergyServiceUrlConst.energyNodesListURL, body);
  }

  // 能耗节点 列表 导出
  public energyNodesListExport_API(body) {
    return this.$http.post(EnergyServiceUrlConst.energyNodesListExportURL, body);
  }

  /** 能耗节点 列表 导入 */
  public energyNodesListImport_API(body) {
    return this.$http.post(EnergyServiceUrlConst.energyNodesListImportURL, body);
  }

  // 新增能耗节点
  public energyNodesInsert_API(body: EnergyNodesAddInfoModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EnergyServiceUrlConst.energyNodesInsertURL, body);
  }

  // 删除能耗节点
  public energyNodesDelete_API(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EnergyServiceUrlConst.energyNodesDeleteURL, body);
  }

  // 修改能耗节点
  public energyNodesUpdate_API(body: EnergyNodesAddInfoModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EnergyServiceUrlConst.energyNodesUpdateURL, body);
  }

  // 根据 id 获取能耗节点数据
  public energyNodesQueryById_API(body): Observable<ResultModel<EnergyNodesAddInfoModel[]>> {
    return this.$http.post<ResultModel<EnergyNodesAddInfoModel[]>>(
      EnergyServiceUrlConst.energyNodesQueryByIdURL,
      body,
    );
  }

  // 根据 id 查询 采集设施
  public energyNodesDeviceQueryById_API(body): Observable<ResultModel<EnergyNodesAddInfoModel[]>> {
    return this.$http.post<ResultModel<EnergyNodesAddInfoModel[]>>(
      EnergyServiceUrlConst.energyNodesDeviceQueryByIdURL,
      body,
    );
  }

  // 根据 id 查询 采集设备
  public energyNodesEquipmentQueryById_API(
    body,
  ): Observable<ResultModel<EnergyNodesAddInfoModel[]>> {
    return this.$http.post<ResultModel<EnergyNodesAddInfoModel[]>>(
      EnergyServiceUrlConst.energyNodesEquipmentQueryByIdURL,
      body,
    );
  }

  // 根据 id 查询 采集回路
  public energyNodesLoopQueryById_API(body): Observable<ResultModel<EnergyNodesAddInfoModel[]>> {
    return this.$http.post<ResultModel<EnergyNodesAddInfoModel[]>>(
      EnergyServiceUrlConst.energyNodesLoopQueryByIdURL,
      body,
    );
  }

  // 查询设备名称是否已经存在
  public queryEnergyNodesNameIsExist_API(body: {
    equipmentId: string
    equipmentName: string
  }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(
      EnergyServiceUrlConst.queryEnergyNodesNameIsExist,
      body,
    );
  }

  /**
   * 根据设施id查询挂载位置
   */
  public findMountPositionById_API(body: {
    equipmentId: string
    equipmentType: string
  }): Observable<ResultModel<string[]>> {
    return this.$http.post<ResultModel<string[]>>(EnergyServiceUrlConst.findMountPositionById, body);
  }

  // 获取网关端口
  public queryGatewayPort_API(body): Observable<ResultModel<string[]>> {
    return this.$http.post<ResultModel<string[]>>(EnergyServiceUrlConst.queryGatewayPort, body);
  }

  // 实时数据---------------------------------------------
  /** 监测实时数据的采集任务名称是否重复 */
  public queryCollectionNameIsExist_API(body: {
    strategyId: string
    strategyName: string
  }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(
      EnergyServiceUrlConst.queryCollectionNameIsExistURL,
      body,
    );
  }

  // 实时数据列表
  realTimeDataList_API(body): Observable<ResultModel<EnergyDataCollectionTaskList[]>> {
    return this.$http.post<ResultModel<any[]>>(EnergyServiceUrlConst.realTimeDataListURL, body);
  }

  /** 实时数据 导出 */
  realTimeDataExport_API(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EnergyServiceUrlConst.realTimeDataExportURL, body);
  }

  // 数据采集任务 列表
  dataCollectionTaskList_API(body): Observable<ResultModel<EnergyDataCollectionTaskList[]>> {
    return this.$http.post<ResultModel<any[]>>(
      EnergyServiceUrlConst.dataCollectionTaskListURL,
      body,
    );
  }

  /** 数据采集任务 导出 */
  dataCollectionExport_API(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EnergyServiceUrlConst.dataCollectionExportURL, body);
  }

  // 数据采集任务的启用状态 修改
  enableOrDisableStrategy_API(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any[]>>(
      EnergyServiceUrlConst.enableOrDisableStrategyURL,
      body,
    );
  }

  // 删除数据采集任务
  public dataCollectionTaskDelete_API(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(
      EnergyServiceUrlConst.dataCollectionTaskDeleteURL,
      body,
    );
  }

  // 数据采集任务详情
  dataCollecttionTaskInfo_API(body: { strategyId: string }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(
      EnergyServiceUrlConst.dataCollecttionTaskInfoURL,
      body,
    );
  }

  // 数据采集任务 获取分组信息
  queryEquipmentGroupInfoList_API(
    queryCondition: QueryConditionModel,
  ): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(
      `${EnergyServiceUrlConst.queryEquipmentGroupInfoListURL}`,
      queryCondition,
    );
  }

  /** 获取分组信息 详情 */
  queryGroupInfoList_API(body): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(
      `${EnergyServiceUrlConst.queryGroupInfoListURL}`,
      body,
    );
  }

  /** 数据采集任务 获取区域分组 */
  queryAreaList_API(body): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(
      `${EnergyServiceUrlConst.queryAreaListURL}`,
      body,
    );
  }

  /** 数据采集任务 获取区域分组new */
  areaDataCollectListByPage(body): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(
      `${EnergyServiceUrlConst.areaDataCollectListByPage}`,
      body,
    );
  }

  // 数据采集任务 设备列表
  equipmentListByPage_API(queryCondition: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(
      `${EnergyServiceUrlConst.equipmentListByPageURL}`,
      queryCondition,
    );
  }

  // 数据采集任务 新增
  dataCollectTaskInsert_API(body): Observable<ResultModel<EnergyDataCollectionTaskList[]>> {
    return this.$http.post<ResultModel<any>>(EnergyServiceUrlConst.dataCollectTaskInsertURL, body);
  }

  // 数据采集任务 编辑
  dataCollectTaskUpdate_API(body): Observable<ResultModel<EnergyDataCollectionTaskList[]>> {
    return this.$http.post<ResultModel<any>>(EnergyServiceUrlConst.dataCollectTaskUpdateURL, body);
  }

  // 实时数据---------------------------------------------

  // ----------------------------------能耗统计-------------------------------------------------------

  // 能耗统计页面 头部的 card-list
  queryTotalEnergy_API(): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EnergyServiceUrlConst.queryTotalEnergy_URL, {});
  }

  /** 能耗统计 查询 */
  queryEnergyStatisticData_API(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(
      EnergyServiceUrlConst.queryEnergyStatisticData_URL,
      body,
    );
  }

  /** 统计排名 查询 */
  queryEnergyRankByCondition_API(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(
      EnergyServiceUrlConst.queryEnergyRankByCondition_URL,
      body,
    );
  }

  /** 能耗分析 查询 */
  queryEnergyAnalysisData_API(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(
      EnergyServiceUrlConst.queryEnergyAnalysisData_URL,
      body,
    );
  }

  /** 能耗统计 列表导出 */
  exportEnergyStatistics_API(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(EnergyServiceUrlConst.exportEnergyStatistics_URL, body);
  }

  // ----------------------------------能耗统计-------------------------------------------------------
}
