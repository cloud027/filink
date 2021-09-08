/**
 * 大文件上传
 */
export class WebUploaderModel {
  /**
   * 文件id
   */
  id?: string;
  /**
   * 是否上传过该文件
   */
  completeFlag?: number;
  /**
   * 类型
   */
  type?: number;
  /**
   * 创建时间
   */
  createDate?: string;
  /**
   * 完整的文件路径
   */
  fileFullPath?: string;
  /**
   * 组名
   */
  fileGroup?: string;
  /**
   * MD5文件
   */
  fileMd5?: string;
  /**
   * 文件名
   */
  fileName?: string;
  name?: string;
  /**
   * 文件路径
   */
  filePath?: string;
  /**
   * 文件大小
   */
  fileSize?: number;
  /**
   * 文件列表id
   */
  tid?: number;
  /**
   * 文的总片数件
   */
  chunkCurr?: number;
  /**
   * 上锁码
   */
  lockFlag?: string;
  /**
   * 更新时间
   */
  updateDate?: string;
  /**
   * 已上传的大小
   */
  uploadSize?: number;
  /**
   * 上传状态信息
   */
  statusText?: string;
  /**
   * 是否上传完成
   */
  isUploadFinished?: boolean;
  /**
   * 业务id
   */
  businessId?: string;
  /**
   * 回调接口url
   */
  callBackUrl?: string;
  /**
   * 回调参数
   */
  callBackParams?: string;
}

/**
 * 支持文件类型
 */
export class SupportFileType {
  /**
   * title
   */
  title: string;
  /**
   * 文件格式
   * 如：png，xlsx，zip
   */
  extensions: string;
  /**
   * 文件类型 content-type
   * 注：https://tool.oschina.net/commons/，该网址可以查看文件格式对应的content-type
   * 如：image/png，application/vnd.openxmlformats-officedocument.spreadsheetml.sheet，application/x-zip-compressed，
   */
  mimeTypes: string;
}

