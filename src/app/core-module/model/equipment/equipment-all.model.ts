import {EquipmentDeviceTypeModel} from './equipment-device-type.model';

/**
 * 设施/设备对象
 */
export class EquipmentAllModel {
  /**
   * 设施/设备名称
   */
  public equipmentArr: EquipmentDeviceTypeModel[];
  /**
   * 设施/设备图片
   */
  public allEquipmentNames: string[];
  constructor() {
    this.equipmentArr = [];
    this.allEquipmentNames = [];
  }
}
