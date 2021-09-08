import { AlarmSelectorConfigTypeEnum } from '../enum/alarm-selector-config-type.enum';

/**
 * 告警选择器配置项基本模型
 */
export class AlarmSelectorConfigModel {
  /**
   * 传递的类型 'form' 和 'table' 默认 'table'
   */
  public type?: AlarmSelectorConfigTypeEnum;
  /**
   * 初始值 如编辑页面时需传该字段用于回显
   */
  public initialValue?: AlarmSelectorInitialValueModel;
  /**
   * 是否清除数据 true表示清除数据
   */
  public clear?: boolean;
  /**
   * 是否禁用 true 为禁用
   */
  public disabled?: boolean;
  /**
   * 远程通知新增 编辑页面 通过选择的区域和设施类型 查询通知人
   */
  public condition?: any;
  /**
   * 勾选后 触发的回调函数
   */
  public handledCheckedFun?: Function;
}

/**
 * 选中的告警相关选择器中传入选择器的初始值模型
 */
export class AlarmSelectorInitialValueModel {
  /**
   * 选中的告警名称(多选时，告警名称为多个告警名称的拼接)
   */
  name: string;
  /**
   * 选中的告警id
   */
  ids: string[];
  /**
   * 选中的区域 区域选择器使用
   */
  areaCode?: string[];

  /**
   * 告警code
   */
  alarmCodes?: string[];
  /**
   * 告警名称
   */
  alarmNames?: string[];

  constructor(name?, ids?) {
    this.name = name || '';
    this.ids = ids || [];
    this.alarmCodes = [];
    this.alarmNames = [];
  }
}
