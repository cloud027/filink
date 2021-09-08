import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AreaServiceUrlConst} from '../../const/area-service-url.const';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {AreaModel} from '../../../../../core-module/model/facility/area.model';

/**
 * 区域接口service
 */
@Injectable()
export class AreaApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 删除区域
   */
  public deleteAreaByIds(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(AreaServiceUrlConst.deleteAreaByIds, body);
  }

  /**
   * 导出区域
   */
  public  exportAreaList(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(AreaServiceUrlConst.exportAreaData, body);
  }

  /**
   * 新增区域
   */
  public addArea(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(AreaServiceUrlConst.addArea, body);
  }

  /**
   * 修改区域
   */
  public updateAreaById(body): Observable<ResultModel<string>> {
    return this.$http.put<ResultModel<string>>(AreaServiceUrlConst.updateAreaById, body);
  }

  /**
   * 根据区域id查询区域详情
   */
  public queryAreaById(id: string): Observable<ResultModel<AreaModel>> {
    return this.$http.get<ResultModel<AreaModel>>(`${AreaServiceUrlConst.queryAreaById}/${id}`);
  }

  /**
   * 查询区域名称是否存在
   */
  public  queryAreaNameIsExist(body: {areaId: string, areaName: string}): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<any>>(AreaServiceUrlConst.queryAreaNameIsExist, body);
  }
}
