/**
 * 设备类型统计数据模型
 */
import {EquipmentTypeEnum} from '../../enum/equipment/equipment.enum';

export  class EquipmentStatisticsModel {
  /**
   * 设备类型
   */
  public equipmentType: EquipmentTypeEnum;
  /**
   * 设备数量
   */
  public equipmentNum: number;
}
