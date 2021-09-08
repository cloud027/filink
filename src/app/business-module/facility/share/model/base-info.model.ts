/**
 * Created by wh1709040 on 2019/6/15.
 */
export class BaseInfoModel {

  /**
   * 标签类型(RFID、二维码)
   */
  public labelType: number | string;

  /**
   *箱架标签状态
   */
  public labelState: number | string;

  /**
   * 箱架标签ID
   */
  public boxLabel: string;

  /**
   * 设施ID
   */
  public deviceId: string;

  /**
   * 实际框号
   */
  public frameNo: number;

  /**
   * 框所属AB面(true是B面)
   */
  public frameDouble: number;

  /**
   * 最后更新时间
   */
  public lastUpdateTime: number;

  /**
   * 模板名称
   */
  public mouldName: string;

  /**
   * 设施名称
   */
  public deviceName: string;

  /**
   * 设施类型
   */
  public deviceType: string;
  /**
   * 标签信息
   */
  public labelInfo: string;
  /**
   * 别名
   */
  public alias: string;
}
