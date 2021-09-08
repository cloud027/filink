import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../shared-module/model/result.model';
import {ProjectInfoModel} from '../../../business-module/project-manage/share/model/project-info.model';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {PlanProjectRequestUrlConst} from './plan-project-request-url';
import {PlanInfoModel} from '../../model/plan/plan-info.model';

/**
 * 产品公共服务
 */
@Injectable()
export class PlanProjectForCommonService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询项目列表
   * param body 项目信息
   */
  public queryProjectInfoListByPage(body: QueryConditionModel): Observable<ResultModel<ProjectInfoModel[]>> {
    return this.$http.post<ResultModel<ProjectInfoModel[]>>(PlanProjectRequestUrlConst.queryProjectInfoListByPage, body);
  }

  /**
   * 根据智慧名称查询智慧杆
   */
  public queryPoleByName(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(PlanProjectRequestUrlConst.queryPoleByName, body);
  }

  /**
   * 查询规划列表
   */
  public selectPlanList(body): Observable<ResultModel<PlanInfoModel[]>> {
    return this.$http.post<ResultModel<PlanInfoModel[]>>(PlanProjectRequestUrlConst.selectPlanList, body);
  }

  /**
   * 查询所有的规划点
   * param body
   */
  public getPlanPolymerizationPoint(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(PlanProjectRequestUrlConst.getPlanPolymerizationPoint, body);
  }

  /**
   * 根据区域id查询规划下设施
   * param body
   */
  public getPlanNonPolymerizationPoint(body): Observable<Object> {
    return this.$http.post<ResultModel<any>>(PlanProjectRequestUrlConst.getPlanNonPolymerizationPoint, body);
  }


  /**
   * 查询中心点
   * param body
   */
  public getPlanPolymerizationPointCenter(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(PlanProjectRequestUrlConst.getPlanPolymerizationPointCenter, body);
  }

  /**
   * 根据规划id查询该规划中没有分配项目的智慧杆点位
   * @param body 规划id
   */
  public selectPointByPlanIdAndNoProject(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(PlanProjectRequestUrlConst.selectPointByPlanIdAndNoProject, body);
  }

}
