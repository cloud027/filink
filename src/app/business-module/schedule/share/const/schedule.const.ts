import {USER_SERVER} from '../../../../core-module/api-service/api-common.config';

/**
 * 创建用户所需字段
 */
export const CREATE_USERS_COLUMN = [
  'userCode', 'userNickname', 'userStatus', 'roleId', 'address', 'email', 'countValidityTime', 'loginType', 'maxUsers'
];
/**
 * 下载批量导入模板链接
 */
export const DOWNLOAD_URL = {
  // 下载批量导入模板
  downloadTemplate: `${USER_SERVER}/personInformation/downloadTemplate`,
};
