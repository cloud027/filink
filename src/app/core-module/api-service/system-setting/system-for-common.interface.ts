import {Observable} from 'rxjs';
import {ResultModel} from '../../../shared-module/model/result.model';

export interface SystemForCommonInterface {

  /**
   * 查询操作日志
   */
  findOperateLog(body): Observable<Object>;

  /**
   * 查询密码安全策略
   */
  queryPasswordSecurity();

  /**
   * 获取系统语言
   */
  queryLanguage();

  /**
   * 查询系统平台显示设置
   */
  selectDisplaySettingsParamForPageCollection();

  /**
   * 查询显示设置
   */
  selectDisplaySettingsParamByTenant();

  /**
   * 保存列设置
   */
  saveColumnSetting(body): Observable<Object>;

  /**
   * 查询列设置
   */
  queryColumnSetting(): Observable<Object>;

  /**
   *查询账号安全策略
   */
  queryAccountSecurity();
  /**
   * 获取所有的城市信息
   * returns {Observable<Object>}
   */
  getAllCityInfo(): Observable<Object>;

  /**
   * 上传License
   * param body
   */
  uploadLicense(body: FormData): Observable<ResultModel<string>>
}
