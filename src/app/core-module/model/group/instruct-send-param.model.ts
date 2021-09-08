/**
 *  执行下发参数
 */

export class InstructSendParamModel {
  /**
   * 音量控制
   */
  public volume?: number;
  /**
   * 亮度控制
   */
  public lightnessNum?: number;

  /**
   * 指定时间
   */
  public periodType?: string;
  /**
   * 节目播放时间
   */
 public dayTime?: string;
  /**
   * 开始时间
   */
 public startDate?: string;

  /**
   * 结束时间
   */
  public endDate?: string;

  /**
   * 文件地址
   */
 public fastdfsAddr?: string;

  /**
   * 节目总和
   */
 public totalSize?: string;

  /**
   * 节目参数信息
   */
 public program: [{programId: string }];

}
