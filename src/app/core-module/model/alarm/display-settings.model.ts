/**
 * 显示设置
 */
export class DisplaySettingsModel {
  /**
   * 展示
   */
  public screenDisplay: string;
  /**
   * 屏幕滚动
   */
  public screenScroll: string;
  /**
   * 滚动时间
   */
  public screenScrollTime: number;
  /**
   * 系统logo
   */
  public systemLogo: string;
  /**
   * 时间格式
   */
 public timeType: string;

  /**
   * 系统title
   */
  public systemTitle: string;
 constructor() {
   this.screenScrollTime = 0;
 }
}
