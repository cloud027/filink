import {ResultModel} from '../../../../shared-module/model/result.model';
import {LoginInfoModel} from '../../../../core-module/model/login/login-info.model';
import {Observable} from 'rxjs';

export interface LoginInterface {
  /**
   * 登入接口
   * param params
   */
  login(params: FormData): Observable<ResultModel<ResultModel<LoginInfoModel>>>;

  /**
   * License验证
   */
  validateLicense(): Observable<ResultModel<{ licenseStatus: boolean }>>;

  /**
   * 提交License
   * param params
   */
  uploadLicense(body: FormData): Observable<ResultModel<string>>;

  /**
   * 获取验证码
   */
  getVerificationCode(body: { phoneNumber: string }): Observable<ResultModel<string>>;

  /**
   * 手机登录
   */
  phoneLogin(body: FormData): Observable<ResultModel<ResultModel<LoginInfoModel>>>;

  /**
   * 获取备案号
   */
  querySiteRecordNumber(): Observable<ResultModel<string>>;
}
