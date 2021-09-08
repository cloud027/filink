/**
 * 指令模型
 */
import {InstructSendModel} from '../../../../core-module/model/group/instruct-send.model';

export class InterfaceModel {

  /**
   * 工单ID
   */
  public strategyId: Array<string> | string;

  /**
   * 操作类型
   */
  public commandId: string;
  /**
   * 操作类型
   */
  public param: InstructSendModel;

  constructor(param?) {
    this.param = param.param || {};
    this.strategyId = param.strategyId || '';
    this.commandId = param.commandId || '';
  }

}
