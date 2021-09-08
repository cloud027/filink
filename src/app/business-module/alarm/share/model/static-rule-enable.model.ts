/**
 * 禁启用模型
 */
import {AlarmDisableStatusEnum} from '../enum/alarm.enum';

export class StaticRuleEnableModel {
  /**
   * 禁启用状态
   */
  public status: AlarmDisableStatusEnum;
  /**
   * id
   */
  public idArray: string;
  constructor(type, ids) {
    this.status = type;
    this.idArray = ids;
  }
}

