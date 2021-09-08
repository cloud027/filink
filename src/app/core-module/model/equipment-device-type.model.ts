/**
 * 设施/设备对象
 */
import {SelectModel} from '../../shared-module/model/select.model';

export class EquipmentDeviceTypeModel {
  /**
   * 设施/设备名称
   */
  public name?: string | SelectModel;
  /**
   * 设施/设备类型图标
   */
  public picture: string;
  /**
   * 类型名称
   */
  public typeName?: string;
  constructor() {
    this.name = '';
    this.picture = '';
  }
}
