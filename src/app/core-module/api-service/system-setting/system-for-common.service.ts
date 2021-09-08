import {Injectable} from '@angular/core';
import {SystemForCommonInterface} from './system-for-common.interface';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {systemSettingRequireUrl} from './http-url-config';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../shared-module/model/result.model';
import {OperateLogModel} from '../../model/system-setting/operate-log.model';
import {LanguageModel} from '../../model/alarm/language.model';
import {PasswordCheckModel} from '../../model/alarm/password-check.model';
import {LoginInfoModel} from '../../model/login/login-info.model';

@Injectable()
export class SystemForCommonService implements SystemForCommonInterface {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询操作日志
   */
  public findOperateLog(body: QueryConditionModel): Observable<ResultModel<OperateLogModel[]>> {
    return this.$http.post<ResultModel<OperateLogModel[]>>(systemSettingRequireUrl.findOperateLog, body);
  }

  /**
   * 查询密码安全策略
   */
  queryPasswordSecurity(): Observable<ResultModel<PasswordCheckModel>> {
    return this.$http.get<ResultModel<PasswordCheckModel>>(`${systemSettingRequireUrl.queryPasswordSecurity}`);
  }

  /**
   * 获取语言
   */
  queryLanguage(): Observable<ResultModel<LanguageModel[]>> {
    return this.$http.get<ResultModel<LanguageModel[]>>(systemSettingRequireUrl.queryLanguageAll);
  }

  /**
   * 获取平台显示设置
   */
  selectDisplaySettingsParamForPageCollection() {
    return this.$http.get(systemSettingRequireUrl.selectDisplaySettingsParamBySys);
  }

  /**
   * 获取显示设置数据
   */
  selectDisplaySettingsParamByTenant(): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<string>>(systemSettingRequireUrl.selectDisplaySettingsParamByTenant);
  }

  saveColumnSetting(body): Observable<Object> {
    return this.$http.post(systemSettingRequireUrl.saveColumnSettings, body);
  }

  queryColumnSetting(): Observable<Object> {
    return this.$http.get(systemSettingRequireUrl.queryColumnSettings);
  }

  queryAccountSecurity(): Observable<Object> {
    return this.$http.get(`${systemSettingRequireUrl.queryAccountSecurity}`);
  }

  getAllCityInfo(): Observable<Object> {
    return this.$http.get(`${systemSettingRequireUrl.getAllCityInfo}`);
  }

  /**
   * 上传License
   * param body
   */
  uploadLicense(body: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(systemSettingRequireUrl.uploadLicense, body);
  }

  /**
   * 角色切换到管理员菜单
   */
  switchAccountToSuper(language: string): Observable<ResultModel<LoginInfoModel>> {
    return this.$http.get<ResultModel<LoginInfoModel>>(`${systemSettingRequireUrl.switchAccountToSuper}/${language}`);
  }


  /**
   * 角色切换到租户菜单
   */
  switchAccountToTenant(id: string, language: string): Observable<ResultModel<LoginInfoModel>> {
    return this.$http.get<ResultModel<LoginInfoModel>>(`${systemSettingRequireUrl.switchAccountToTenant}/${id}/${language}`);
  }

  /**
   * 菜单国际化切换
   */

  queryTenantMenuById(tenantId: string, language: string, roleId: string): Observable<Object> {
    return this.$http.get(`${systemSettingRequireUrl.queryTenantMenuById}/${tenantId}/${language}/${roleId}`);
  }


}
