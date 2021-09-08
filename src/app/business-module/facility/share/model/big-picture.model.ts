/**
 * 查看大图数据模型
 */
import {PictureListModel} from '../../../../core-module/model/picture/picture-list.model';

export class BigPictureModel {
  /**
   * 当前图片
   */
  public curPicInfo: PictureListModel;
  /**
   * 图片集合用于切换
   */
  public bigPicList: PictureListModel[];
}
