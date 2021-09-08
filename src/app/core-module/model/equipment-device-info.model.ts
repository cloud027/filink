import {EquipmentDeviceTypeModel} from './equipment-device-type.model';

/**
 * 设施/设备对象
 */
export class EquipmentOrDeviceInfoModel {
  /**
   * 设施/设备 信息
   */
  public resultInfo: EquipmentDeviceTypeModel[];
  /**
   * 设施/设备类型 名称
   */
  public resultNames: string[];
  constructor() {
    this.resultInfo = [];
    this.resultNames = [];
  }
}
