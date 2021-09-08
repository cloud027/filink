/**
 * 表单类设备
 */
import {DeviceFormModel} from './device-form.model';
import {DeviceTypeEnum} from '../../enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../enum/equipment/equipment.enum';

export class EquipmentFormModel {
  /**
   * 设备id
   */
  public equipmentId?: string;
  /**
   * 设施id
   */
  public deviceId?: string;
  /**
   * 设施类型
   */
  public deviceType?: DeviceTypeEnum;
  /**
   * 设备类型id
   */
  public equipmentIdType?: string;
  /**
   * 设备类型
   */
  public equipmentType?: EquipmentTypeEnum;
  /**
   * 设备类型class
   */
  public equipmentTypeClass?: string;
  /**
   * 设备名称
   */
  public equipmentName: string;
  /**
   * code
   */
  public equipmentCode?: string;
  /**
   * deviceinfo
   */
  public deviceInfo?: DeviceFormModel;
}
