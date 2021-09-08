import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginInterface} from './login.interface';
import {LoginRequireUrl} from '../const/http-url-config';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {LoginInfoModel} from '../../../../core-module/model/login/login-info.model';

@Injectable()
export class LoginService implements LoginInterface {

  constructor(private $http: HttpClient) {
  }

  login(params: FormData): Observable<ResultModel<ResultModel<LoginInfoModel>>> {
    return this.$http.post<ResultModel<ResultModel<LoginInfoModel>>>(LoginRequireUrl.login, params);
  }

  validateLicense(): Observable<ResultModel<{ licenseStatus: boolean }>> {
    return this.$http.get<ResultModel<{ licenseStatus: boolean }>>(LoginRequireUrl.validateLicenseTime);
  }

  uploadLicense(body: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(LoginRequireUrl.uploadLicense, body);
  }

  getVerificationCode(body: { phoneNumber: string }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LoginRequireUrl.getVerificationCode}`, body);
  }

  phoneLogin(body: FormData): Observable<ResultModel<ResultModel<LoginInfoModel>>> {
    return this.$http.post<ResultModel<ResultModel<LoginInfoModel>>>(`${LoginRequireUrl.phoneLogin}`, body);
  }

  /**
   * 获取备案号
   */
  querySiteRecordNumber(): Observable<ResultModel<string>> {
    return this.$http.get<ResultModel<string>>(LoginRequireUrl.querySiteRecordNumber);
  }
}
