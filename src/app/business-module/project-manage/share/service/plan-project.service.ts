import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PlanProjectUrlConst} from '../const/plan-project-service-url.const';
import {ProjectInfoModel} from '../model/project-info.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {WisdomPointInfoModel} from '../../../../core-module/model/plan/wisdom-point-info.model';
import {FinishProjectParamModel} from '../model/finish-project-param.model';
import {ProjectWisdomStatisticsModel} from '../model/project-wisdom-statistics.model';

/**
 * 规划项目接口服务
 */
@Injectable()
export class PlanProjectApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 项目名称重复性校验
   */
  public checkProjectName(body: {projectId: string, projectName: string}): Observable<Object> {
    return this.$http.post(PlanProjectUrlConst.checkProjectName, body);
  }

  /**
   * 项目编号重复性校验
   */
  public checkProjectCode(body: {projectId: string, projectCode: string}): Observable<Object> {
    return this.$http.post(PlanProjectUrlConst.checkProjectCode, body);
  }
  /**
   * 项目智慧杆名称重复校验
   */
  public checkProjectPointName(body: {pointId: string, pointName: string}): Observable<Object> {
    return this.$http.post(PlanProjectUrlConst.checkProjectPointName, body);
  }

  /**
   * 新增项目
   * @param body 项目信息
   */
  public addProjectInfo(body: ProjectInfoModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanProjectUrlConst.addProjectInfo, body);
  }

  /**
   * 修改项目
   * @param body 项目信息
   */
  public updateProjectInfo(body: ProjectInfoModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanProjectUrlConst.updateProjectInfo, body);
  }

  /**
   * 根据项目id查询项目基本信息
   * @param body 项目信息
   */
  public queryProjectInfoById(body): Observable<ResultModel<ProjectInfoModel>> {
    return this.$http.get<ResultModel<ProjectInfoModel>>(`${PlanProjectUrlConst.queryProjectInfoById}/${body}`);
  }
  /**
   * 查询项目列表
   * @param body 项目信息
   */
  public queryProjectInfoListByPage(body: QueryConditionModel): Observable<ResultModel<ProjectInfoModel[]>> {
    return this.$http.post<ResultModel<ProjectInfoModel[]>>(PlanProjectUrlConst.queryProjectInfoListByPage, body);
  }

  /**
   * 批量启动项目
   * @param body 项目id集合
   */
  public startProject(body: string[]): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(PlanProjectUrlConst.startProject, body);
  }

  /**
   * 批量结束项目
   * @param body 要结束的项目id和完成建设的智慧杆点位id
   */
  public finishProject(body: FinishProjectParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanProjectUrlConst.finishProject, body);
  }

  /**
   * 查询项目下在建状态的点位列表(分页带权限)
   * @param body 项目id集合
   */
  public queryBuildingPointByPage(body: QueryConditionModel): Observable<ResultModel<WisdomPointInfoModel[]>> {
    return this.$http.post<ResultModel<WisdomPointInfoModel[]>>(PlanProjectUrlConst.queryBuildingPointByPage, body);
  }
  /**
   * 批量删除项目
   * @param body 项目id集合
   */
  public deleteProjectInfo(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<any>>(PlanProjectUrlConst.deleteProjectInfo, body);
  }

  /**
   * 查询项目列表统计卡片
   */
  public queryProjectInfoStatistics(): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(PlanProjectUrlConst.queryProjectInfoStatistics);
  }

  /**
   * 项目列表导出
   */
  public exportProjectList(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(PlanProjectUrlConst.exportProjectList, body);
  }


  /**
   * 查询项目智慧杆列表
   * @param body 智慧杆列表查询条件
   */
  public queryProjectPoleByPage(body: QueryConditionModel): Observable<ResultModel<WisdomPointInfoModel[]>> {
    return this.$http.post<ResultModel<WisdomPointInfoModel[]>>(PlanProjectUrlConst.queryProjectPoleByPage, body);
  }


  /**
   * 查询项目智慧杆列表统计卡片
   */
  public queryProjectPoleStatistics(): Observable<ResultModel<ProjectWisdomStatisticsModel[]>> {
    return this.$http.post<ResultModel<ProjectWisdomStatisticsModel[]>>(PlanProjectUrlConst.queryProjectPoleStatistics, {});
  }

  /**
   * 项目智慧杆列表导出
   */
  public exportProjectPoleList(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(PlanProjectUrlConst.exportProjectPointList, body);
  }

  /**
   * 更新点位
   * @param body 项目信息
   */
  public updatePointInfo(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanProjectUrlConst.updatePointInfo, body);
  }

  /**
   * 校验项目智慧杆点位能否修改
   * @param body 项目信息
   */
  public checkPointCanUpdate(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${PlanProjectUrlConst.checkPointCanUpdate}`, body);
  }

  /**
   * 更新项目智慧杆点位状态
   * @param body 项目信息
   */
  public updateProjectStatus(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanProjectUrlConst.updateProjectStatus, body);
  }

  /**
   * 根据项目id查询项目基本信息
   * @param body 项目信息
   */
  public queryProjectPointById(body): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${PlanProjectUrlConst.queryProjectPointById}/${body}`);
  }

  /**
   * 新增项目点位
   */
  public addProjectPoint(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanProjectUrlConst.addProjectPoint, body);
  }


  /**
   * 修改项目点位
   */
  public updateProjectPoint(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanProjectUrlConst.updateProjectPoint, body);
  }

  /**
   * 修改项目点位
   */
  public queryPointInfoByProjectId(body): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${PlanProjectUrlConst.queryPointInfoByProjectId}/${body}`);
  }
}
