import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';

/**
 * 指令下发模型
 */
export class ExecuteInstructionsModel<T> {
  /**
   * 指令id
   */
  public commandId: ControlInstructEnum;
  /**
   *  设备ids
   */
  public equipmentIds?: string[];

  /**
   * 指令参数根据各个地方数据不同传参
   */
  public param?: T;

  constructor(commandId, equipmentIds?, param?) {
    this.commandId = commandId;
    this.equipmentIds = equipmentIds || [];
    this.param = param;
  }
}
