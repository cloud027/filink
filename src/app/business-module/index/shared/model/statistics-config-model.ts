export class StatisticsConfigModel {
  /**
   * 文字label
   */
  public label: string;
  /**
   * 文字title
   */
  public title: string;
  /**
   * icon
   */
  public icon: string;
  /**
   * 类型
   */
  public type: number;
  /**
   * 是否显示
   */
  public isShow: boolean;
  /**
   * 是否为同一种类型
   */
  public isOneType?: string;
  /**
   * 是否显示title
   */
  public isShowTitle?: boolean;
  /**
   * 是否显示select选择器
   */
  public isShowSelect?: boolean;
}
