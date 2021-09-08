import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {PartsServiceUrlConst} from '../../const/parts-service-url.const';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {PartsInfoListModel} from '../../model/parts-info-list.model';
import {UserListModel} from '../../../../../core-module/model/user/user-list.model';
import {ExportPartsModel} from '../../model/export-parts.model';

/**
 * 配件管理接口service
 */
@Injectable()
export class PartsMgtApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询配件列表
   */
  public partsListByPage(body: QueryConditionModel): Observable<ResultModel<PartsInfoListModel[]>> {
    return this.$http.post<ResultModel<PartsInfoListModel[]>>(PartsServiceUrlConst.partListByPage, body);
  }

  /**
   * 新增配件
   */
  public addParts(body: PartsInfoListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PartsServiceUrlConst.addPart, body);
  }

  /**
   * 删除配件
   */
  public deletePartsDyIds(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PartsServiceUrlConst.deletePartByIds, body);
  }

  /**
   * 根据单位查询所属人
   */
  public queryByDept(body: {firstArrayParameter: string[]}): Observable<ResultModel<UserListModel[]>> {
    return this.$http.post<ResultModel<UserListModel[]>>(PartsServiceUrlConst.queryUserByDept, body);
  }

  /**
   * 校验配件名称是否存在
   */
  public partNameIsExist(body: {partId: string, partName: string}): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(PartsServiceUrlConst.queryPartNameIsExisted, body);
  }

  /**
   * 根据id查询配件
   */
  public queryPartsById(body: string): Observable<ResultModel<PartsInfoListModel>> {
    return this.$http.get<ResultModel<PartsInfoListModel>>(`${PartsServiceUrlConst.findPartById}/${body}`);
  }

  /**
   * 修改配件
   */
  public updatePartsById(body: PartsInfoListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PartsServiceUrlConst.updatePartById, body);
  }

  /**
   * 导出配件数据
   */
  public partsExport(body: ExportPartsModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(PartsServiceUrlConst.exportPartList, body);
  }
}
