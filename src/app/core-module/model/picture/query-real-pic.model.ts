/**
 * 查询实景图参数
 */
export class QueryRealPicModel {
  /**
   * 图片id
   */
  public picId?: string;
  /**
   *  对象id
   */
  public objectId?: string;
  /**
   * 对象类型
   */
  public objectType?: string;
  /**
   * 来源
   */
  public resource?: string;

  /**
   * 查询图片数量
   */
  public picNum?: string;

  /**
   * 圖片url
   */
  public picUrl?: string;

  constructor(objectId?: string, objectType?: string, resource?: string, picNum?: string, picUrl?: string, picId?: string) {
    this.objectId = objectId;
    this.objectType = objectType;
    this.resource = resource;
    this.picNum = picNum;
    this.picUrl = picUrl;
    this.picId = picId;
  }
}
