import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicConfig} from '../../share/service/basic-config';
import {NzI18nService, UploadFile} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {ColumnConfigService} from '../../share/service/column-config.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {SystemParameterService} from '../../share/service';
import {SystemParameterConfigEnum} from '../../share/enum/system-setting.enum';
import {HttpTitleEnum} from '../../share/enum/system-setting.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {SystemParamModel} from '../../share/mode/system-param.model';
import {CertificateModel} from '../../share/mode/certificate.model';
import {ProtocolModel} from '../../share/mode/protocol.model';

/**
 * 服务配置
 */
@Component({
  selector: 'app-config-agreement',
  templateUrl: './config-agreement.component.html',
  styleUrls: ['./config-agreement.component.scss']
})
export class ConfigAgreementComponent extends BasicConfig implements OnInit {
  // 当前模板配置
  @ViewChild('certificateTmp') private certificateTemplate;
  // 标题
  public pageTitle: string = '';
  // 配置类型
  public configType: string = '';
  // 协议值
  public protocolValue: ProtocolModel;
  // 默认协议值
  public protocolDefaultValue: ProtocolModel;
  // 证书信息
  public certificate: CertificateModel;
  // 权限码
  public code: string = '';
  // 协议码
  public protocolId: string = '';
  // 上传的文件
  public file: UploadFile;
  // 上传文件名称
  public fileName: string = '';

  constructor(public $nzI18n: NzI18nService,
              private $columnConfigService: ColumnConfigService,
              private $agreementManageService: SystemParameterService,
              private $message: FiLinkModalService,
              private $activatedRoute: ActivatedRoute) {
    super($nzI18n);
  }

  public ngOnInit(): void {
    this.$activatedRoute.params.subscribe(params => {
      if (this.formStatus) {
        this.formStatus.resetData({});
      }
      this.dealTitle(params['configType']);
    });
  }


  /**
   * 查询表单配置
   */
  public searchFromData(): void {
    this.$agreementManageService.queryProtocol(this.configType).subscribe((result: ResultModel<SystemParamModel>) => {
      if (result.code === 0) {
        this.protocolId = result.data.paramId;
        this.protocolValue = JSON.parse(result.data.presentValue);
        this.protocolDefaultValue = JSON.parse(result.data.defaultValue);
        this.certificate = this.protocolValue.certificateFile;
        if (this.certificate) {
          this.fileName = this.certificate.fileName;
        }
        this.formStatus.resetData(this.protocolValue);
      }
    });
  }

  /**
   * 确认
   */
  public formHandleOk(): void {
    this.submitLoading = true;
    const data = new FormData();
    const formData = this.formStatus.group.getRawValue();
    data.append('paramId', this.protocolId);
    data.append('paramType', this.configType);
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (this.configType === SystemParameterConfigEnum.httpsServe) {
      data.append('fileName', this.certificate.fileName);
      data.append('fileUrl', this.certificate.fileUrl);
      data.append('file', this.file[0]);
    }
    this.$agreementManageService.updateProtocol(data).subscribe((result: ResultModel<string>) => {
      this.submitLoading = false;
      if (result.code === 0) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 恢复默认设置
   */
  public formHandleReset(): void {
    this.certificate = this.protocolDefaultValue.certificateFile;
    if (this.certificate) {
      this.fileName = this.certificate.fileName;
    }
    this.file = null;
    this.formStatus.resetData(this.protocolDefaultValue);
  }

  /**
   * 取消
   */
  public formHandleCancel(): void {
    this.formStatus.resetData(this.protocolValue);
  }

  /**
   * 文件变化
   */
  public fileChange(): void {
    // 文件名效验
    const fileNode = document.getElementById('file');
    this.file = fileNode['files'];
    this.fileName = this.file[0].name;
    this.$message.info(this.language.agreement.uploadSuccess);
  }

  /**
   * 文件上传
   */
  public upload(): void {
    const fileNode = document.getElementById('file');
    fileNode.click();
  }

  /**
   * 监听表单数据变化
   * param controls
   * param $event
   * param key
   */
  modelChange = (controls, $event, key) => {
    if (key === 'enabled') {
      if ($event === '1') {
        this.formStatus.group.controls['maxActive'].setValue(this.protocolDefaultValue.maxActive);
        this.formStatus.group.controls['maxActive'].enable();
      } else {
        this.formStatus.group.controls['maxActive'].disable();
      }
    }
  }

  /**
   * 处理不同参数设置的title以及表单配置
   * param type
   */
  private dealTitle(type: HttpTitleEnum): void {
    switch (type) {
      case HttpTitleEnum.httpServe:
        this.configType = SystemParameterConfigEnum.httpServe;
        this.code = '04-3-2-1';
        this.pageTitle = this.language.systemSetting.httpServiceConfig;
        this.formColumn = this.$columnConfigService.getHttpServeFormConfig({modelChange: this.modelChange});
        break;
      case HttpTitleEnum.httpClient:
        this.configType = HttpTitleEnum.httpClient;
        this.pageTitle = this.language.systemSetting.httpClientConfig;
        this.formColumn = this.$columnConfigService.getHttpClientFormConfig({});
        break;
      case HttpTitleEnum.httpsServe:
        this.configType = SystemParameterConfigEnum.httpsServe;
        this.code = '04-3-3-1';
        this.pageTitle = this.language.systemSetting.httpsServiceConfig;
        // 初始化表单
        const initData = {
          certificate: this.certificateTemplate,
          modelChange: this.modelChange
        };
        this.formColumn = this.$columnConfigService.getHttpsServeFormConfig(initData);
        break;
      case HttpTitleEnum.httpsClient:
        this.configType = HttpTitleEnum.httpsClient;
        this.pageTitle = this.language.systemSetting.httpsClientConfig;
        this.formColumn = this.$columnConfigService.getHttpsClientFormConfig({});
        break;
      case HttpTitleEnum.webserviceServe:
        this.configType = SystemParameterConfigEnum.webserviceServe;
        this.code = '04-3-4-1';
        this.pageTitle = this.language.systemSetting.webServiceServiceConfig;
        this.formColumn = this.$columnConfigService.getWebserviceServeFormConfig();
        break;
      case HttpTitleEnum.webserviceClient:
        this.configType = HttpTitleEnum.webserviceClient;
        this.pageTitle = this.language.systemSetting.webServiceClientConfig;
        this.formColumn = this.$columnConfigService.getWebserviceClientFormConfig({});
        break;
    }
    this.searchFromData();
  }


}
