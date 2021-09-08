/**
 * 告警远程通知设备信息
 */
import {SelectModel} from '../../../../shared-module/model/select.model';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';

export class AlarmRemoteEquipmentModel {
  /**
   * 远程通知id
   */
  public ruleId?: string;
  /**
   * 设备id
   */
  public equipmentId?: string;
  /**
   * 设备名称
   */
  public equipmentName?: string;
  /**
   * 设备类型
   */
  public equipmentType?: EquipmentTypeEnum;
  /**
   * 设备图标
   */
  public iconClass?: string;
  /**
   * 设备类型id
   */
  public equipmentTypeId?: string | SelectModel;
}
