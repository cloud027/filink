/**
 * 公共指令模型
 */
import {ControlInstructEnum} from '../../enum/instruct/control-instruct.enum';

export class CommonInstructModel {
  /**
   * 设备id
   */
  public equipmentIds?: Array<string>;
  /**
   */
  public commandId: ControlInstructEnum;
  /**
   * 指令参数
   */
  public param: any;
}
