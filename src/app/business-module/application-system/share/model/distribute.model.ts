import {PlayEnum} from '../enum/program.enum';
import {CurrentTimeModel} from './current.time.model';
import {CommonInstructModel} from '../../../../core-module/model/application-system/common-instruct.model';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';

/**
 * 指令的模型
 */
export class DistributeModel extends CommonInstructModel {
  /**
   * 设备id
   */
  public equipmentIds?: Array<string>;
  /**
   * 分组id
   */
  public groupIds?: Array<string>;
  /**
   * 策略id
   */
  public strategyId?: string;
  /**
   * 类型
   */
  public commandId: ControlInstructEnum;
  /**
   * 指令参数
   */
  public param: DistributeParamsModel;
}

/**
 *参数模型
 */
export class DistributeParamsModel {
  /**
   * 亮度值
   */
  public lightnessNum?: number;
  /**
   * 音量值
   */
  public volumeNum?: number;
  /**
   * 音量
   */
  public volume?: number;
  /**
   * 亮度
   */
  public light?: number;
  /**
   * 类型
   */
  public periodType?: string;
  /**
   *
   */
  public dayTime?: { month: number, monthDay: number[] }[];
  /**
   * 开始日期
   */
  public startDate?: string;
  /**
   * 结束日期
   */
  public endDate?: string;
  /**
   * fastDFS 地址
   */
  public fastdfsAddr?: string;
  /**
   * 大小
   */
  public totalSize?: number;
  /**
   * 播放时间
   */
  public playTimes?: CurrentTimeModel[];
  /**
   * 节目信息
   */
  public program?: ProgramInfoModel[];
  /**
   * 回路参数
   */
  public loopList?: LoopParamsModel[];
  /**
   *  录音设备真实id  sequenceId
   */
  public sourceId?: string;
  /**
   *   0 - 开始   1 - 停止
   */
  public isStop?: string;
  public playCutInName?: string;
  public programList?: BroadcastProgramModel[];
}

/**
 * 回路参数模型
 */
export class LoopParamsModel {
  /**
   * 所属集控id
   */
  public equipmentId: string;
  /**
   * 回路id
   */
  public loopCode: string;
}

/**
 * 节目信息
 */
export class ProgramInfoModel {
  /**
   * 播放类型
   */
  public playType: number;
  /**
   * 顺序
   */
  public playOrder: number;
  /**
   * 文件类型
   */
  public type: PlayEnum;
  /**
   * 后缀
   */
  public fileExt: string;
  /**
   * 文件md5值
   */
  public md5: string;
  /**
   * 节目路径
   */
  public programPath: string;
  /**
   * 高度
   */
  public height: number;
  /**
   * 宽度
   */
  public width: number;
  /**
   * 节目id
   */
  public programId: string;
  /**
   * 节目名称
   */
  public programName: string;
  /**
   * 文件大小
   */
  public progSize: number;
  /**
   * 开始播放时间
   */
  public timeSpan: number;
  /**
   * 速度
   */
  public speed: string;
  /**
   * 左移位置
   */
  public displayLeft: string;
  /**
   * 右移位置
   */
  public displayRight: string;
}
export class BroadcastProgramModel {
  /**
   * 播放类型
   */
  public programId: string;
  /**
   * 顺序
   */
  public mode: string;
}
