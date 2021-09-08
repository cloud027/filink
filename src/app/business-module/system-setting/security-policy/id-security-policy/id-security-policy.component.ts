import {Component, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {ColumnConfigService} from '../../share/service/column-config.service';
import {BasicConfig} from '../../share/service/basic-config';
import {SystemParameterService} from '../../share/service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {AccessPolicyTypeEnum, SystemParameterConfigEnum} from '../../share/enum/system-setting.enum';
import {UpdatePasswordService} from '../../../../core-module/mission/update-password-service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {Observable} from 'rxjs';
import {SystemParamModel} from '../../share/mode/system-param.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';

/**
 * 账号安全策略
 */
@Component({
  selector: 'app-id-security-policy',
  templateUrl: './id-security-policy.component.html',
  styleUrls: ['./id-security-policy.component.scss']
})
export class IdSecurityPolicyComponent extends BasicConfig implements OnInit {
  // 标题
  public pageTitle = this.language.systemSetting.accountSecurityStrategy;
  // 缓存默认配置
  public securityPolicyConfig = {
    lockedTime: ''
  };
  // 当前配置
  public securityPolicyCurConfig = {};
  // 账号安全策略类型
  public accessPolicyType: string = '';
  // 策略id
  public paramId: string = '';
  // 权限码
  public code: string = '';

  constructor(public $nzI18n: NzI18nService,
              private $activatedRoute: ActivatedRoute,
              private $columnConfigService: ColumnConfigService,
              private $securityPolicyService: SystemParameterService,
              private $message: FiLinkModalService,
              private $updatePasswordService: UpdatePasswordService
  ) {
    super($nzI18n);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 判断页面
    this.$activatedRoute.url.subscribe((urlSegmentList: Array<UrlSegment>) => {
      // 清除默认配置
      this.securityPolicyConfig = {lockedTime: ''};
      if (urlSegmentList.find(urlSegment => urlSegment.path === AccessPolicyTypeEnum.account)) {
        this.accessPolicyType = AccessPolicyTypeEnum.account;
        this.pageTitle = this.language.systemSetting.accountSecurityStrategy;
        this.code = '04-4-2-1';
      } else {
        this.pageTitle = this.language.systemSetting.passwordSecurityPolicy;
        this.accessPolicyType = AccessPolicyTypeEnum.password;
        this.code = '04-4-3-1';
      }
      this.searchFromData();
    });
  }

  /**
   * 初始化表单数据
   */
  public searchFromData(): void {
    let response: Observable<ResultModel<SystemParamModel>>;
    if (this.accessPolicyType === AccessPolicyTypeEnum.password) {
      this.formColumn = this.$columnConfigService.getPasswordAccessControlFormConfig({});
      response = this.$securityPolicyService.queryPasswordPresent(SystemParameterConfigEnum.passwordPresent);
    } else {
      this.formColumn = this.$columnConfigService.getIDAccessControlFormConfig({modelChange: this.modelChange});
      response = this.$securityPolicyService.queryAccountPresent(SystemParameterConfigEnum.accountPresent);
    }
    response.subscribe((result: ResultModel<SystemParamModel>) => {
      if (result.code === ResultCodeEnum.success) {
        this.securityPolicyCurConfig = JSON.parse(result.data.presentValue);
        this.securityPolicyConfig = JSON.parse(result.data.defaultValue);
        this.paramId = result.data.paramId;
        this.formStatus.resetData(this.securityPolicyCurConfig);
      }
    });
  }

  /**
   * 确定
   */
  public formHandleOk(): void {
    this.submitLoading = true;
    let data = {};
    let response: Observable<ResultModel<string>>;
    if (this.accessPolicyType === AccessPolicyTypeEnum.password) {
      data = {
        passwordSecurityStrategy: this.formStatus.getData(),
        paramId: this.paramId
      };
      response = this.$securityPolicyService.updatePasswordStrategy(data);
    } else {
      data = {
        accountSecurityStrategy: this.formStatus.group.getRawValue(),
        paramId: this.paramId
      };
      response = this.$securityPolicyService.updateAccountStrategy(data);
    }
    response.subscribe((result: ResultModel<string>) => {
      this.submitLoading = false;
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.$updatePasswordService.sendMessage(1);
        // 更新当前值为点击确定按钮保存成功之后的值
        this.securityPolicyCurConfig = this.accessPolicyType === AccessPolicyTypeEnum.password ? data['passwordSecurityStrategy'] : data['accountSecurityStrategy'];
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.submitLoading = false;
    });
  }

  /**
   * 取消
   */
  public formHandleCancel(): void {
    // 取消则恢复当前配置
    this.searchFromData();
  }

  /**
   * 恢复默认
   */
  public formHandleReset(): void {
    this.formStatus.resetData(this.securityPolicyConfig);
  }

  /**
   * 监听表单数据变化
   * param controls
   * param $event
   * param key
   */
  public modelChange = (controls, $event: string, key: string) => {
    let item = '';
    const radioItem = 'longTimeNoLoginAction';
    // 账号锁定策略启禁用控制锁定时间
    if (key === 'lockStrategy') {
      item = 'lockedTime';
    }
    // 账号长期未登录策略启禁用控制未登录时间、动作
    if (key === 'longTimeNoLoginStrategy') {
      item = 'longTimeNoLoginTime';
      this.formStatus.resetControlData(radioItem, this.formStatus.group.controls[radioItem].value);
    }
    // 判断单选钮、输入框的启禁用状态
    if ($event === '1') {
      this.formStatus.group.controls[item].enable();
      this.formStatus.group.controls[radioItem].enable();
    } else {
      if (!this.formStatus.group.controls[item].valid) {
        // 当输入不符合规范时，将该输入框的值置为初始值，若初始值为空，则取默认值
        this.formStatus.group.controls[item].reset(this.securityPolicyCurConfig[item] || this.securityPolicyConfig[item]);
      }
      this.formStatus.group.controls[item].disable();
      this.formStatus.group.controls[radioItem].disable();
    }
  }
}
