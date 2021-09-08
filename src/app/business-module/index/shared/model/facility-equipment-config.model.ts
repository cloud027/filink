/**
 * 设施设备工单组件配置枚举
 */
export class FacilityEquipmentConfigModel {
  /**
   * 是否显示智慧杆型号
   */
  public showSmartPoleModelComponent?: boolean  = false;
  /**
   * 是否显示建设状态
   */
  public showConstructionStatusComponent?: boolean  = false;
  /**
   * 是否显示设施类型
   */
  public showFacilitiesComponent?: boolean;
  /**
   * 是否显示设施设备类型
   */
  public showEquipmentComponent?: boolean;
  /**
   * 是否显示工单状态类型
   */
  public showWorkOrderStatusComponent?: boolean;
  /**
   * 是否显示工单类型类型
   */
  public showWorkOrderTypeComponent?: boolean;
  /**
   * 区域数据
   */
  public areaData?: string[];
  /**
   * 设施类型title
   */
  public facilityTitleName?: string;
  /**
   * 设备类型title
   */
  public equipmentTitleName?: string;
  /**
   * 工单状态title
   */
  public workOrderStatusTitleName?: string;
  /**
   * 是否显示设施设备类型
   */
  public workOrderTypeTitleName?: string;
  /**
   * 设施数据
   */
  public setFacilityData?: string[];
  /**
   * 设备数据
   */
  public setEquipmentData?: string[];
  /**
   * 工单数据
   */
  public setWorkOrderData?: string[];
}

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
