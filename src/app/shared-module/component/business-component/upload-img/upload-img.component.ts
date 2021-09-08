import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {NzI18nService, NzUploadComponent, UploadFile} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../enum/language.enum';
import {FILE_TYPE_CONST} from '../../../../core-module/const/common.const';

@Component({
  selector: 'app-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.scss']
})
export class UploadImageComponent implements OnInit, OnDestroy {
  // 图片地址
  @Input('url') set url(value: string) {
    this.localViewUrl = value;
    this.setImgShowBack();
  }

  constructor(private $nzI18n: NzI18nService,
              private $httpClient: HttpClient,
              private sanitizer: DomSanitizer,
              private $message: FiLinkModalService) {
  }

  @Output()
  public getUploadList: EventEmitter<UploadFile[]> = new EventEmitter<UploadFile[]>();
  @ViewChild(NzUploadComponent) upload: NzUploadComponent;
  // 国际化
  public language: FacilityLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 所选文件集合
  public fileList: UploadFile[] = [];
  // 图片url
  public imgUrl: SafeUrl;
  // 是否预览
  public previewVisible = false;
  // 预览地址
  public previewUrl: string | SafeUrl;
  // 可以上传的文件类型
  public fileType = FILE_TYPE_CONST;
  // 回显url
  private localViewUrl: string;
  // 定时器
  private timeoutNumber: number;

  /**
   * 移除blob图片链接unsafe:前缀
   */
  private static removeUnsafe(): void {
    const elementsByTagName = document.getElementsByTagName('img');
    for (let i = 0; i < elementsByTagName.length; i++) {
      if (elementsByTagName[i].src.includes('unsafe:')) {
        const newSrc = elementsByTagName[i].src.slice(7);
        elementsByTagName[i].setAttribute('src', newSrc);
      }
    }
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.setImgShowBack();
  }

  /**
   * 设置图片回显
   */
  public setImgShowBack(): void {
    if (this.localViewUrl) {
      this.imgUrl = this.sanitizer.bypassSecurityTrustUrl(this.localViewUrl);
      this.fileList = [
        {
          uid: '',
          type: '',
          url: this.localViewUrl,
          status: 'success',
          size: 0,
          name: ''
        }
      ];
      this.getUploadList.emit(this.fileList);
    }
  }

  /**
   * 上传前校验
   */
  public beforeUpload = (file: UploadFile): boolean => {
    if (!this.fileType.includes(file.type)) {
      this.$message.error(this.commonLanguage.pictureFormatError);
    } else {
      this.imgUrl = this.getObjectURL(file);
      this.fileList = [];
      file.url = this.imgUrl['changingThisBreaksApplicationSecurity'] as string;
      file.status = 'success';
      this.fileList = this.fileList.concat(file);
      this.timeoutNumber = setTimeout(() => {
        UploadImageComponent.removeUnsafe();
      });
      this.getUploadList.emit(this.fileList);
    }
    return false;
  }

  /**
   * 预览
   */
  public handlePreview = async (file: UploadFile) => {
    this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(file.url);
    this.previewVisible = true;
  }

  public ngOnDestroy(): void {
    this.imgUrl = '';
    this.timeoutNumber = null;
  }

  // 删除图片事件
  removeFile = (file: UploadFile): boolean => {
    this.fileList = [];
    this.getUploadList.emit(this.fileList);
    return true;
  }

  /**
   * 生成一个预览图片安全url
   */
  private getObjectURL(file: UploadFile): SafeUrl {
    const imgUrl = window.URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }
}
