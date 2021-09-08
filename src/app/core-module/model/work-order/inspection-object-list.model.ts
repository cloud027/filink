/**
 * 巡检任务关联设施设备集合
 */
import {InspectionDeviceInfoModel} from './inspection-device-info.model';
import {InspectionEquipmentInfoModel} from './inspection-equipment-info.model';

export class InspectionObjectListModel {
  /**
   * 关联设施list
   */
  public deviceList: InspectionDeviceInfoModel[];
  /**
   * 关联设备list
   */
  public equipmentList: InspectionEquipmentInfoModel[];
}
