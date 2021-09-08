import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService, UploadFile} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {FileUploadComponentModel} from '../../model/file-upload-component.model';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../enum/language.enum';

/**
 * 上传组件
 */
@Component({
  selector: 'xc-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  // 上传按钮禁用状态
  @Input() uploadBtnDisabled: boolean = false;
  // 文件数据集合
  @Input() fileList: UploadFile[] = [];
  // 文件信息
  @Input() fileInfo = new FileUploadComponentModel();
  // 上传值变事件
  @Output() uploadChange = new EventEmitter<UploadFile[]>();
  // 移除文件变化事件
  @Output() removeFileChange = new EventEmitter<UploadFile>();
  // 公共语言包
  public language: CommonLanguageInterface;

  constructor(private $message: FiLinkModalService,
              private $i18n: NzI18nService) {
    this.language = this.$i18n.getLocaleData(LanguageEnum.common);
  }

  ngOnInit() {
  }

  /**
   * 文件上传前校验事件
   * param {UploadFile} file
   * returns {boolean}
   */
  public beforeUpload = (file: UploadFile): boolean => {
    if (this.fileList.length < this.fileInfo.fileLimitCount) {
      if (this.fileInfo.fileType.length && !this.fileInfo.fileType.includes(file.type)) {
        this.$message.error(this.fileInfo.fileErrorMsg);
      } else {
        this.fileList = this.fileList.concat(file);
        this.uploadChange.emit(this.fileList);
      }
    } else {
      this.$message.error(`${this.language.uploadFileLimitMsgPrev}${this.fileInfo.fileLimitCount}${this.language.uploadFileLimitMsgLast}`);
    }
    return false;
  }

  /**
   * 移除文件事件
   * param {UploadFile} file
   * returns {boolean}
   */
  public removeUpload = (file: UploadFile): boolean => {
    this.removeFileChange.emit(file);
    return true;
  }

}
