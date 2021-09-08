/**
 *  查询最近图片查询参数模型
 */
export class QueryRecentlyPicModel {

  /**
   * 照片数量
   */
  public picNum: string;

  /**
   *  对象id
   */
  public objectId: string;

  constructor(objectId?: string, picNum?: string) {
    this.objectId = objectId;
    this.picNum = picNum;
  }


}
