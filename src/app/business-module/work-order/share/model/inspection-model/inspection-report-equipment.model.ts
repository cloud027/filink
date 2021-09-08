/**
 * 巡检报告-设备
 */
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';

export class InspectionReportEquipmentModel {
  /**
   * 设备id
   */
  public equipmentId?: string;
  /**
   * 设备名称
   */
  public equipmentName?: string;
  public title?: string;
  /***
   * key
   */
  public key?: string;
  /**
   * 设施id
   */
  public deviceId?: string;
  /**
   * 是否可用
   */
  public isLeaf?: boolean;
  /**
   * 设备类型
   */
  public equipmentType?: EquipmentTypeEnum;
}
