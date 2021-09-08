import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultModel } from 'src/app/shared-module/model/result.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import { TeamManageListModel } from '../model/team-manage-list.model';
import {PersonInfoModel} from '../model/person-info.model';
import {JobStatusEnum} from '../enum/job-status.enum';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {WorkShiftDataModel} from '../model/work-shift-data.model';
import { USER_SERVER, DEVICE_SERVER } from 'src/app/core-module/api-service/api-common.config';
import {WorkforceManagementListModel} from '../model/workforce-management-list.model';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {UserListModel} from '../../../../core-module/model/user/user-list.model';

@Injectable()
export class ScheduleApiService {
  constructor(private $http: HttpClient) {
  }
  // 获取人员列表
  queryPersonInformation(body: QueryConditionModel): Observable<ResultModel<PersonInfoModel[]>> {
    return this.$http.post<ResultModel<PersonInfoModel[]>>(`${USER_SERVER}/personInformation/pagingQueryList`, body);
  }
  // 根据id查询人员信息回显
  getPersonListById(id: string): Observable<ResultModel<PersonInfoModel>> {
    return this.$http.get<ResultModel<PersonInfoModel>>(`${USER_SERVER}/personInformation/details/${id}`);
  }
  // 人员信息在职状态变化
  updateJobStatus(body: {onJobStatus: JobStatusEnum, id: string}): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${USER_SERVER}/personInformation/updateJobStatus`, body);
  }
  // 删除人员信息
  deletePersonData(id: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${USER_SERVER}/personInformation/batchDelete`, id);
  }
  // 导入人员信息
  importPersonInfo(params: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${USER_SERVER}/personInformation/importData`, params);
  }
  // 导出人员信息
  exportPersonInfo(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${USER_SERVER}/personInformation/exportProcess`, body);
  }
  // 新增/编辑人员信息
  savePersonInfo(body: PersonInfoModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${USER_SERVER}/personInformation/save`, body);
  }
  // 人员信息关联用户
  associatedUsers(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${USER_SERVER}/personInformation/associatedUser`, body);
  }
  // 检验姓名在人员信息中的唯一性
  checkPersonName(body: {personName: string, id?: string}): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${USER_SERVER}/personInformation/checkPersonName`, body);
  }
  // 检验工号在人员信息中的唯一性
  checkPhoneNumber(body: {phoneNumber: string, id?: string}): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${USER_SERVER}/personInformation/checkPhoneNumber`, body);
  }
  // 检验手机号在人员信息中的唯一性
  checkJobNumber(body: {jobNumber: string, id?: string}): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${USER_SERVER}/personInformation/checkJobNumber`, body);
  }
  // 查询用户 排除已被关联的用户
  queryUserByFieldForPerson(body: QueryConditionModel): Observable<ResultModel<UserListModel[]>> {
    return this.$http.post<ResultModel<UserListModel[]>>(`${USER_SERVER}/user/queryUserByFieldForPerson`, body);
  }
  // 编辑人员信息时判断人员是否在班组中不允许修改单位
  validateWhetherInOther(id: string): Observable<ResultModel<boolean>> {
    return this.$http.get<ResultModel<boolean>>(`${USER_SERVER}/personInformation/validateWhetherInOther/${id}`);
  }
  // 班次数据
  queryListShiftByPage(body: QueryConditionModel): Observable<ResultModel<WorkShiftDataModel[]>> {
    return this.$http.post<ResultModel<WorkShiftDataModel[]>>(`${USER_SERVER}/shift/pagingQueryList`, body);
  }

  /**
   * 获取班次列表全量数据
   */
  queryListShiftAll(): Observable<ResultModel<WorkShiftDataModel[]>> {
    return this.$http.post<ResultModel<WorkShiftDataModel[]>>(`${USER_SERVER}/shift/queryList`, {});
  }

  // 根据id查询班次信息
  queryListShiftById(id: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${USER_SERVER}/shift/details/${id}`);
  }

  // 新增/编辑班次信息
  saveShiftInfo(body: WorkShiftDataModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${USER_SERVER}/shift/save`, body);
  }

  // 删除班次信息
  deleteShiftBatch(id: string[]): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${USER_SERVER}/shift/batchDelete`, id);
  }
  // 导出班次列表数据
  exportShiftData(body: ExportRequestModel): Observable<ResultModel<WorkShiftDataModel[]>> {
    return this.$http.post<ResultModel<WorkShiftDataModel[]>>(`${USER_SERVER}/shift/exportProcess`, body);
  }

  // 校验班次名称是否重复
  checkShiftName(body: {shiftName: string, id?: string}): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${USER_SERVER}/shift/checkShiftName`, body);
  }
  // 校验班次类型是否重复
  checkShiftType(body: {shiftType: string, id?: string}): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${USER_SERVER}/shift/checkShiftType`, body);
  }
  // 校验时间上是否有交叉
  checkSave (body: WorkShiftDataModel): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${USER_SERVER}/shift/checkSave`, body);
  }
  // 查询班组列表数据
  queryListTeamByPage(body: QueryConditionModel): Observable<ResultModel<TeamManageListModel[]>> {
    return this.$http.post<ResultModel<TeamManageListModel[]>>(`${USER_SERVER}/team/pagingQueryList`, body);
  }

  // 导出班组列表数据
  exportTeamData(body: ExportRequestModel): Observable<ResultModel<TeamManageListModel[]>> {
    return this.$http.post<ResultModel<TeamManageListModel[]>>(`${USER_SERVER}/team/exportProcess`, body);
  }

  // 根据id查询班组信息
  queryListTeamById(id: string): Observable<ResultModel<TeamManageListModel>> {
    return this.$http.get<ResultModel<TeamManageListModel>>(`${USER_SERVER}/team/details/${id}`);
  }

  // 校验班组名称唯一性
  checkTeamName(body: {teamName: string, id?: string}): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${USER_SERVER}/team/checkTeamName`, body);
  }

  // 新增/编辑 班组信息
  saveMaintenanceTeamInfo(body: TeamManageListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<any>>(`${USER_SERVER}/team/save`, body);
  }

  // 删除班组信息
  deleteTeamBatch(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${USER_SERVER}/team/batchDelete`, body);
  }

  // 获取可选择的班组成员人员列表
  queryFreeTeamMembers(body: QueryConditionModel): Observable<ResultModel<PersonInfoModel[]>> {
    return this.$http.post<ResultModel<PersonInfoModel[]>>(`${USER_SERVER}/personInformation/pagingQueryFreeList`, body);
  }

  // 判断选择的班组成员是否在排班中
  checkScheduling(ids: string[]): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${USER_SERVER}/schedulingPerson/checkScheduling`, ids);
  }


  // 查询排班列表数据
  queryListScheduleByPage(body: QueryConditionModel): Observable<ResultModel<WorkforceManagementListModel[]>> {
    return this.$http.post<ResultModel<WorkforceManagementListModel[]>>(`${USER_SERVER}/workSchedule/pagingQueryList`, body);
  }

  // 导出排班列表数据
  exportScheduleData(body: ExportRequestModel): Observable<ResultModel<WorkforceManagementListModel[]>> {
    return this.$http.post<ResultModel<WorkforceManagementListModel[]>>(`${USER_SERVER}/workSchedule/exportProcess`, body);
  }

  // 根据选择的班组查询区域选择器数据
  getIntersectionOfRegionsList(deptCode: string[]): Observable<ResultModel<AreaModel[]>> {
    return this.$http.post<ResultModel<AreaModel[]>>(`${DEVICE_SERVER}/areaInfo/getIntersectionOfRegionsList`, deptCode);
  }

  // 根据id查询排班基本信息
  queryListScheduleById(id: string): Observable<ResultModel<WorkforceManagementListModel>> {
    return this.$http.get<ResultModel<any>>(`${USER_SERVER}/workSchedule/details/${id}`);
  }

  // 判断该日期选择的排班人员是否与其他排班中的人员有冲突
  checkManualScheduleSave(body): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${USER_SERVER}/workSchedule/checkManualScheduleSave`, body);
  }

  // 新增、编辑排班信息
  saveMaintenanceScheduleInfo(body): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${USER_SERVER}/workSchedule/save`, body);
  }

  // 删除排班信息
  deleteScheduleBatch(ids: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${USER_SERVER}/workSchedule/batchDelete`, ids);
  }

  // 自动排班
  autoScheduleInfo(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${USER_SERVER}/workSchedule/autoScheduling`, body);
  }

  // 检查班组和班次是否在时间上和其他排班有冲突
  checkTeamAndShiftConflict(body): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${USER_SERVER}/workSchedule/checkSave`, body);
  }

  // 查看人员排班信息 表格分页
  schedulingPersonPageList(body: QueryConditionModel): Observable<ResultModel<WorkforceManagementListModel[]>> {
    return this.$http.post<ResultModel<WorkforceManagementListModel[]>>(`${USER_SERVER}/workSchedule/schedulingPersonPageList`, body);
  }

  // 查看人员排班信息 日历显示
  schedulingPersonCalendar(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${USER_SERVER}/workSchedule/schedulingPersonCalendar`, body);
  }
}
