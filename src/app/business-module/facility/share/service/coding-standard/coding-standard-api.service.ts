import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {CodingStandardServiceUrlConst} from '../../const/coding-standard-service-url.const';
/**
 * 编码标准接口service
 */
@Injectable()
export class CodingStandardApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询编码标准列表
   */
  public codingRuleListByPage(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(CodingStandardServiceUrlConst.codingRuleListByPage, body);
  }

  /**
   * 查询可选字段
   */
  public queryCodingRuleField(): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${CodingStandardServiceUrlConst.queryCodingRuleField}`);
  }

  /**
   * 启用编码标准
   */
  public enableCodingRule(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(CodingStandardServiceUrlConst.enableCodingRule, body);
  }

  /**
   * 禁用编码标准
   */
  public disableCodingRule(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(CodingStandardServiceUrlConst.disableCodingRule, body);
  }

  /**
   * 删除编码标准
   */
  public deleteCodingRule(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(CodingStandardServiceUrlConst.deleteCodingRule, body);
  }

  /**
   * 获取资产类型设施设备集
   */
  public queryDeviceTypeList(): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(`${CodingStandardServiceUrlConst.queryDeviceTypeList}`);
  }

  /**
   * 编辑编码标准
   */
  public addCodingRule(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(CodingStandardServiceUrlConst.addCodingRule, body);
  }

  /**
   * 编辑编码标准
   */
  public updateCodingRule(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(CodingStandardServiceUrlConst.updateCodingRule, body);
  }

  /**
   * 查询编码标准明细
   */
  public queryCodingRuleInfo(codingRuleId): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(CodingStandardServiceUrlConst.queryCodingRuleInfo, codingRuleId);
  }

  /**
   * 编码标准名称重复性校验
   */
  public queryCodingRuleNameIsExist(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(CodingStandardServiceUrlConst.queryCodingRuleNameIsExist, body);
  }
}
