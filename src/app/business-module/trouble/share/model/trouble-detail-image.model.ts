import {PictureListModel} from '../../../../core-module/model/picture/picture-list.model';

/**
 * 故障详情
 */
export class TroubleDetailImageModel {
  /**
   * 页签名称
   */
  label?: string;
  /**
   * 值
   */
  code?: string | number;
  /**
   *  图片list
   */
  imageList?: PictureListModel[];
}
