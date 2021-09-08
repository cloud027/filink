/**
 * 设备配置参数
 */
import {EquipmentTypeEnum} from '../../enum/equipment/equipment.enum';

export class ConfigDetailRequestModel {
  /**
   * 设备id
   */
  public equipmentId: string;

  /**
   * 设备类型
   */
  public equipmentType: EquipmentTypeEnum;
}
