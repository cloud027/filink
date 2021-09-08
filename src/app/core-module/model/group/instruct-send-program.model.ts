/**
 * 节目下发参数模型
 */
export class InstructSendProgramModel {
  /**
   * 播放方式
   */
  public playType?: string;

  /**
   * 播放顺序
   */
   public playOrder?: number;

  /**
   * 节目格式
   */
  public type?: string;

  /**
   * 节目下载地址
   */
  public program_path?: string;

  /**
   * 文件后缀
   */
 public fileExt?: string;

  /**
   * 高度
   */
  public height?: string;

  /**
   * 宽度
   */
  public width?: string;

  /**
   * 文件移动速度
   */
   public speed?: string;

  /**
   * 节目名称
   */
  public programName?: string;

  /**
   * 节目大小
   */
  public progSize?: string;

  /**
   * 显示时长
   */
  public timespan?: string;
}
