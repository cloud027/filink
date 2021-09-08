/**
 * 指令下发模型
 */
import {ControlInstructEnum} from '../../enum/instruct/control-instruct.enum';

export class InstructSendRequestModel<T> {
  /**
   * 指令id
   */
  public commandId: ControlInstructEnum;
  /**
   * 分组id数组
   */
  public groupIds?: string[];
  /**
   *  设备ids
   */
  public equipmentIds?: string[];

  /**
   * 指令参数根据各个地方数据不同传参
   */
  public param?: T;

  constructor(commandId, equipmentIds?, param?, groupIds?) {
    this.commandId = commandId;
    this.groupIds = groupIds;
    this.equipmentIds = equipmentIds || [];
    this.param = param;
  }
}
