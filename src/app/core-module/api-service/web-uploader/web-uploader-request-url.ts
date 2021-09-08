import {SYSTEM_SERVER} from '../api-common.config';

/**
 * 大文件上传接口
 */
export const WebUploaderUrl = {
  // 获取配置
  configUrl: `${SYSTEM_SERVER}/upload/config`,
  // 上传
  uploadUrl: `${SYSTEM_SERVER}/upload/upload_do`,
  // 文件校验
  checkUrl: `${SYSTEM_SERVER}/upload/checkFile`,
  // 删除文件
  deleteUrl: `${SYSTEM_SERVER}/upload/deleteFile`,
  // 回调接口
  callbackUrl: `${SYSTEM_SERVER}/upload/updateCallBack`

};
