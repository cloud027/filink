/**
 * 大文件上传
 */
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class WebUploadService {
  // 删除正在上传或者已完成的文件
  public deleteLoadFile: any;

  constructor() {
    this.deleteLoadFile = new EventEmitter();
  }
}
