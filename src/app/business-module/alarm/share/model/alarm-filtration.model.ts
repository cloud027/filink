import {AlarmEnableStatusEnum, AlarmInventoryEnum} from '../enum/alarm.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';
/**
 * 告警过滤
 */

export class AlarmFiltrationModel {
  /**
   * 告警对象id
   */
 public alarmFilterRuleSourceList: string[];
  /**
   * 告警对象名称
   */
  public alarmFilterRuleSourceName: string[];
  /**
   * 起始时间
   */
  public beginTime: string;
  /**
   * 结束时间
   */
  public endTime: string;
  /**
   * 启用状态
   */
  public status: AlarmEnableStatusEnum;
  /**
   * 过滤名称
   */
  public ruleName: string;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 过滤id
   */
  public id: string;
  /**
   * 等级样式
   */
  public style: string;
  /**
   * 告警过滤条件
   */
  public alarmFilterRuleNames: string[];
  /**
   * 告警名称
   */
  public alarmName: string;
  /**
   * 创建起始时间
   */
  public createTime: string;
  /**
   * 是否库存
   */
  public storeDatabase: AlarmInventoryEnum;
  /**
   * 等级
   */
  public alarmFixedLevel: string;
  /**
   * 禁用名称
   */
  public statusName: string | SelectModel[];
  /**
   * 创建结束时间
   */
  public createTimeEnd: string;
  /**
   * 告警名称id
   */
  public alarmFilterRuleNameList: string[];
  /**
   * 禁启用权限
   */
  public appAccessPermission: string;
}
