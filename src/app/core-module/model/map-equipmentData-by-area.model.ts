/**
 * 区域点设备统计数据
 */
import {EquipmentTypeEnum} from '../enum/equipment/equipment.enum';

export class MapEquipmentDataByAreaModel {
  /**
   * 设备数量
   */
  count: number;
  /**
   * 设备类型
   */
  equipmentType: EquipmentTypeEnum;
  /**
   * 设备型号
   */
  modelType: string;
}
