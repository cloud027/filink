import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private $httpClient: HttpClient) { }

  /**
   * 下载用户模板service
   */
  downloadTemplate() {
    let downloadUrl; // 下载路径
    const currentEnv = localStorage.getItem('localId') === 'en_US';
    if (!currentEnv) {
      downloadUrl = `assets/excel-file/userTemplate.xlsx`;
    } else {
      downloadUrl = `assets/excel-file/userTemplateEN.xlsx`;
    }
    return this.$httpClient.get(downloadUrl, { responseType: 'blob' });
  }

}
