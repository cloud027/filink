import {SwitchStatus} from '../enum/policy.enum';

/**
 * 当前选择的执行动作类型
 */
export class CurrentActionSelectedModel {
  /**
   * id
   */
  id: string;
  /**
   * 选择的设备
   */
  selectedEquipment: any[];
  /**
   * 选择设备的类型
   */
  selectEquipmentType: string;
  /**
   * 选择的设备名称拼接
   */
  equipmentNames: string;
  /**
   * 开关和照明拼接
   */
  switchLanguage: string;
  /***
   * 开关
   */
  switchLight: SwitchStatus;
  /**
   * 执行动作拼接
   */
  actions: string;
  /**
   * 照明
   */
  light: number;

  constructor() {
    this.light = 0;
    this.switchLight = SwitchStatus.off;
  }
}
