/**
 * @author xiaoconghu
 * @createTime 2018/9/20
 */
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';
import {Observable, of, throwError} from 'rxjs';

import {Base64} from '../../shared-module/util/base64';
import {FiLinkModalService} from '../../shared-module/service/filink-modal/filink-modal.service';
import {SessionUtil} from '../../shared-module/util/session-util';
import {NzI18nService} from 'ng-zorro-antd';
import {NativeWebsocketImplService} from '../websocket/native-websocket-impl.service';
import {CommonUtil} from '../../shared-module/util/common-util';
import {QUERY_ALARM_STATISTICS} from '../api-service/alarm/alarm-request-url';
import {BasicAuthConfig} from '../const/common.const';
import { systemSettingRequireUrl } from '../api-service/system-setting/http-url-config';
// 拦截白名单
const whiteList = ['filink-fipole-business-server/program/insertProgram'];

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  // 防止多次弹框
  timer = null;
  // 是否弹框
  flag: boolean = true;
  language: any;

  constructor(private $router: Router,
              private $nzI18n: NzI18nService,
              private websocketService: NativeWebsocketImplService,
              private $message: FiLinkModalService) {
    this.language = this.$nzI18n.getLocale();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    let req = null;
    if (SessionUtil.getToken()) {
      // 每次请求重置token时间 如是查询告警次数怎不重新设置
      if (!request.url.startsWith(QUERY_ALARM_STATISTICS) ) {
        SessionUtil.setToken(SessionUtil.getToken(), SessionUtil.getUserInfo().expireTime);
      }
      req = request.clone({
        setHeaders: {
          Authorization: SessionUtil.getToken(),
          userId: SessionUtil.getUserId(),
          roleId: SessionUtil.getRoleId(),
          tenantId: SessionUtil.getTenantId(),
          roleName: SessionUtil.getRoleName() ? Base64.encode(SessionUtil.getRoleName()) : '',
          userName: SessionUtil.getUserInfo().userName ? Base64.encode(SessionUtil.getUserInfo().userName) : '',
          zone: CommonUtil.getTimeone(),
          language: SessionUtil.getLanguage()
        }
      });
    } else {
      const setHeaders = {
        loginSource: '1',
        language: SessionUtil.getLanguage(),
        Authorization:
          `Basic ${this.createBasicAuth(BasicAuthConfig.username, BasicAuthConfig.password)}`
      };
      // 上传license和license验证需要加上租户id
      if (request.url.startsWith(systemSettingRequireUrl.uploadLicenseForAdmin)) {
        setHeaders['tenantId'] = SessionUtil.getTenantId();
        setHeaders['userName'] = SessionUtil.getUserInfo().userName ? Base64.encode(SessionUtil.getUserInfo().userName) : '';
      }
      req = request.clone({setHeaders});
    }
    if (whiteList.includes(req.url)) {
      return next.handle(req);
    }
    return next.handle(req).pipe(
      // retry(1), 暂时关闭错误重试
      // timeout(10000), 由于173 带宽问题文件视频上传慢 先去除超时间设置
      catchError((err: HttpErrorResponse) => this.handleData(err))
    );
  }

  /**
   * 生成basicAuth
   * param name
   * param pass
   */
  createBasicAuth(name, pass) {
    return btoa(encodeURIComponent(`${name}:${pass}`).replace(/%([0-9A-F]{2})/g,
      function (match, p1) {
        return String.fromCharCode(Number('0x' + p1));
      }));
  }

  private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
    // 业务处理：一些通用操作
    let errorStr = '';
    if (event.status === 200) {
      return of(event);
    }
    switch (event.status) {
      case 401:
        // 如果已经跳转到登录页面再返回的401，说明是在退出后内存中还有padding的后台请求返回了401 不做处理
        if (this.$router.url !== '/login') {
          errorStr = this.language.httpMsg.noLogin;
          localStorage.clear();
          this.websocketService.close();
          this.$router.navigate(['/login']).then();
        }
        break;
      case 404:
        errorStr = this.language.httpMsg.notFound;
        break;
      case 502:
        errorStr = event['error'].msg;
        break;
      default:
        errorStr = this.language.httpMsg.serverError;
    }
    if (this.flag && errorStr) {
      this.$message.error(errorStr, () => {
        this.flag = true;
      });
      this.flag = false;
    }
    return throwError(event['error']);
  }
}

