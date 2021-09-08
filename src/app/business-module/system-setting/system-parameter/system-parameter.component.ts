import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BasicConfig} from '../share/service/basic-config';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {ColumnConfigService} from '../share/service/column-config.service';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {SystemParameterService} from '../share/service';
import {SystemParameterConfigEnum, DealTitleEnum} from '../share/enum/system-setting.enum';
import {DomSanitizer} from '@angular/platform-browser';
import {TelephoneInputComponent} from '../../../shared-module/component/telephone-input/telephone-input.component';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {FILINK_LOGO} from '../share/const/system.const';
import {ResultModel} from '../../../shared-module/model/result.model';
import {LanguageModel} from '../../../core-module/model/alarm/language.model';
import {SystemParamModel} from '../share/mode/system-param.model';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {SystemLanguageEnum} from '../../../core-module/enum/alarm/system-language.enum';


@Component({
  selector: 'app-system-parameter',
  templateUrl: './system-parameter.component.html',
  styleUrls: ['./system-parameter.component.scss']
})
export class SystemParameterComponent extends BasicConfig implements OnInit {
  // 上传图片
  @ViewChild('uploadImg') uploadImg: any;
  // 上传图片模板
  @ViewChild('logo') private logoTemplate: ElementRef;
  // 电话号码模板
  @ViewChild('telephone') private telephoneTpl: TelephoneInputComponent;
  // 标题
  public pageTitle: string;
  // 参数设置类型
  public settingType: string = '';
  // 是否加载
  public isLoading: boolean = false;
  // 新增弹出框显示隐藏
  public isVisible: boolean = true;
  // 接口路由参数
  public urlType: string = '';
  // 参数id
  public paramId: string = '';
  // 文件名称
  public fileName: string = '';
  // 初始化值
  public defaultValue = {
    systemLogo: '',
  };
  // 当前值
  public presentValue = {
    retentionTime: '',
    soundRemind: '',
    soundSelected: '',
    systemLogo: '',
    screenScroll: '',
    screenScrollTime: ''
  };
  // 接口返回imgsrc
  public src = null;
  // 本地img地址
  public imgSrc = null;
  // 获取所有语言下拉
  public languageAll: LanguageModel[] = [];
  // 获取电话号码实例
  public phone: any;
  // 提交短信测试
  public phoneError: boolean = false;
  // 权限码
  public code: string = '';
  // 系统logo
  public systemLogo: string = '';
  // 上传的文件
  public file: any;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  /** 系统设置参数类型枚举*/
  public systemParameterConfigEnum = SystemParameterConfigEnum;
  // 是否切换语言包
  private isUpdateLanguage: boolean = false;


  constructor(public $nzI18n: NzI18nService,
              private $columnConfigService: ColumnConfigService,
              private $message: FiLinkModalService,
              private $activatedRoute: ActivatedRoute,
              private el: ElementRef,
              private $systemParameterService: SystemParameterService,
              private sanitizer: DomSanitizer
  ) {
    super($nzI18n);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.pageTitle = this.indexLanguage.displaySettings;
    this.queryLanguage();
  }

  /**
   * 查询表单配置
   */
  public searchFromData(): void {
    this.$systemParameterService.queryProtocol(this.urlType).subscribe((result: ResultModel<SystemParamModel>) => {
      if (result.code === ResultCodeEnum.success) {
        this.paramId = result.data.paramId;
        this.defaultValue = JSON.parse(result.data.defaultValue);
        this.presentValue = JSON.parse(result.data.presentValue);
        const type = 'local';
        if (this.urlType === SystemParameterConfigEnum.show) {
          if (this.presentValue.systemLogo === type) {
            this.src = FILINK_LOGO;
            this.systemLogo = type;
          } else {
            this.src = this.presentValue.systemLogo;
            this.systemLogo = this.src;
          }
        }
        // 获取邮件 短信 推送服务的当前值
        if (this.urlType === SystemParameterConfigEnum.note || this.urlType === SystemParameterConfigEnum.email || this.urlType === SystemParameterConfigEnum.push) {
          this.presentValue = Object.assign({}, JSON.parse(this.presentValue['settingData']), {serviceType: this.presentValue['serviceType']});
        }
        this.formStatus.resetData(this.presentValue);
      }
    });
  }


  /**
   * 文件变化
   */
  public fileChange($event: Event): void {
    // 文件名效验
    const fileNode = document.getElementById('file');
    // 取消不进入
    if (fileNode['files'].length !== 0) {
      const fileName = fileNode['files'][0].name;
      const reg = /(.jpg|.png|.jpeg|.gig)$/i;
      if (reg.test(fileName)) {
        this.file = fileNode['files'][0];
        this.fileName = this.file.name;
        this.previewFile(fileNode['files'][0]);
      } else {
        this.$message.warning(`${this.language.agreement.atPresentOnlyPictureFormatFilesAreSupported}`);
      }
      // 清空上一次的值
      this.uploadImg.nativeElement.value = '';
    }
  }



  /**
   * 文件上传
   */
  public upload(): void {
    const fileNode = document.getElementById('file');
    fileNode.click();
  }

  /**
   * 确定
   */
  public formHandleOk(): void {
    let arrData = {};
    switch (this.urlType) {
      case SystemParameterConfigEnum.msg:
        arrData = {
          messageNotification: this.formStatus.group.getRawValue(),
          paramId: this.paramId
        };
        this.submitSystem(this.urlType, arrData);
        break;
      case SystemParameterConfigEnum.email:
      case SystemParameterConfigEnum.note:
      case SystemParameterConfigEnum.push:
        arrData = {
          paramId: this.paramId,
          sendTypeParam: {serviceType: this.formStatus.group.value.serviceType, settingData: JSON.stringify(this.handleSendParams())}
        };
        this.submitSystem(this.urlType, arrData);
        break;
      case SystemParameterConfigEnum.show:
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('paramId', this.paramId);
        const from = this.formStatus.group.getRawValue();
        Object.keys(from).forEach((key) => {
          formData.append(key, from[key]);
        });
        this.submitSystem(this.urlType, formData);
        break;
      case SystemParameterConfigEnum.ftp:
        this.isLoading = true;
        arrData = {
          paramId: this.paramId,
          ftpSettings: this.formStatus.getData()
        };
        this.submitSystem(this.urlType, arrData);
        break;
      case SystemParameterConfigEnum.platformDisplay:
        this.isLoading = true;
        arrData = {
          paramId: this.paramId,
          platformDisplaySettings: this.formStatus.group.getRawValue()
        };
        this.submitSystem(this.urlType, arrData);
        break;
    }
  }

  /**
   * 测试eMail
   */
  public formTestEMail(): void {
    const data = {
      serviceType: this.formStatus.getData('serviceType'),
      settingData: JSON.stringify(this.handleSendParams()),
      toAddress: this.formStatus.getData('toAddress')
    };
    this.$systemParameterService.testEmail(data).subscribe((result: ResultModel<string>) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 实例化电话号码
   */
  public telephoneInit(event): void {
    this.phone = event;
  }

  /**
   * 监听电话输入框变化
   */
  public phoneChange(): void {
    this.phoneError = this.phone.isValidNumber();
  }

  /**
   * 测试phone
   */
  public formTestPhone(): void {
    if (this.phone.getNumber().substring(0, 3) === '+86') {
      const data = {
        serviceType: this.formStatus.getData('serviceType'),
        settingData: JSON.stringify(this.handleSendParams()),
        phone: this.phone.getNumber().substring(3)
      };
      this.$systemParameterService.testPhone(data).subscribe((result: ResultModel<string>) => {
        if (result.code === 0) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      this.$message.warning(`${this.language.systemSetting.testFailure}`);
    }
  }

  /**
   * 测试ftp
   */
  public formTestFTP(): void {
    this.submitLoading = true;
    const data = {
      paramId: this.paramId,
      ftpSettings: this.formStatus.getData()
    };
    this.$systemParameterService.ftpSettingsTest(data).subscribe((result: ResultModel<string>) => {
      if (result.code === 0) {
        this.submitLoading = false;
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
        this.submitLoading = false;
      }
    }, () => {
      this.submitLoading = false;
    });

  }

  /**
   * 取消
   */
  public formHandleCancel(): void {
    this.formStatus.resetData(this.presentValue);
    if (this.urlType === SystemParameterConfigEnum.show) {
      if (this.presentValue.systemLogo === 'local') {
        this.src = FILINK_LOGO;
        this.systemLogo = 'local';
      } else {
        this.src = this.presentValue.systemLogo;
        this.systemLogo = this.src;
      }
    }
    if (this.urlType === SystemParameterConfigEnum.note) {
      this.telephoneTpl.phoneNum = '';
      this.phoneError = false;
    }
  }

  /**
   * 恢复默认
   */
  public formHandleReset(): void {
    setTimeout(() => {
      this.formStatus.resetData(this.defaultValue);
    }, 0);
    if (this.urlType === SystemParameterConfigEnum.show) {
      this.file = null;
      if (this.defaultValue.systemLogo === 'local') {
        this.src = FILINK_LOGO;
        this.systemLogo = 'local';
      } else {
        this.src = this.defaultValue.systemLogo;
        this.systemLogo = this.src;
      }

    }
    if (this.urlType === SystemParameterConfigEnum.note) {
      this.telephoneTpl.phoneNum = '';
      this.phoneError = false;
    }

  }

  /**
   * 提交数据
   */
  private submitSystem(type: string, arrData): void {
    this.$systemParameterService.updateSystem(type, arrData).subscribe((result: ResultModel<string>) => {
      // 此处为特殊地方 后台有些接口返回为'00000' 有些接口返回为0
      if (result.code === ResultCodeEnum.success || result.code === 0) {
        this.submitLoading = false;
        if (type === SystemParameterConfigEnum.platformDisplay) {
          // 请求成功之后再切换语言
          const from = this.formStatus.group.getRawValue();
          if (JSON.parse(localStorage.getItem('localLanguage')) !== from.systemLanguage) {
            // 前端切换中英文
            if (from.systemLanguage === SystemLanguageEnum.us || from.systemLanguage === SystemLanguageEnum.en) {
              this.$nzI18n.setLocale(CommonUtil.toggleNZi18n('en_US').language);
            } else {
              this.$nzI18n.setLocale(CommonUtil.toggleNZi18n('zh_CN').language);
            }
            localStorage.setItem('localLanguage', JSON.stringify(from.systemLanguage));
            this.isUpdateLanguage = true;
          } else {
            this.isUpdateLanguage = false;
          }
        }
        // 提示弹框
        if (this.isUpdateLanguage) {
          window.location.reload();
        } else {
          if (type === SystemParameterConfigEnum.show) {
            this.$message.success(this.language.systemSetting.updateDisplaySettings);
          } else if (type === SystemParameterConfigEnum.platformDisplay) {
            this.$message.success(this.language.systemSetting.updatePlatformDisplay);
          } else {
            this.$message.success(result.msg);
          }
        }
        this.searchFromData();
      } else {
        this.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.isLoading = false;
      this.submitLoading = false;
    });
  }

  /**
   * 监听表单数据变化
   * param controls
   * param $event
   * param key
   */
  modelChange = (controls, $event, key) => {
    if (key === 'messageRemind') {
      if ($event === '1') {
        this.formStatus.group.controls['retentionTime'].enable();
        this.formStatus.group.controls['soundRemind'].enable();
        this.formStatus.group.controls['soundRemind'].setValue(this.presentValue.soundRemind);
        this.formStatus.group.controls['soundSelected'].enable();
      } else {
        // 若消息保留时间输入不通过校验，则置为初始的保留时间，初始的保留时间不存在，则置为默认的保留时间
        if (!this.formStatus.group.controls['retentionTime'].valid) {
          this.formStatus.group.controls['retentionTime'].setValue(this.presentValue.retentionTime || this.defaultValue['retentionTime']);
        }
        this.formStatus.group.controls['retentionTime'].disable();
        this.formStatus.group.controls['soundRemind'].disable();
        this.formStatus.group.controls['soundSelected'].disable();
        this.formStatus.group.controls['soundRemind'].setValue('0');
      }
    }
    if (key === 'soundRemind') {
      if ($event === '1') {
        this.formStatus.group.controls['soundSelected'].enable();
      } else {
        this.formStatus.group.controls['soundSelected'].disable();
      }
    }
    // build2暂时不需要以下参数变化
    // if (key === 'screenDisplay') {
    //   if ($event === '1') {
    //     this.formStatus.group.controls['screenScroll'].enable();
    //     this.formStatus.group.controls['screenScroll'].setValue(this.presentValue.screenScroll);
    //   } else {
    //     this.formStatus.group.controls['screenScroll'].disable();
    //     this.formStatus.group.controls['screenScroll'].setValue('0');
    //   }
    // }
    // if (key === 'screenScroll') {
    //   if ($event === '1') {
    //     this.formStatus.group.controls['screenScrollTime'].enable();
    //   } else {
    //     // 若大屏滚动时间间隔输入不通过校验，则置为初始的时间间隔，初始的时间间隔不存在，则置为默认的时间间隔
    //     if (!this.formStatus.group.controls['screenScrollTime'].valid) {
    //       this.formStatus.group.controls['screenScrollTime'].setValue(this.presentValue.screenScrollTime || this.defaultValue['screenScrollTime']);
    //     }
    //     this.formStatus.group.controls['screenScrollTime'].disable();
    //   }
    // }
  }

  /**
   * 翻译
   */
  private queryLanguage(): void {
    this.$systemParameterService.queryLanguage().subscribe((result: ResultModel<LanguageModel[]>) => {
      this.languageAll = result.data;
      this.languageAll.forEach(item => {
        item.label = item.languageName;
        item.value = item.languageType;
      });
      this.$activatedRoute.params.subscribe(params => {
        this.dealTitle(params['settingType']);
      });
    });
  }

  /**
   * 文件大小尺寸校验
   */
  private previewFile(file: File): void {
    const vm = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const fileSize = file.size / 1024 / 1024;
    if (fileSize < 3) {
      reader.addEventListener('load', () => {
        const img = new Image();
        vm.imgSrc = reader.result;
        img.src = vm.imgSrc;
        img.onload = function () {
          if (img.width === 50 && img.height === 50) {
            vm.src = vm.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(vm.file));
            vm.$message.success(vm.language.agreement.uploadSuccess);
          } else {
            vm.$message.warning(`${vm.language.agreement.pictureSizeShouldNotBeGreaterThan}${'50*50'}`);
            vm.file = null;
            vm.fileName = '';
          }
        };
      }, false);
    } else {
      vm.$message.warning(`${vm.language.agreement.pictureSizeShouldNotBeGreaterThan3M}${'!'}`);
      vm.file = null;
      vm.fileName = '';
    }

  }

  /**
   * 处理不同参数设置的title以及表单配置
   * param type
   */
  private dealTitle(type: string): void {
    // 赋值短信 邮件 推送服务器切换时的事件
    const serverModelChange = this.handleChangeServer;
    switch (type) {
      case DealTitleEnum.show:
        this.settingType = DealTitleEnum.show;
        this.urlType = SystemParameterConfigEnum.show;
        this.pageTitle = this.language.systemSetting.displaySettings;
        this.code = '04-5-1-1';
        // 初始化表单
        const initData = {
          logo: this.logoTemplate,
          modelChange: this.modelChange
        };
        this.formColumn = this.$columnConfigService.getShowSystemParameterFormConfig(initData);
        break;
      case DealTitleEnum.msg:
        this.settingType = DealTitleEnum.msg;
        this.urlType = SystemParameterConfigEnum.msg;
        this.code = '04-5-2-1';
        // 初始化表单
        const changeData = {
          modelChange: this.modelChange,
          play: this.el.nativeElement.querySelector('#music')
        };
        this.pageTitle = this.language.systemSetting.messageNotificationSettings;
        this.formColumn = this.$columnConfigService.getMsgSystemParameterFormConfig(changeData);
        break;
      case DealTitleEnum.email:
        this.settingType = DealTitleEnum.email;
        this.urlType = SystemParameterConfigEnum.email;
        this.pageTitle = this.language.systemSetting.mailServerSettings;
        this.formColumn = this.$columnConfigService.getEmailSystemParameterFormConfig(serverModelChange);
        this.code = '04-5-3-1';
        break;
      case DealTitleEnum.note:
        this.settingType = DealTitleEnum.note;
        this.urlType = SystemParameterConfigEnum.note;
        this.code = '04-5-4-1';
        this.pageTitle = this.language.systemSetting.shortMessageServiceSettings;
        this.formColumn = this.$columnConfigService.getNoteSystemParameterFormConfig(serverModelChange);
        break;
      case DealTitleEnum.push:
        this.settingType = DealTitleEnum.push;
        this.urlType = SystemParameterConfigEnum.push;
        this.code = '04-5-5-1';
        this.pageTitle = this.language.systemSetting.pushServiceSettings;
        this.formColumn = this.$columnConfigService.getPushSystemParameterFormConfig(serverModelChange);
        break;
      case DealTitleEnum.ftp:
        this.settingType = DealTitleEnum.ftp;
        this.code = '04-5-6-1';
        this.urlType = SystemParameterConfigEnum.ftp;
        this.pageTitle = this.language.systemSetting.ftpServiceSettings;
        this.formColumn = this.$columnConfigService.getFTPSystemParameterFormConfig({});
        break;
      case DealTitleEnum.platformDisplay:
        this.settingType = DealTitleEnum.platformDisplay;
        this.urlType = SystemParameterConfigEnum.platformDisplay;
        this.pageTitle = this.language.systemSetting.platformDisplaySettings;
        this.code = '04-5-7-1';
        // 初始化表单
        const languageAll = this.languageAll;
        this.formColumn = this.$columnConfigService.getPlatformSystemParameterFormConfig(languageAll);
        break;
    }
    this.searchFromData();
  }

  /**
   * 赋值短信 邮件 推送服务器服务器切换事件
   */
  private handleChangeServer = (controls, $event, key) => {
    const formColumn = this.formColumn.filter(item => item.key !== key && item.key !== 'toAddress');
    formColumn.forEach(item => {
      if (['accessKeyId', 'accessKeySecret'].includes(item.key)) {
        item.hidden = $event !== '1';
      } else {
        item.hidden = $event !== '2';
      }
    });
    this.formStatus.group.updateValueAndValidity();
  }

  /**
   * 处理传入后台的参数
   */
  private handleSendParams() {
    const settingData = {};
    this.formColumn.forEach(item => {
      // 去掉隐藏属性的值&&serviceType toAddress字段单独处理
      if (!(item.hidden || item.key === 'serviceType' || item.key === 'toAddress')) {
        Object.assign(settingData, {[item.key]: this.formStatus.group.value[item.key]});
      }
    });
    return settingData;
  }
}
