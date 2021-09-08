/**
 * 设施列表模型
 */
export class FacilityListModel {
  /**
   * 是否勾选
   */
  checked: boolean;
  /**
   * 详细地址
   */
  address: string;
  /**
   * 区域code
   */
  areaCode: string;
  /**
   * 区域Id
   */
  areaId: string;
  /**
   * 设施Id
   */
  deviceId: string;
  /**
   * 设施名称
   */
  deviceName: string;
  /**
   * 设施状态
   */
  deviceStatus: any;
  /**
   * 设施类型
   */
  deviceType: any;
  /**
   * 设备数量
   */
  equipmentQuantity: string;
  /**
   * 地图坐标
   */
  positionBase: string;
  /**
   * 地图所用类型
   */
  facilityType: string;
  /**
   * 地图所用是否显示
   */
  show: boolean;
  /**
   * 地图所需复制一份设施类型
   */
  cloneDeviceType: string;
  /**
   * 地图所需复制一份设施状态
   */
  cloneDeviceStatus: string;
}

/**
 * 设备列表模型
 */
export class EquipmentListModel {
  /**
   * 是否勾选
   */
  checked: boolean;
  /**
   * 详细地址
   */
  address: string;
  /**
   * 区域code
   */
  areaCode: string;
  /**
   * 区域ID
   */
  areaId: string;
  /**
   * 设施Id
   */
  deviceId: string;
  /**
   * 设施名称
   */
  deviceName: string;
  /**
   * 设施类型
   */
  deviceType: string;
  /**
   * 设备Id
   */
  equipmentId: string;
  /**
   * 设备名称
   */
  equipmentName: string;
  /**
   * 设备状态
   */
  equipmentStatus: any;
  /**
   * 设备类型
   */
  equipmentType: any;
  /**
   * 地图坐标
   */
  positionBase: string;
  /**
   * 地图所用类型
   */
  facilityType: any;
  /**
   * 地图所用是否显示
   */
  show: boolean;
  /**
   * 地图所需复制一份设备状态
   */
  cloneEquipmentStatus: string;
  /**
   * 地图所需复制一份设备类型
   */
  cloneEquipmentType: string;
}
