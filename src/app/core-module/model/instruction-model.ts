/**
 * 指令消息模型
 */
export class InstructionModel {
  /**
   * 指令日志id
   */
  public id: string;
  /**
   * 指令名称
   */
  public commandName;
  /**
   * 指令是否已读
   */
  public isRead;
  /**
   * 指令回复时间
   */
  public replyTime;
  /**
   * 指令回复时间
   */
  public _replyTime?;
  /**
   * 指令
   */
  public notice?;
  /**
   * 指令下发结果
   */
  public success;
  /**
   * 操作对象名字
   */
  public operateObjName: string;
  /**
   * 操作对象id
   */
  public operateObj: string;
}
