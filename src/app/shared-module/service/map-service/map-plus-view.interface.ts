/**
 * Created by xiaoconghu on 2020/6/5.
 */
export interface MapPlusViewInterface {
  /**
   * 创建增强版地图
   * param documentId
   */
  createPlusMap(documentId);

  /**
   * 获取当前地址
   */
  getLocation(point, fn?);

  /**
   * 定位到用户登录的城市
   */
  locateToUserCity(bol?);


  /**
   * 隐藏marker点
   * param id
   */
  hideMarker(id);

  /**
   * 显示marker
   * param id
   */
  showMarker(id);

  /**
   * 隐藏其他的设施点
   * param data
   */
  hideOther(data);

  addZoomEnd(fn);
}
