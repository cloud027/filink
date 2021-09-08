import { EquipmentTypeEnum } from '../../../../core-module/enum/equipment/equipment.enum';

class AreaModel {
  areaId: string;
  level: string;
  areaCode: string;
  areaName: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  address: string;
  managementFacilities: string;
  accountabilityUnit: any[];
  remarks: string;
  createTime: string;
  parentId: string;
  parentName: string;
  creater: string;
  updateTime: string;
  updater: string;
  children: string;
  hasChild: boolean;
  accountabilityUnitName: string;

  constructor() {
    this.accountabilityUnit = [];
  }
}

/**
 * 设备新增或编辑数据模型
 */
export class EnergyNodesDetailsModel {
  // 创建时间
  ctime: any;
  // 更新时间
  utime: string;
  // 是否从已有设备选择 1是   0否
  isSelectExistDevice: number;
  // 节点 id
  energyConsumptionNodeId?: string;
  /**
   *  关联设备id
   */
  public relationEquipmentId?: string;
  /**
   *  名称 && 已有设备
   */
  public equipmentName: string;
  /**
   * 类型
   */
  public equipmentNType: EquipmentTypeEnum;
  /**
   * 型号
   */
  public equipmentModel: string;

  /**
   * 设备序号id
   */
  public sequenceId: string;
  /**
   * 项目
   */
  public project: string;
    /**
   * 项目name
   */
     public projectName: string;
  /**
   * 区域
   */
  public areaInfo: AreaModel = new AreaModel();
  /**
   * 区域id
   */
  public areaId: string;
  // 区域 名称
  areaName: string;
  // 区域 code
  areaCode: string;

  /**
   * 采集设施
   */
  public collectDeviceName: string;
  // 采集设施 id
  collectDeviceId: string;

  /**
   *   采集设备类型
   */
  public collectEquipmentType: string;
  // 采集设备名字
  collectEquipmentName: string;
  // 采集设备 id
  collectEquipmentId: string;
  /**
   * 采集回路名字
   */
  public loopName: string;
  //  采集回路 id
  loopId: string;
  // 通信设备 -------------------------
  // 通信设备名称
  gatewayName: string;
  // 通信设备 id
  gatewayId: string;
  // 通信设备选择的 类型
  equipmentControlType: string;
  // 通信设备选择 网关需要填写 所属端口号
  portNo?: number;
  // 通信设备 -------------------------
  /**
   *  能耗目标值(日)
   */
  public energyConsumptionTarget: string;
  // 详细地址
  address: string;
  // 备注
  public remarks: string;

  /** 资产编码 */
  equipmentCode?: string;
}
