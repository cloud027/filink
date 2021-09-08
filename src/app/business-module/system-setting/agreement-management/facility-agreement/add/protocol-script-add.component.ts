import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {ColumnConfigService} from '../../../share/service/column-config.service';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {AccessModeEnum} from '../../../share/enum/system-setting.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {SystemParameterService} from '../../../share/service';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {XML_LIMIT_NAME_CONST, XML_LIMIT_SIZE_CONST} from '../../../share/const/system.const';
import {BasicConfig} from '../../../share/service/basic-config';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {ProductInfoModel} from '../../../../../core-module/model/product/product-info.model';
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {DeviceProtocolListModel} from '../../../share/mode/device-protocol-list.model';
import {ProtocolTypeEnum} from '../../../share/enum/protocol-type.enum';
import {SystemInterface} from '../../../../../../assets/i18n/system-setting/system.interface';
import {ProductForCommonService} from '../../../../../core-module/api-service/product/product-for-common.service';
import {FileLimitModel} from '../../../share/mode/file-limit.model';
import {Observable} from 'rxjs';
import {CloudPlatformTypeEnum} from 'src/app/core-module/enum/product/product.enum';

/**
 * 接入协议管理 新增/编辑 页面
 */
@Component({
  selector: 'app-protocol-script-add',
  templateUrl: './protocol-script-add.component.html',
  styleUrls: ['./protocol-script-add.component.scss']
})
export class ProtocolScriptAddComponent extends BasicConfig implements OnInit {
  // 上传脚本文件
  @ViewChild('uploads') private uploadsTemplate: ElementRef;
  // 上传设备配置脚本文件
  @ViewChild('uploadFile') private uploadEquipmentFile: ElementRef;
  // 上传SSL证书
  @ViewChild('uploadCertificate') private uploadSslCertificate: ElementRef;
  // 设备型号选择器
  @ViewChild('productSelector') private productSelector: TemplateRef<HTMLDocument>;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 系统设置国际化
  public protocolLanguage: SystemInterface;
  // 页面标题
  public pageTitle: string = '';
  // 表单配置
  public formColumn: FormItem[] = [];
  // 确认按钮状态
  public isDisabled: boolean = false;
  // 表单状态
  public formStatus: FormOperate;
  // 页面加载
  public isLoading: boolean = false;
  // 文件名称
  public fileName: string;
  // 配置文件名称
  public configFileName: string;
  // ssl文件名称
  public sslFileName: string;
  // 产品列表选择器显示与隐藏
  public productSelectVisible: boolean = false;
  // 选择的产品id
  public selectProductId: string = '';
  // 设备类型
  public equipmentType: EquipmentTypeEnum;
  // 查询条件
  public queryConditions: QueryConditionModel = new QueryConditionModel();
  // 协议id
  private protocolId: string = '';
  // 页面类型
  private pageType: OperateTypeEnum = OperateTypeEnum.add;
  // xml文件校验
  private limit = {
    nameLength: XML_LIMIT_NAME_CONST,
    size: XML_LIMIT_SIZE_CONST,
    nameI18n: this.language.agreement.fileNameLengthLessThan32bits,
    sizeI18n: this.language.agreement.fileSizeLessThan1M
  };
  // 上传的文件
  private file: any;
  // 上传配置文件
  private configFile: any;
  // 上传ssl文件
  private sslFile: any;
  // 供应商id
  private supplierId: string;
  // 平台类型
  private platformType: CloudPlatformTypeEnum;
  // 产品的appId
  private productAppId: string = '';

  constructor(public $nzI18n: NzI18nService,
              private $columnConfigService: ColumnConfigService,
              private $active: ActivatedRoute,
              private $message: FiLinkModalService,
              private $systemSettingService: SystemParameterService,
              private $productForCommonService: ProductForCommonService,
              private $ruleUtil: RuleUtil,
              private $modalService: NzModalService,
              private $router: Router) {
    super($nzI18n);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.protocolLanguage = this.$nzI18n.getLocaleData(LanguageEnum.systemSetting);
    // 初始化表单配置
    this.initFormConfig();
    // 新增编辑页面初始化
    this.initPage();
    // 查询设施协议文件规格
    this.queryLimit();
  }

  /**
   * 判断确定按钮的禁用状态
   */
  public submitBtnDisableStatus(): boolean {
    return !(this.isDisabled && this.fileName && this.configFileName);
  }

  /**
   * 表单初始化
   */
  public initFormConfig(): void {
    this.formColumn = [
      {
        // 协议名称
        label: this.protocolLanguage.protocolName,
        key: 'protocolName',
        type: 'input',
        require: true,
        col: 24,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$systemSettingService.checkDeviceProtocolNameRepeat(
            {protocolId: this.protocolId, protocolName: value}),
            res => res.code === 0)
        ]
      },
      {
        // 接入方式
        label: this.protocolLanguage.accessMode,
        key: 'accessWay',
        type: 'select',
        col: 24,
        rule: [],
        selectInfo: {
          data: [
            {label: 'API', value: AccessModeEnum.api},
            {label: 'SDK', value: AccessModeEnum.sdk},
          ],
          value: 'value',
          label: 'label'
        },
        modelChange: (controls, $event) => {
          if ($event === AccessModeEnum.sdk) {
            this.formStatus.group.controls['sdkDescribe'].enable();
          } else {
            this.formStatus.resetControlData('sdkDescribe', '');
            this.formStatus.group.controls['sdkDescribe'].disable();
          }
        }
      },
      {
        // 设备型号
        label: this.protocolLanguage.equipmentModel,
        key: 'equipmentModel',
        type: 'custom',
        col: 24,
        template: this.productSelector,
        rule: []
      },
      {
        // 供应商
        label: this.protocolLanguage.supplier,
        key: 'supplierName',
        type: 'input',
        col: 24,
        placeholder: this.protocolLanguage.automaticAcquisition,
        disabled: true,
        rule: []
      },
      {
        // 设备类型
        label: this.protocolLanguage.equipmentType,
        key: 'equipmentType',
        type: 'input',
        col: 24,
        placeholder: this.protocolLanguage.automaticAcquisition,
        disabled: true,
        rule: []
      },
      {
        // 设备软件版本
        label: this.language.agreement.softwareVersion,
        key: 'softwareVersion',
        type: 'input',
        col: 24,
        placeholder: this.protocolLanguage.automaticAcquisition,
        disabled: true,
        rule: []
      },
      {
        // 设备硬件版本
        label: this.language.agreement.hardwareVersion,
        key: 'hardwareVersion',
        type: 'input',
        col: 24,
        placeholder: this.protocolLanguage.automaticAcquisition,
        disabled: true,
        rule: []
      },
      {
        // 设备序号
        label: this.protocolLanguage.equipmentSerialNumber,
        key: 'equipmentSerialNum',
        type: 'input',
        col: 24,
        rule: []
      },
      {
        // 第三方服务地址
        label: this.protocolLanguage.thirdServiceAddress,
        key: 'thirdPartyServiceAddr',
        type: 'input',
        col: 24,
        rule: [{
          pattern: '^(?=^.{3,255}$)(http(s)?:\\/\\/)?(www\\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\\d+)*(\\/\\w+\\.\\w+)*$',
          msg: this.protocolLanguage.domainAndIpError
        }]
      },
      {
        // 第三方服务地址关键字
        label: this.protocolLanguage.thirdServiceAddressKey,
        key: 'thirdPartyServiceAddrKeyword',
        type: 'input',
        col: 24,
        rule: []
      },
      {
        // 第三方客户端地址
        label: this.protocolLanguage.thirdClientAddress,
        key: 'thirdPartyClientAddr',
        type: 'input',
        col: 24,
        rule: [{
          pattern: '^(?=^.{3,255}$)(http(s)?:\\/\\/)?(www\\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\\d+)*(\\/\\w+\\.\\w+)*$',
          msg: this.protocolLanguage.domainAndIpError
        }]
      },
      {
        // 第三方客户端地址关键字
        label: this.protocolLanguage.thirdClientAddressKey,
        key: 'thirdPartyClientAddrKeyword',
        type: 'input',
        col: 24,
        rule: []
      },
      {
        // 通信协议
        label: this.protocolLanguage.communicationProtocol,
        key: 'communicationProtocol',
        type: 'select',
        col: 24,
        require: true,
        selectInfo: {
          data: CommonUtil.codeTranslate(ProtocolTypeEnum, this.$nzI18n, null, 'systemSetting.protocol'),
          value: 'code',
          label: 'label'
        },
        rule: [{required: true}],
      },
      {
        // 协议脚本文件
        label: this.protocolLanguage.protocolScriptFile,
        key: 'file',
        type: 'custom',
        require: true,
        template: this.uploadsTemplate,
        col: 24,
        rule: []
      },
      {
        // 设备配置文件
        label: this.protocolLanguage.configScriptFile,
        key: 'file',
        type: 'custom',
        require: true,
        template: this.uploadEquipmentFile,
        col: 24,
        rule: []
      },
      {
        // SSL证书
        label: this.protocolLanguage.sslCertificate,
        key: 'file',
        type: 'custom',
        template: this.uploadSslCertificate,
        col: 24,
        rule: []
      },
      {
        // SSL证书密钥
        label: this.protocolLanguage.sslCertificateSecretKey,
        key: 'sslCertificateFilePassword',
        type: 'input',
        col: 24,
        disabled: true,
        rule: []
      },
      {
        // SDK描述
        label: this.protocolLanguage.sdkDescription,
        key: 'sdkDescribe',
        type: 'textarea',
        col: 24,
        disabled: true,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()]
      },
      {
        // 备注
        label: this.protocolLanguage.remark,
        key: 'remark',
        type: 'textarea',
        col: 24,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      }
    ];
    this.formColumn.forEach(item => {
      item.labelWidth = 200;
    });
  }

  /**
   * 获取form表单对象
   * @param event 表单
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // 校验表单
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getValid();
    });
  }

  /**
   * 点击确认
   */
  public onConfirm(): void {
    let funcName: Observable<ResultModel<DeviceProtocolListModel>>;
    const data = this.formStatus.group.getRawValue();
    // 产品id
    if (this.selectProductId) {
      Object.assign(data, {
        productId: this.selectProductId,
        supplier: this.supplierId,
        platformType: this.platformType,
        appId: this.productAppId,
      });
    }
    // 电信平台必须上传ssl证书
    if (this.platformType === CloudPlatformTypeEnum.telecomCloud) {
      if (!this.sslFile && !this.sslFileName) {
        this.$message.info(this.protocolLanguage.sslFileUploadTip);
        return;
      }
      // 为电信平台时，appId和thirdPartyServiceAddr从产品信息中获取，若没有，则是配置产品信息时有错误
      if (!this.productAppId || !this.formStatus.getData('thirdPartyServiceAddr')) {
        this.$message.info(this.protocolLanguage.productParamConfigTip);
        return;
      }
    }
    // 判断设备型号、第三方服务地址、第三方客户端地址是否全为空,若全为空给出提示
    if (data['equipmentModel'] || data['thirdPartyServiceAddr'] || data['thirdPartyClientAddr']) {
      if (this.file || this.configFile || this.sslFile) {
        const formData = new FormData();
        // 判断文件是否存在，存在则添加到formData中
        if (this.file) {
          formData.append('file', this.file, `pro_${this.fileName}`);
        }
        if (this.configFile) {
          formData.append('file', this.configFile, `con_${this.configFileName}`);
        }
        if (this.sslFile || this.sslFileName) {
          if (this.formStatus.getData('sslCertificateFilePassword')) {
            if (this.sslFile) {
              formData.append('file', this.sslFile, `ssl_${this.sslFileName}`);
            } else {
              formData.append('sslCertificateFileName', this.sslFileName);
            }
          } else {
            this.$message.warning(this.protocolLanguage.sslCertificateFilePasswordTip);
            return;
          }
        }
        Object.keys(data).forEach(key => {
          if (data[key]) {
            // 如果有设施类型则添加到formData中
            if (key === 'equipmentType') {
              formData.append(key, this.equipmentType);
            } else {
              formData.append(key, data[key]);
            }
          }
        });
        if (!this.protocolId) {
          // 新增协议脚本
          funcName = this.$systemSettingService.queryDeviceProtocolByEquipmentModel(formData);
        } else {
          // 修改协议文件、配置文件
          formData.append('protocolId', this.protocolId);
          funcName = this.$systemSettingService.updateDeviceProtocol(formData);
        }
      } else {
        const params = Object.assign({}, data, {protocolId: this.protocolId, sslCertificateFileName: this.sslFileName});
        params.equipmentType = this.equipmentType;
        funcName = this.$systemSettingService.updateProtocolName(params);
      }
      this.submitLoading = true;
      funcName.subscribe((result: ResultModel<DeviceProtocolListModel>) => {
        this.submitLoading = false;
        if (result.code === ResultCodeEnum.success) {
          if (!this.protocolId) {
            // 新增成功
            this.$message.success(this.protocolLanguage.addProtocolScriptSuccess);
          } else {
            // 修改成功
            this.$message.success(this.protocolLanguage.updateProtocolScriptSuccess);
          }
          this.$router.navigate(['business/system/agreement/facility']).then();
        } else if (result.code === ResultCodeEnum.subscribeFailed) {
          this.$message.error(this.protocolLanguage.subscribeFailedTip);
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.submitLoading = false;
      });
    } else {
      this.$message.warning(this.protocolLanguage.notAllEmpty);
    }
  }

  /**
   * 点击取消
   */
  public onCancel(): void {
    window.history.go(-1);
  }

  /**
   * 删除ssl文件 清空ssl证书文件和证书密钥
   */
  public delSslFile() {
    this.sslFile = null;
    this.sslFileName = null;
    document.getElementById('ssl-file')['value'] = '';
    this.formStatus.resetControlData('sslCertificateFilePassword', '');
    this.formStatus.group.controls['sslCertificateFilePassword'].disable();
  }

  /**
   * 上传文件
   * param documentId
   */
  public uploadFileChange(documentId: string): void {
    const fileNode = document.getElementById(documentId);
    fileNode.click();
  }

  /**
   * 文件变化
   */
  public fileChange($event: any, documentId: string): void {
    // 文件名效验
    const fileNode = document.getElementById(documentId);
    // 如果没有选择文件，则直接退出该方法
    if (fileNode['files'].length === 0) {
      return;
    }
    const fileName = fileNode['files'][0].name;
    let fileNameIsValid = true;
    // 校验上传的协议脚本、配置文件后缀名为.xml, ssl证书文件后缀名为.pkcs12
    if (documentId === 'file' && /.xml$/.test(fileName)) {
      this.file = fileNode['files'][0];
    } else if (documentId === 'config-file' && /.xml$/.test(fileName)) {
      this.configFile = fileNode['files'][0];
    } else if (documentId === 'ssl-file' && /.pkcs12$/.test(fileName)) {
      this.sslFile = fileNode['files'][0];
    } else {
      fileNameIsValid = false;
      // 针对不同文件给出相应提示
      if (documentId === 'ssl-file') {
        if (!this.sslFile) {
          this.formStatus.group.controls['sslCertificateFilePassword'].disable();
        }
        this.$message.warning(this.protocolLanguage.sslUploadError + '!');
      } else {
        this.$message.warning(this.language.agreement.currentlyOnlyXMLFormatFilesAreSupported + '!');
      }
    }
    // 如果文件名后缀合法 则校验文件名长度和文件大小
    if (fileNameIsValid) {
      if (fileName.length <= this.limit.nameLength) {
        if (fileNode['files'][0].size <= this.limit.size) {
          this.fileName = this.file ? this.file.name : this.fileName;
          this.configFileName = this.configFile ? this.configFile.name : this.configFileName;
          this.sslFileName = this.sslFile ? this.sslFile.name : this.sslFileName;
          if (documentId === 'ssl-file' && this.sslFileName) {
            this.formStatus.group.controls['sslCertificateFilePassword'].enable();
          }
        } else {
          // 文件错误提示
          this.errorFile(this.limit.sizeI18n, $event, documentId);
        }
      } else {
        this.errorFile(this.limit.nameI18n, $event, documentId);
      }
    }
  }

  /**
   * 选择产品
   * param $event
   */
  public selectDataChange(event: ProductInfoModel[]): void {
    if (!_.isEmpty(event)) {
      const tempData = event[0];
      if (tempData.appId) {
        // 获取appId
        this.productAppId = tempData.appId;
        this.queryServiceAddress(tempData.appId);
      } else {
        this.productAppId = '';
        this.formStatus.resetControlData('thirdPartyServiceAddr', '');
        this.formStatus.group.controls['thirdPartyServiceAddr'].enable();
      }
      // 获取平台类型
      this.platformType = tempData.platformType;
      // 获取选择的产品id
      this.selectProductId = tempData.productId;
      this.supplierId = tempData.supplier;
      this.formStatus.resetControlData('equipmentModel', tempData.productModel);
      this.formStatus.resetControlData('supplierName', tempData.supplierName);
      // 获取设备类型的国际化
      this.equipmentType = tempData.typeCode as EquipmentTypeEnum;
      this.formStatus.resetControlData('equipmentType', CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, tempData.typeCode));
      this.formStatus.resetControlData('softwareVersion', tempData.softwareVersion);
      this.formStatus.resetControlData('hardwareVersion', tempData.hardwareVersion);
    } else {
      // 清空产品相关信息数据以及表单中的相关数据
      this.productAppId = '';
      this.selectProductId = '';
      this.supplierId = '';
      this.platformType = null;
      this.formStatus.group.controls['thirdPartyServiceAddr'].enable();
      ['equipmentModel', 'supplierName' , 'equipmentType', 'softwareVersion', 'hardwareVersion', 'thirdPartyServiceAddr'].forEach(key => {
        this.formStatus.resetControlData(key, '');
      });
    }
  }

  /**
   * 根据appId获取第三方服务地址
   * param appId
   */
  private queryServiceAddress(appId: string): void {
    this.$systemSettingService.findPlatformAppInfoByAppId(appId).subscribe(res => {
      if (res.code === ResultCodeEnum.success) {
        this.formStatus.resetControlData('thirdPartyServiceAddr', res.data.address);
        this.formStatus.group.controls['thirdPartyServiceAddr'].disable();
      }
    });
  }

  /**
   * 文件错误提示
   */
  private errorFile(msg: string, event: any, documentId: string): void {
    // 上传文件错误时，将文件、文件名作置空处理
    if (documentId === 'file') {
      this.fileName = null;
      this.file = null;
    } else if (documentId === 'config-file') {
      this.configFile = null;
      this.configFileName = null;
    } else {
      this.delSslFile();
    }
    event.target.value = '';
    this.$message.warning(msg + '!');
  }

  /**
   * 覆盖更新
   */
  private confirmCover(res: ResultModel<DeviceProtocolListModel>): void {
    this.$modalService.confirm({
      nzTitle: this.language.table.prompt,
      nzContent: `<span>${res.msg}</span>`,
      nzOkText: this.language.table.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
        this.submitLoading = false;
      },
      nzCancelText: this.language.table.okText,
      nzOnCancel: () => {
        // 编辑操作时进行覆盖更新，新增操作时进行新增
        const request = this.protocolId ? this.$systemSettingService.updateCoverDeviceProtocol(res.data) : this.$systemSettingService.addDeviceProtocol(res.data);
        request.subscribe((result: ResultModel<string>) => {
          this.submitLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.protocolId ? this.protocolLanguage.updateProtocolScriptSuccess : this.protocolLanguage.addProtocolScriptSuccess);
            this.$router.navigate(['business/system/agreement/facility']).then();
          } else {
            this.$message.error(result.msg);
          }
        }, () => {
          this.submitLoading = false;
        });
      }
    });
  }
  /**
   * 初始化新增编辑页面
   */
  private initPage(): void {
      this.pageType = this.$active.snapshot.params.type;
      if (this.pageType === OperateTypeEnum.add) {
        this.pageTitle = this.language.agreement.addProtocolScript;
      } else if (this.pageType === OperateTypeEnum.update) {
        this.pageTitle = this.language.agreement.updateProtocolScript;
        this.$active.queryParams.subscribe(params => {
          this.protocolId = params.id;
          // 编辑数据回显
          this.getProtocolData();
        });
      }
  }

  /**
   * 编辑协议数据回显
   */
  private getProtocolData(): void {
    this.$systemSettingService.queryDeviceProtocolById(this.protocolId).subscribe((res: ResultModel<DeviceProtocolListModel>) => {
      this.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        const data = res.data;
        this.formStatus.resetData(data);
        // 获取产品相关信息
        if (data.productId) {
          this.selectProductId = data.productId;
          this.supplierId = data.supplier;
          this.platformType = data.platformType;
          this.productAppId = data.appId;
          this.equipmentType = data.equipmentType as EquipmentTypeEnum;
          this.formStatus.resetControlData('equipmentType', CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, data.equipmentType));
        }
        // appId存在 则第三方服务地址输入框为置灰状态
        if (this.productAppId) {
          this.formStatus.group.controls['thirdPartyServiceAddr'].disable();
        }
        this.fileName = data.fileName;
        this.configFileName = data.equipmentConfigFileName;
        this.sslFileName = data.sslCertificateFileName;
        if (this.sslFileName) {
          this.formStatus.group.controls['sslCertificateFilePassword'].enable();
        } else {
          this.formStatus.group.controls['sslCertificateFilePassword'].disable();
        }
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }


  /**
   * 查询设施协议文件规格
   */
  private queryLimit(): void {
    this.$systemSettingService.queryFileLimit().subscribe((result: ResultModel<FileLimitModel>) => {
      this.isLoading = false;
      if (result.code === 0) {
        this.limit = result.data;
      }
    }, () => {
      this.isLoading = false;
    });
  }
}

