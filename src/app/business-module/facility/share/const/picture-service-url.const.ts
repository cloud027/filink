import {DEVICE_SERVER} from '../../../../core-module/api-service/api-common.config';

/**
 * 图片管理接口路径常量
 */
export const PictureServiceUrlConst = {
  // 查询图片列表
  imageListByPage: `${DEVICE_SERVER}/picRelationInfo/imageListByPage`,
  // 删除图片
  deleteImageIsDeletedByIds: `${DEVICE_SERVER}/picRelationInfo/deleteImageIsDeletedByIds`,
  // 批量下载图片
  batchDownLoadImages: `${DEVICE_SERVER}/picRelationInfo/batchDownLoadImages`,
  // 根据告警id和设施id查询图片路径
  getPicUrlByAlarmIdAndDeviceId: `${DEVICE_SERVER}/picRelationInfo/getPicUrlByAlarmIdAndDeviceId`,
  // 根据告警id查询图片地址
  getPicUrlByAlarmId: `$${DEVICE_SERVER}/picRelationInfo/getPicUrlByAlarmId`,
};

