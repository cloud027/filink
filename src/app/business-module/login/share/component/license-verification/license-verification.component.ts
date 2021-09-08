import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {LoginService} from '../../service/login.service';
/**
 * 登录时license无效弹出license无效页面
 */
@Component({
  selector: 'app-license-verification',
  templateUrl: './license-verification.component.html',
  styleUrls: ['./license-verification.component.scss']
})
export class LicenseVerificationComponent implements OnInit, OnDestroy, OnChanges {
  // 是否展示license无效弹窗
  @Input() public isVisible: boolean = true;
  @Output() isVisibleChange: EventEmitter<boolean> = new EventEmitter();
  // 计时器倒计时时间
  public time: number = 120;
  // 定义秒的常量
  public second: string = 's';
  // 国际化
  public language: any;
  // 登入提交加载
  public submitLoading: boolean = false;
  // 上传的文件
  public file: any;
  // 文件名称
  public fileName: '';
  // xml文件校验
  public limit = {
    nameLength: 32,
    size: 1048576,
    nameI18n: '',
    sizeI18n: ''
  };
  // 定时器变量
  private timer: number;
  public agreementLanguage: any;

  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $loginService: LoginService) { }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.systemSetting);
    this.agreementLanguage = this.$nzI18n.getLocaleData('agreement');
    this.resetCountSec();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisible && changes.isVisible.currentValue) {
      this.resetCountSec();
    }
  }

  public resetCountSec() {
    this.time = 120;
    if (this.timer) {
      window.clearInterval(this.timer);
    }
    this.timer = window.setInterval(() => {
      this.countSec();
    }, 1000);
  }
  /**
   * 点击取消按钮关闭弹窗
   */
  public cancel(): void {
    this.isVisible = false;
    localStorage.removeItem('userInfo');
    this.isVisibleChange.emit(this.isVisible);
    window.clearInterval(this.timer);
  }

  /**
   * 弹窗关闭计时器
   */
  public countSec(): void {
    this.time -= 1;
    if (this.time < 0) {
      this.cancel();
    }
  }

  /**
   * 提交License
   */
  public submit(): void {
    const formData = new FormData();
    this.submitLoading = true;
    if (this.file) {
      formData.append('file', this.file);
      this.$loginService.uploadLicense(formData).subscribe((result: ResultModel<string>) => {
        this.submitLoading = false;
        if (result.code === 0) {
          this.$message.success(result.msg);
          this.cancel();
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      this.$message.warning(`${this.agreementLanguage.fileCannotBeEmpty}`);
      this.submitLoading = false;
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
   * 文件变化
   */
  public fileChange($event): void {
    // 文件名效验
    const fileNode: HTMLInputElement = <HTMLInputElement>document.getElementById('file');
    const fileName = fileNode['files'][0].name;
    const reg = /.xml$/;
    if (reg.test(fileName)) {
      this.file = fileNode['files'][0];
      if (this.file.name.length <= this.limit.nameLength) {
        if (this.file.size <= this.limit.size) {
          this.fileName = this.file.name;
          // this.$message.info(this.agreementLanguage.uploadSuccess);
          this.submit();
        } else {
          this.errorFile(this.limit.sizeI18n, $event);
        }
      } else {
        this.errorFile(this.limit.nameI18n, $event);
      }
    } else {
      this.$message.warning(this.agreementLanguage.currentlyOnlyXMLFormatFilesAreSupported + '!');
      this.file = null;
    }
    fileNode.value = null;
  }

  /**
   * license验证
   */
  private validateLicense(): void {
    this.$loginService.validateLicense().subscribe((result: ResultModel<{ licenseStatus: boolean }>) => {
      if (result.code === 0) {
        if (result.data.licenseStatus === true) {
           this.cancel();
        } else {
          this.$message.warning(`${this.agreementLanguage.theLicenesFileHasExpired}`);
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 文件错误提示
   */
  private errorFile(msg: string, event): void {
    this.fileName = '';
    this.file = null;
    event.target.value = '';
    this.$message.warning(msg + '!');
  }

  /**
   * 销毁计时器
   */
  ngOnDestroy(): void {
    window.clearInterval(this.timer);
  }

  public isVisibleChangeHandle(event) {
    this.isVisible = event;
    this.isVisibleChange.emit(this.isVisible);
  }
}
