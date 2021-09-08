
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';

/**
 * 地图气泡模型
 */
export class MapBubbleModel {
  /**
   * 设施总数
   */
  public count: string;
  /**
   * 各类设施总数
   */
  public deviceTotal: string;
  /**
   * 各类告警总数
   */
  public alarmTotal: string;

}

/**
 * 地图分层设施类型模型
 */
export class MapDeviceTypeModel {
  /**
   * 设施类型
   */
  public deviceType: DeviceTypeEnum;

  /**
   * 是否选中
   */
  public isModel?: boolean;

  /**
   * 总数
   */
  public count: number;
}

/**
 * 地图分层设施类型模型
 */
export class MapEquipmentTypeModel {
  /**
   * 设备类型
   */
  public equipmentType: EquipmentTypeEnum;

  /**
   * 是否选中
   */
  public isModel?: boolean;

  /**
   * 总数
   */
  public count: number;
}

/**
 * 设施设备列表设施类型入参模型
 */
export class GetListDeviceTypeModel {
  /**
   * 区域集合
   */
  public areaCodeList?: string[];
}

/**
 * 设施设备列表设施类型出参模型
 */
export class ListDeviceTypeModel {
  /**
   * 设施类型
   */
  public deviceType?: EquipmentTypeEnum;
  /**
   * 设施总数
   */
  public count?: number;
  /**
   * 设施勾选状态
   */
  public checked?: boolean;
}

/**
 * 设施设备列表设备类型出参模型
 */
export class ListEquipmentTypeModel {
  /**
   * 设施类型
   */
  public equipmentType?: EquipmentTypeEnum;
  /**
   * 设施总数
   */
  public count?: number;
  /**
   * 设施勾选状态
   */
  public checked?: boolean;
}
