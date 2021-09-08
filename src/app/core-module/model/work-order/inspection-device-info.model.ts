/**
 * 巡检任务关联设施实体类
 */
import {InspectionEquipmentInfoModel} from './inspection-equipment-info.model';
import {DeviceTypeEnum} from '../../enum/facility/facility.enum';

export class InspectionDeviceInfoModel {
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 设施类型
   */
  public deviceType: DeviceTypeEnum;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 设施编号
   */
  public deviceCode: string;
  /**
   * 详细地址
   */
  public address: string;
  /**
   * 基础定位
   */
  public positionBase: string;
  /**
   * 设备list
   */
  public equipmentList: InspectionEquipmentInfoModel[];
}
