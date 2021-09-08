import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationService} from '../../../share/service/application.service';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {FileUploadComponentModel} from '../../../../../shared-module/model/file-upload-component.model';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {PassagewayModel} from '../../../share/model/passageway.model';
import {AsyncRuleUtil} from '../../../../../shared-module/util/async-rule-util';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';

/**
 * 基础配置表单页面
 */
@Component({
  selector: 'app-basics-model',
  templateUrl: './basics-model.component.html',
  styleUrls: ['./basics-model.component.scss']
})
export class BasicsModelComponent implements OnInit, OnDestroy {
  /**
   * 证书的上传文件
   */
  @ViewChild('certUpload') certUpload;
  /**
   * 秘钥的上传文件
   */
  @ViewChild('keyUpload') keyUpload;
  /**
   * form证书表单配置
   */
  public certificateFormColumn: FormItem[] = [];
  /**
   * form平台表单配置
   */
  public platformFormColumn: FormItem[] = [];
  /**
   * 判断证书表单状态
   */
  public certificateIsValid: boolean = false;
  /**
   * 判断平台表单状态
   */
  public platformIsValid: boolean = false;
  /**
   * 证书表单状态
   */
  private certificateFormStatus: FormOperate;
  /**
   * 平台表单状态
   */
  private platformFormStatus: FormOperate;
  /**
   * 文件数组
   */
  public certificateFileList = [];
  /**
   * 文件信息
   */
  public certificateFileInfo = new FileUploadComponentModel();
  /**
   * 文件是否已上传
   */
  public certificateUploadBtnDisabled = false;
  /**
   * 国际化
   */
  public language: ApplicationInterface;
  /**
   * 列表初始加载图标
   */
  public isLoading = false;
  /**
   * 设备ID
   */
  private equipmentId: string;

  /**
   * @param $applicationService 后台接口服务
   * @param $message 提示信息服务
   * @param $activatedRoute 路由传参服务
   * @param $nzI18n  国际化服务
   * @param $asyncRuleUtil  公共规则模块
   */
  constructor(
    private $applicationService: ApplicationService,
    private $message: FiLinkModalService,
    private $activatedRoute: ActivatedRoute,
    private $nzI18n: NzI18nService,
    private $asyncRuleUtil: AsyncRuleUtil
  ) {
  }

  ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.initColumn();
    this.$activatedRoute.queryParams.subscribe(params => {
      if (params.equipmentId) {
        this.equipmentId = params.equipmentId;
        this.onInitialization();
      }
    });
  }

  /**
   * 编辑初始化接口
   */
  private onInitialization(): void {
    this.$applicationService.getSecurityConfiguration(this.equipmentId)
      // todo 基础配置模型
      .subscribe((result: ResultModel<PassagewayModel>) => {
        if (result.code === ResultCodeEnum.success) {
          this.certificateFormStatus.resetData(result.data);
          this.platformFormStatus.resetData(result.data);
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 页面销毁
   */
  ngOnDestroy(): void {
    this.certUpload = null;
    this.keyUpload = null;
  }

  /**
   * 证书
   * @param event 表单事件
   */
  public certificateFormInstance(event): void {
    this.certificateFormStatus = event.instance;
    // 校验表单
    this.certificateFormStatus.group.statusChanges.subscribe(() => {
      this.certificateIsValid = this.certificateFormStatus.getValid();
    });
  }

  /**
   * 平台
   * @param event 表单事件
   */
  public platformFormInstance(event): void {
    this.platformFormStatus = event.instance;
    // 校验表单
    this.platformFormStatus.group.statusChanges.subscribe(() => {
      this.platformIsValid = this.platformFormStatus.getValid();
    });
  }

  /**
   * 表单配置
   */
  private initColumn(): void {
    this.certificateFormColumn = [
      // 是否启用
      {
        label: this.language.securityWorkbench.sslStatus,
        key: 'sslStatus',
        require: true,
        col: 10,
        rule: [{required: true}],
        type: 'radio',
        radioInfo: {
          data: [{
            label: this.language.frequentlyUsed.yes,
            value: '1'
          },
            {
              label: this.language.frequentlyUsed.no,
              value: '0'
            }],
          label: 'label',
          value: 'value'
        }
      },
      // SSL证书上传
      {
        label: this.language.securityWorkbench.sslCertFile,
        key: 'sslCert',
        type: 'custom',
        col: 10,
        rule: [],
        asyncRules: [],
        template: this.certUpload
      },
      // HTTPS端口号
      {
        label: this.language.securityWorkbench.httpsPort,
        key: 'httpsPort',
        type: 'input',
        disabled: false,
        col: 10,
        rule: [],
        asyncRules: [],
      },
      // SSL秘钥上传
      {
        label: this.language.securityWorkbench.sslKeyFile,
        key: 'sslKey',
        type: 'custom',
        col: 10,
        rule: [],
        asyncRules: [],
        template: this.keyUpload
      }];
    this.platformFormColumn = [
      // 接入平台
      {
        label: this.language.securityWorkbench.platform,
        key: 'platform',
        type: 'input',
        col: 10,
        require: true,
        disabled: false,
        rule: [{required: true}]
      },
      // 设备序列号
      {
        label: this.language.securityWorkbench.deviceSerial,
        key: 'deviceSerial',
        type: 'input',
        col: 10,
        disabled: false,
        rule: []
      },
      // IP地址
      {
        label: this.language.securityWorkbench.platformIp,
        key: 'platformIp',
        type: 'input',
        col: 10,
        require: true,
        disabled: false,
        rule: [{required: true}],
        asyncRules: [this.$asyncRuleUtil.IPV4Reg()]
      },
      // 设备名称
      {
        label: this.language.securityWorkbench.deviceName,
        key: 'deviceName',
        type: 'input',
        col: 10,
        disabled: false,
        rule: []
      },
      // 监听端口
      {
        label: this.language.securityWorkbench.listenPort,
        key: 'listenPort',
        type: 'input',
        col: 10,
        require: true,
        disabled: false,
        rule: [{required: true}, {max: 65535}, {min: 0}],
        asyncRules: [this.$asyncRuleUtil.mustInt()]
      },
      // 接入密码
      {
        label: this.language.securityWorkbench.password,
        disabled: false,
        key: 'password',
        type: 'input',
        col: 10,
        rule: []
      },
    ];
  }

  /**
   * 文件上传
   * @param type 上传的类型  certificate：证书 secretKey：秘钥
   * @param files 文件
   */
  public uploadFile(files, type: string): void {
    const parameter = new FormData();
    parameter.append('file', files[0]);
    this.$applicationService.uploadSslFile(parameter)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          if (type === 'certificate') {
            this.certificateFormStatus.group.controls['sslCertFile'].reset(result.data);
          } else {
            this.certificateFormStatus.group.controls['sslKeyFile'].reset(result.data);
          }
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 删除上传的文件
   * @param file 文件
   * @param type 上传的类型  certificate：证书 secretKey：秘钥
   */
  public removeFileChange(file, type: string): void {
    this.certificateUploadBtnDisabled = true;
    const parameter = type === 'certificate' ? {
      sslCertFile: this.certificateFormStatus.group.getRawValue().sslCert
    } : {
      sslKeyFile: this.platformFormStatus.group.getRawValue().sslKey
    };
    this.$applicationService.deleteSslFile(parameter)
      .subscribe(() => {
        this.$message.success(this.language.frequentlyUsed.deleteSucceeded);
        // 文件删除后需要表单的格式等置空
        if (type === 'certificate') {
          this.certificateFormStatus.group.controls['sslCert'].reset('');
        } else {
          this.certificateFormStatus.group.controls['sslKey'].reset('');
        }
        this.certificateFileList = this.certificateFileList.filter(item => item.uid !== file.uid);
        this.certificateUploadBtnDisabled = false;
      });
  }

  /**
   * 提交方法
   */
  public onConfirm(): void {
    this.isLoading = true;
    // 组件表单值 （将两个表单的值合并）
    const formData = Object.assign(
      this.certificateFormStatus.group.getRawValue(),
      this.platformFormStatus.group.getRawValue());
    formData.equipmentId = this.equipmentId;
    this.$applicationService.saveSecurityConfiguration(formData)
      .subscribe((result: ResultModel<any>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.language.frequentlyUsed.configurationAdded);
          window.history.go(-1);
        } else {
          this.$message.error(result.msg);
        }
      }, () => this.isLoading = false);
  }

  /**
   * 取消
   */
  public onCancel(): void {
    window.history.go(-1);
  }
}
