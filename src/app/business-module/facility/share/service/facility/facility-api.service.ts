import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {EquipmentModelModel} from '../../model/equipment-model.model';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {FacilityDetailFormModel} from '../../model/facility-detail-form.model';
import {
  AUTO_DEVICE_NAME,
  CHECK_DEVICE_CODE,
  DEVICE_LIST_BY_PAGE, DEVICE_MIGRATION, DEVICE_MIGRATION_WITH_NEW_AREA,
  DOWNLOAD_TEMPLATE, EQUIPMENT_MIGRATION, EQUIPMENT_MIGRATION_WITH_NEW_AREA,
  GET_MODEL,
  GET_PROJECT_LIST,
  IMPORT_DEVICE,
  QUERY_MOUNT_EQUIPMENT,
  UPDATE_DEVICE_BY_ID,
  UPLOAD_IMG
} from '../../../../../core-module/api-service/facility/facility-request-url-old';
import {Project} from '../../model/project';
import {FacilityServiceUrlConst} from '../../const/facility-service-url.const';
import {FacilityLog} from '../../../../../core-module/model/facility/facility-log';
import {AlarmListModel} from '../../../../../core-module/model/alarm/alarm-list.model';
import {FacilityListModel} from '../../../../../core-module/model/facility/facility-list.model';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {MigrationModel} from '../../model/migration.model';

/**
 * 设施管理服务接口实现类
 */
@Injectable()
export class FacilityApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 新增设施
   */
  public addDevice(body: FacilityDetailFormModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityServiceUrlConst.addDevice, body);

  }

  /**
   * 删除设施
   */
  public deleteDeviceDyIds(deviceIds: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityServiceUrlConst.deleteDevice, deviceIds);
  }

  /**
   * 设施列表请求
   */
  public deviceListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${DEVICE_LIST_BY_PAGE}`, queryCondition);
  }

  /**
   * 设施名称自动生成
   */
  public getDeviceAutoName({deviceName: string}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${AUTO_DEVICE_NAME}`, {deviceName: string});
  }

  /**
   * 设施迁移
   */
  public deviceMigration(body: MigrationModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DEVICE_MIGRATION}`, body);
  }

  /**
   * 设施迁移
   */
  public deviceMigrationWithNewArea(body: MigrationModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<any>>(`${DEVICE_MIGRATION_WITH_NEW_AREA}`, body);
  }

  /**
   * 设备迁移
   */
  public equipmentMigrationWithNewArea(body: MigrationModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<any>>(`${EQUIPMENT_MIGRATION_WITH_NEW_AREA}`, body);
  }

  /**
   * 设备迁移
   */
  public equipmentMigration(body: MigrationModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${EQUIPMENT_MIGRATION}`, body);
  }

  /**
   * 根据设施类型获取型号相关信息
   */
  public getModelByType(body: { type: string, typeObject: string }): Observable<ResultModel<EquipmentModelModel[]>> {
    return this.$http.post<ResultModel<EquipmentModelModel[]>>(`${GET_MODEL}`, body);
  }

  /**
   * 获取项目列表
   */
  public getProjectList(): Observable<ResultModel<Array<Project>>> {
    return this.$http.post<ResultModel<Array<Project>>>(`${GET_PROJECT_LIST}`, {});
  }

  /**
   * 挂载设备概览列表
   */
  public queryMountEquipment(queryCondition: QueryConditionModel): Observable<ResultModel<Array<EquipmentListModel>>> {
    return this.$http.post<ResultModel<Array<EquipmentListModel>>>(`${QUERY_MOUNT_EQUIPMENT}`, queryCondition);
  }

  /**
   * 编辑设施
   */
  public updateDeviceById(facilityDetailFormModel: FacilityDetailFormModel): Observable<ResultModel<string>> {
    return this.$http.put<ResultModel<string>>(`${UPDATE_DEVICE_BY_ID}`, facilityDetailFormModel);
  }

  /**
   * 下载模板
   */
  public downloadTemplate(): Observable<Blob> {
    return this.$http.get<Blob>(`${DOWNLOAD_TEMPLATE}`);
  }

  /**
   * 导入
   */
  public importDeviceInfo(params: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${IMPORT_DEVICE}`, params);
  }

  /**
   * 上传图片
   * param formData FormData
   */
  public uploadPicture(formData: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(UPLOAD_IMG, formData);
  }

  /**
   * 校验资产编码
   */
  public queryFacilityCodeIsExist(body: { deviceCode: string, deviceId: string }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(CHECK_DEVICE_CODE, body);
  }


  /**
   *  查询设施名称是否存在
   */
  public queryDeviceNameIsExist(body): Observable<Object> {
    return this.$http.post(FacilityServiceUrlConst.queryDeviceNameIsExist, body);
  }

  /**
   * 查询设施日志
   */
  public queryDeviceLogListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<FacilityLog[]>> {
    return this.$http.post<ResultModel<FacilityLog[]>>(FacilityServiceUrlConst.deviceLogListByPage, queryCondition);
  }

  /**
   * 导出设施
   */
  public exportDeviceList(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityServiceUrlConst.exportDeviceList, body);
  }
  /**
   * 导出设施已拆除
   */
   public exportDeviceListNew(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityServiceUrlConst.exportDeviceListNew, body);
  }
  /**
   * 导出设备日志
   */
  public exportLogList(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityServiceUrlConst.exportDeviceLogList, body);
  }

  /**
   * 获取光缆信息列表
   */
  public getCableList(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.opticCableListByPage, body);
  }

  /**
   * 根据光缆id查询详情
   */
  public queryCableById(id: string): Observable<ResultModel<string>> {
    return this.$http.get<ResultModel<string>>(`${FacilityServiceUrlConst.queryOpticCableById}/${id}`);
  }

  /**
   * 新增光缆信息
   */
  public addCable(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityServiceUrlConst.addOpticCable, body);
  }

  /**
   * 光缆名称校验
   */
  public checkCableName(name: string, id: string): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(FacilityServiceUrlConst.checkOpticCableName, {opticCableName: name, opticCableId: id});
  }

  /**
   * 编辑光缆信息
   */
  public updateCable(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityServiceUrlConst.updateOpticCableById, body);
  }

  /**
   * 删除光缆
   */
  public deleteCableById(id: string): Observable<Object> {
    return this.$http.get(`${FacilityServiceUrlConst.deleteOpticCableById}/${id}`);
  }

  /**
   * 导出光缆列表
   */
  public exportCableList(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.exportOpticCableList, body);
  }

  /**
   * 获取光缆段信息列表
   */
  public getCableSegmentList(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.opticCableSectionById, body);
  }

  /**
   * 删除光缆段信息
   */
  public deleteCableSectionById(id: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${FacilityServiceUrlConst.deleteOptic}/${id}`);
  }

  /**
   * 导出光缆列表
   */
  public exportCableSectionList(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.exportOptic, body);
  }

  /**
   * 获取拓扑光缆
   */
  public opticCableSectionByIdForTopology(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.opticCableSectionByIdForTopology, body);
  }

  /**
   * 获取智能标签列表
   */
  public getSmartLabelList(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.opticCableSectionRFidInfoById, body);
  }

  /**
   * 获取智能标签列表删除
   */
  public deleteSmartLabelInfo(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.deleteOpticCableSectionRFidInfoById, body);
  }

  /**
   * 根据设施id查询当前用户是否存在全部设施权限
   */
  public deviceIdCheckUserIfDevicePermission(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.existIsPermissionDeviceByDeviceIdList, body);
  }

  /**
   * 根据设施id查询当前用户有权限的设施信息
   */
  public deviceIdCheckUserIfDeviceData(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.checkIsPermissionDeviceByDeviceIdList, body);
  }

  /**
   * 查询最近一条设施日志的时间
   */
  public deviceLogTime(id: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${FacilityServiceUrlConst.queryRecentDeviceLogTime}/${id}`);
  }

  /**
   * 根据部门查询告警工单
   */
  public queryAlarmOrderRuleByDeptIds(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.queryAlarmOrderRuleByAreaDeptIds, body);
  }

  /**
   * 根据设施查询当前告警
   */
  public queryAlarmDeviceId(id: string): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${FacilityServiceUrlConst.queryAlarmDeviceId}/${id}`, {});
  }

  /**
   * 根据设施查询历史告警
   */
  public queryAlarmHistoryDeviceId(id: string): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${FacilityServiceUrlConst.queryAlarmHistoryDeviceId}/${id}`, {});
  }

  /**
   * 查询杆体上可挂载的设备
   */
  public updatePoleInfoByEquipment(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.updatePoleInfoByEquipment, body);
  }

  /**
   * 查询设施杆体信息
   */
  public queryDeviceInfo(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.queryDeviceInfo, body);
  }

  /**
   * 新增设备
   */
  public addEquipment(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(FacilityServiceUrlConst.addEquipment, body);
  }

  /**
   * 修改设施业务状态 释放、锁定
   */
  public updateDeviceStatusByIds(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<string>>(FacilityServiceUrlConst.updateDeviceStatusByIds, body);
  }

  /**
   * 修改设备业务状态 释放、锁定
   */
  public updateEquipmentStatusByIds(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<string>>(FacilityServiceUrlConst.updateEquipmentStatusByIds, body);
  }

  /**
   * 保存同步产品杆型图
   */
  public saveSyncProduct(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(FacilityServiceUrlConst.saveSyncProduct, body);
  }
}
