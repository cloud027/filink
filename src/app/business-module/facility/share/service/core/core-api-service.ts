import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CodeServiceUrlConst} from '../../const/code-service-url.const';
import {ResultModel} from '../../../../../shared-module/model/result.model';

/**
 * 纤芯成端服务service
 */
@Injectable()
export class CoreApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 获取纤芯成端初始化信息
   */
  public getTheCoreEndInitialization(body): Observable<Object> {
    return this.$http.post(CodeServiceUrlConst.getPortCableCoreInfo, body);
  }

  /**
   * 获取光缆段信息
   */
  public getCableSegmentInformation(id): Observable<Object> {
    return this.$http.get(`${CodeServiceUrlConst.selectOpticCableSectionByDeviceId}/${id}`);
  }

  /**
   * 获取箱的AB面信息
   */
  public getTheABsurfaceInformationOfTheBox(id): Observable<Object> {
    return this.$http.get(`${CodeServiceUrlConst.queryFormationByDeviceId}/${id}`);
  }

  /**
   * 查询设施框信息
   */
  public queryFacilityBoxInformation(id): Observable<Object> {
    return this.$http.get(`${CodeServiceUrlConst.queryFormationByFrameId}/${id}`);
  }

  /**
   * 保存纤芯成端信息
   */
  public saveCoreInformation(body): Observable<Object> {
    return this.$http.post(`${CodeServiceUrlConst.savePortCableCoreInfo}`, body);
  }

  /**
   * 获取其他设施成端信息
   */
  public getPortCableCoreInfoNotInDevice(body): Observable<Object> {
    return this.$http.post(`${CodeServiceUrlConst.getPortCableCoreInfoNotInDevice}`, body);
  }

  /**
   * 获取其他设施熔纤信息
   */
  public queryCoreCoreInfoNotInDevice(body): Observable<Object> {
    return this.$http.post(`${CodeServiceUrlConst.queryCoreCoreInfoNotInDevice}`, body);
  }

  /**
   * 获取本设施熔纤信息
   */
  public getTheFuseInformation(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${CodeServiceUrlConst.queryCoreCoreInfo}`, body);
  }

  /**
   * 保存熔纤信息
   */
  public saveTheCoreInformation(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(CodeServiceUrlConst.savePortCableCoreInfo, body);
  }
}
