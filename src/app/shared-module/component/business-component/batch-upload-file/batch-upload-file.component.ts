import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService, UploadFile} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {LanguageEnum} from '../../../enum/language.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {Download} from '../../../util/download';
import {BINARY_SYSTEM_CONST} from '../../../../core-module/const/common.const';
import {ProductRequestUrlConst} from '../../../../core-module/api-service/product/product-request-url';
import {ProductFileTypeEnum, TemplateEnum} from '../../../../core-module/enum/product/product.enum';

/**
 * 上传智慧杆组件
 */
@Component({
  selector: 'app-batch-upload-file',
  templateUrl: './batch-upload-file.component.html',
  styleUrls: ['./batch-upload-file.component.scss']
})
export class BatchUploadFileComponent implements OnInit {
  // 上传文件类型
  @Input() uploadFileType: ProductFileTypeEnum;
  // 产品id
  @Input() public productId: string;
  // 显示隐藏变化
  @Output() uploadVisibleChange = new EventEmitter<boolean>();
  // 加载状态变化
  @Output() pageLoadingChange = new EventEmitter<boolean>();
  // 上传完成需要抛出成功事件
  @Output() uploadSuccess = new EventEmitter<any>();
  // 上传文件类型枚举
  public fileTypeEnum = ProductFileTypeEnum;
  // 是否展示
  public isVisible: boolean = false;
  // 产品国际化词条
  public productLanguage: ProductLanguageInterface;
  // 通用国际化词条
  public commonLanguage: CommonLanguageInterface;
  // 所选的文件数组
  public fileList: UploadFile[] = [];
  public fileListRec: UploadFile[] = [];
  // 判断文件格式是否正确
  public filesIsRight = {
    // 杆体图或者网关主图
    mainClass: '',
    // 杆体点位配置或者是网关编号配置
    positionClass: '',
    // 设备模型或者是网关模型
    configClass: ''
  };
  // 确定按钮是否只读
  public saveBtnDisabled: boolean = true;
  // 上传前触发事件防抖避免多次
  beforeUploadAllImgDebounce = _.debounce((file: UploadFile, fileList: UploadFile[]) => {
    this.fileListRec = [];
    if (!_.isEmpty(fileList)) {
      this.fileList = fileList;
      this.fileListRec = fileList;
      this.filesIsRight.mainClass = this.fileList.some(item => (item.name.toLowerCase().endsWith('.jpg') || item.name.toLowerCase().endsWith('.png'))) ? 'file-right' : 'file-error';
      this.filesIsRight.configClass = this.fileList.some(item => item.name.toLowerCase().endsWith('.zip')) ? 'file-right' : 'file-error';
      this.filesIsRight.positionClass = this.fileList.some(item => item.name.toLowerCase().endsWith('.xlsx')) ? 'file-right' : 'file-error';
      // 只要有一个文件格式不对就不让点击
      this.saveBtnDisabled = this.filesIsRight.mainClass === 'file-error' || this.filesIsRight.configClass === 'file-error' || this.filesIsRight.positionClass === 'file-error';
    } else {
      this.saveBtnDisabled = true;
    }
    if (this.saveBtnDisabled) {
      this.$message.info(this.productLanguage.fileCountMsg);
      return;
    }
    for (let i = 0; i < fileList.length; i++) {
      const lowerCaseFileName = fileList[i].name.toLowerCase();
      if ((lowerCaseFileName.endsWith('.jpg') || lowerCaseFileName.endsWith('.png')) && (fileList[i].size / BINARY_SYSTEM_CONST) > 200) {
        this.$message.info(this.productLanguage.mainImageSize);
        this.filesIsRight.mainClass = 'file-error';
        this.saveBtnDisabled = true;
        break;
      }
      if (lowerCaseFileName.endsWith('.zip') && (fileList[i].size / BINARY_SYSTEM_CONST > 500)) {
        this.$message.info(this.productLanguage.modelImageSize);
        this.filesIsRight.configClass = 'file-error';
        this.saveBtnDisabled = true;
        break;
      }
      if (lowerCaseFileName.endsWith('.xlsx') && (fileList[i].size / BINARY_SYSTEM_CONST) > 100) {
        this.$message.info(this.productLanguage.positionConfigImageSize);
        this.filesIsRight.positionClass = 'file-error';
        this.saveBtnDisabled = true;
        break;
      }
    }
  }, 200);

  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $download: Download) {
  }

  // 获取modal框显示状态
  get uploadVisible() {
    return this.isVisible;
  }

  @Input()
  set uploadVisible(params) {
    this.isVisible = params;
    this.uploadVisibleChange.emit(this.isVisible);
  }

  // 上传按钮是否加载
  public _pageLoading: boolean = false;

  // 获取modal框显示状态
  get pageLoading() {
    return this._pageLoading;
  }

  @Input()
  set pageLoading(params) {
    this._pageLoading = params;
    this.pageLoadingChange.emit(this._pageLoading);
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  /**
   * 上传成功
   */
  public onClickDoUpload(): void {
    this.uploadSuccess.emit(this.fileList);
  }

  /**
   * 一键上传
   */
  public beforeUploadAllImg = (file: UploadFile, fileList: UploadFile[]): boolean => {
    this.beforeUploadAllImgDebounce(file, fileList);
    return false;
  };

  /**
   * 取消和关闭弹框
   */
  public onCloseModal(): void {
    this.fileList = [];
    this.uploadVisible = false;
  }

  /**
   * 模版下载
   */
  public onClickDownTemplate(): void {
    this.$download.downloadFileNew(
      `${ProductRequestUrlConst.downloadTemplate}/${this.uploadFileType === ProductFileTypeEnum.pole
        ? TemplateEnum.polePointConfigTemplate : TemplateEnum.gatewayConfigTemplate}`);
  }
}
