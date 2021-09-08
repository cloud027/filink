import {ResultModel} from '../../../../shared-module/model/result.model';
import {PlanUrlConst} from '../const/plan-url.const';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {PlanInfoModel} from '../../../../core-module/model/plan/plan-info.model';
import {WisdomPointInfoModel} from '../../../../core-module/model/plan/wisdom-point-info.model';

/**
 * 规划服务类
 */
@Injectable()
export class PlanApiService {

  constructor(private $http: HttpClient) {
  }

  /**
   * 新增规划
   */
  public insertPlan(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanUrlConst.insertPlan, body);
  }

  /**
   * 查询规划列表
   */
  public selectPlanList(body): Observable<ResultModel<PlanInfoModel[]>> {
    return this.$http.post<ResultModel<PlanInfoModel[]>>(PlanUrlConst.selectPlanList, body);
  }

  /**
   * 规划详情
   */
  public selectPlanInfo(planId: string): Observable<ResultModel<PlanInfoModel>> {
    return this.$http.get<ResultModel<PlanInfoModel>>(`${PlanUrlConst.selectPlanInfo}/${planId}`);
  }

  /**
   * 编辑规划
   */
  public updatePlan(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanUrlConst.updatePlan, body);
  }

  /**
   * 查询规划下智慧杆
   */
  public selectPlanPointByPlanId(planId): Observable<ResultModel<string>> {
    return this.$http.get<ResultModel<string>>(`${PlanUrlConst.selectPlanPointByPlanId}?planId=${planId}`);
  }

  /**
   * 删除规划
   */
  public deletePlan(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanUrlConst.deletePlan, body);
  }

  /**
   * 规划列表导出
   */
  public exportPlanList(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanUrlConst.exportPlanList, body);
  }

  /**
   * 查询智慧杆型号
   */
  public selectAllPointModel(): Observable<ResultModel<string>> {
    return this.$http.get<ResultModel<string>>(PlanUrlConst.selectAllPointModel);
  }

  /**
   * 新增智慧杆(地图创建规划)
   */
  public insertPlanPoint(body): Observable<ResultModel<string[]>> {
    return this.$http.post<ResultModel<string[]>>(PlanUrlConst.insertPlanPoint, body);
  }

  /**
   * 查询智慧杆列表
   */
  public selectPlanPointList(body): Observable<ResultModel<WisdomPointInfoModel[]>> {
    return this.$http.post<ResultModel<WisdomPointInfoModel[]>>(PlanUrlConst.selectPlanPointList, body);
  }

  /**
   * 编辑智慧杆
   */
  public updatePlanPoint(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanUrlConst.updatePlanPoint, body);
  }

  /**
   * 根据智慧杆id查智慧杆
   */
  public queryPlanPointById(pointId): Observable<ResultModel<WisdomPointInfoModel>> {
    return this.$http.get<ResultModel<WisdomPointInfoModel>>(`${PlanUrlConst.queryPlanPointById}/${pointId}`);
  }

  /**
   * 删除智慧杆
   */
  public deletePlanPoint(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanUrlConst.deletePlanPoint, body);
  }

  /**
   * 智慧杆列表导出
   */
  public exportPlanPointList(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanUrlConst.exportPlanPointList, body);
  }

  /**
   * 智慧杆列表总数小卡片
   */
  public pointCountByStatus(): Observable<ResultModel<any[]>> {
    return this.$http.get<ResultModel<any[]>>(PlanUrlConst.pointCountByStatus);
  }

  /**
   * 检查规划名称重复
   */
  public checkPlanName(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanUrlConst.checkPlanName, body);
  }

  /**
   * 检查智慧杆名称重复
   */
  public checkPlanPointName(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PlanUrlConst.checkPlanPointName, body);
  }

  /**
   * 查询规划集合下智慧杆的中心点
   * param body
   */
  public selectPlanPointCenter(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(PlanUrlConst.selectPlanPointCenter, body);
  }

}
