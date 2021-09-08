import {ControlInstructEnum} from '../../enum/instruct/control-instruct.enum';

export class EquipmentConfigDetailModel {
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
  public param?: {};

  constructor(commandId, equipmentIds?, param?) {
    this.commandId = commandId;
    this.equipmentIds = equipmentIds || [];
    this.param = param;
  }
}
