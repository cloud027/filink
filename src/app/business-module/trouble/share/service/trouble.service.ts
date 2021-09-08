import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TroubleInterface} from './trouble.interface';
import {Observable} from 'rxjs';
import {
  QUERY_TROUBLE_LIST,
  QUERY_TROUBLE_SHOW_TYPE,
  ADD_TROUBLE,
  DELETE_TROUBLE,
  TROUBLE_REMARK,
  UPDATE_TROUBLE,
  QUERY_TROUBLE_PROCESS,
  QUERY_TROUBLE_PROCESS_HISTORY,
  GET_SUPERIOR_DEPARTMENT,
  GET_FLOWCHART,
  QUERY_DEPART_NAME,
  TROUBLE_ASSIGN,
  QUERY_DEVICE_LIST,
  QUERY_EQUIPMENT_LIST,
  QUERY_PERSON,
  GET_ALARM_PIC,
  QUERY_FACILITY_INFO,
  QUERY_TROUBLE_PROCESS_HISTORY_PAGE,
  TROUBLE_ASSIGN_ALL, EXPORT_TROUBLE_LIST,
} from '../const/trouble-service.const';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {TroubleModel} from '../../../../core-module/model/trouble/trouble.model';
import {TroubleDisplayTypeModel} from '../model/trouble-display-type.model';
import {TroubleAddFormModel} from '../model/trouble-add-form.model';
import {RemarkFormModel} from '../model/remark-form.model';
import {NzTreeNode} from 'ng-zorro-antd';
import {DepartModel} from '../model/depart.model';
import {AssignFormModel} from '../model/assign-form.model';
import {DetailPicModel} from '../../../../core-module/model/detail-pic.model';
import {TroublePicInfoModel} from '../model/trouble-pic-info.model';
import {EquipmentModel} from '../../../../core-module/model/equipment.model';
import {UnitParamsModel} from '../../../../core-module/model/unit-params.model';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {DeviceFormModel} from '../../../../core-module/model/work-order/device-form.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {TROUBLE_SERVER} from '../../../../core-module/api-service/api-common.config';


@Injectable()
export class TroubleService implements TroubleInterface {

  constructor(private $http: HttpClient) {
  }
  // 故障列表
  queryTroubleList(body: QueryConditionModel): Observable<ResultModel<TroubleModel[]>> {
    return this.$http.post<ResultModel<TroubleModel[]>>(`${QUERY_TROUBLE_LIST}`, body);
  }
  // 故障卡片
  queryTroubleLevel(id: number): Observable<ResultModel<TroubleDisplayTypeModel[]>> {
    return this.$http.get<ResultModel<TroubleDisplayTypeModel[]>>(`${QUERY_TROUBLE_SHOW_TYPE}/${id}`);
  }
  // 新增故障
  addTrouble(body: TroubleAddFormModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ADD_TROUBLE}`, body);
  }
  // 删除故障
  deleteTrouble(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_TROUBLE}`, body);
  }
  // 故障备注
  troubleRemark(body: RemarkFormModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${TROUBLE_REMARK}`, body);
  }
  // 编辑故障
  updateTrouble(body: TroubleAddFormModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_TROUBLE}`, body);
  }
  // 查看故障流程
  queryTroubleProcess(id: string): Observable<ResultModel<TroubleModel>> {
    return this.$http.get<ResultModel<TroubleModel>>(`${QUERY_TROUBLE_PROCESS}/${id}`);
  }
  // 查看故障历史流程
  queryTroubleProcessHistory(id: string): Observable<ResultModel<TroubleModel[]>> {
    return this.$http.get<ResultModel<TroubleModel[]>>(`${QUERY_TROUBLE_PROCESS_HISTORY}/${id}`);
  }
  // 查看故障历史流程带分页分页
  queryTroubleProcesslistHistoryPage(body: QueryConditionModel): Observable<ResultModel<TroubleModel[]>> {
    return this.$http.post<ResultModel<TroubleModel[]>>(`${QUERY_TROUBLE_PROCESS_HISTORY_PAGE}`, body);
  }
  // 获取当前单位上级单位
  getSuperiorDepartment(body: UnitParamsModel): Observable<ResultModel<NzTreeNode[]>> {
    return this.$http.post<ResultModel<NzTreeNode[]>>(`${GET_SUPERIOR_DEPARTMENT}`, body);
  }
  // 获取部门下的所有人
  queryPerson(body: string[]): Observable<ResultModel<NzTreeNode[]>> {
    return this.$http.post<ResultModel<NzTreeNode[]>>(`${QUERY_PERSON}`, body);
  }
  // 获取部门id查询责任人
  queryDepartName(id: string): Observable< ResultModel<DepartModel>> {
    return this.$http.get< ResultModel<DepartModel>>(`${QUERY_DEPART_NAME}/${id}`);
  }
  // 获取流程图
  getFlowChart(id: string): Observable<Blob | ResultModel<string>> {
    return this.$http.get(`${GET_FLOWCHART}/${id}`, {responseType: 'blob'});
  }
  // 故障指派
  troubleAssign(body: AssignFormModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${TROUBLE_ASSIGN}`, body);
  }
  // 批量故障指派
  troubleAssigns(body: AssignFormModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${TROUBLE_ASSIGN_ALL}`, body);
  }
  // 故障设施
  queryDevice(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${QUERY_DEVICE_LIST}`, body);
  }
  // 故障设备
  queryEquipment(body: QueryConditionModel): Observable<ResultModel<EquipmentModel[]>> {
    return this.$http.post<ResultModel<EquipmentModel[]>>(`${QUERY_EQUIPMENT_LIST}`, body);
  }
  // 故障详情图片
  queryTroublePic(body: DetailPicModel): Observable<ResultModel<TroublePicInfoModel[]>> {
    return this.$http.post<ResultModel<TroublePicInfoModel[]>>(`${GET_ALARM_PIC}`, body);
  }
  // 查询设施信息
  queryFacilityInfo(body: {deviceId: string}): Observable<ResultModel<DeviceFormModel[]>> {
    return this.$http.post<ResultModel<DeviceFormModel[]>>(`${QUERY_FACILITY_INFO}`, body);
  }
  // 故障导出
  exportTroubleList(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${EXPORT_TROUBLE_LIST}`, body);
  }

  // ----------------------------------------故障统计-----------------------------
  /** 故障统计 */
  troubleStatistic_API(URL: string, body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${TROUBLE_SERVER}${URL}`, body);
  }
  /** 故障统计 导出接口 */
  troubleStatisticExport_API(URL: string, body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${TROUBLE_SERVER}/statistics/${URL}`, body);
  }
  // ----------------------------------------故障统计-----------------------------
}

