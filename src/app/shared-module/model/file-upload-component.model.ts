export class FileUploadComponentModel {
  fileType: Array<string>;
  fileLimitCount: number;
  fileErrorMsg: string;
  constructor(fileType = [], fileLimitCount = 1, fileErrorMsg = '') {
    this.fileType = fileType;
    this.fileLimitCount = fileLimitCount;
    this.fileErrorMsg = fileErrorMsg;
  }
}
