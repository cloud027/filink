import {DeployStatusEnum, DeviceStatusEnum, IsCollectedEnum} from '../../enum/facility/facility.enum';
import {EquipmentStatusEnum} from '../../enum/equipment/equipment.enum';

/**
 * 设施设备详情模型
 */
export class FacilitiesDetailsModel {

  /**
   * 责任单位
   */
  public accountabilityUnit: string;
  /**
   * 详细地址
   */
  public address: string;
  /**
   * 区域code
   */
  public areaCode: string;
  /**
   *区域ID
   */
  public areaId: string;
  /**
   * 区域名称
   */
  public areaName: string;
  /**
   * 关注状态
   */
  public attentionStatus: IsCollectedEnum;
  /**
   * 业务状态
   */
  public businessStatus: string;
  /**
   * 设施Id
   */
  public deviceId: string;
  /**
   * 设施编号
   */
  public deviceCode: string;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 设施状态
   */
  public deviceStatus: DeviceStatusEnum;
  /**
   * 设施类型
   */
  public deviceType: string;
  /**
   * 经纬度
   */
  public positionBase: string;
  /**
   * 设备类型
   */
  public equipmentType: string;
  /**
   * 设备Id
   */
  public equipmentId: string;
  /**
   * 设备名称
   */
  public equipmentName: string;
  /**
   * 设备状态
   */
  public equipmentStatus: EquipmentStatusEnum;
  /**
   * 设备code码
   */
  public equipmentCode: string;
  /**
   * 状态颜色
   */
  public bgColor: string;
  /**
   * 设施名称
   */
  public facilityName: string;
  /**
   * 设施类型图标
   */
  public facilityTypeClassName: string;
  /**
   * 设施类型名称
   */
  public facilityTypeName: string;
  /**
   * 状态
   */
  public text: string;
  /**
   * 挂载状态
   */
  public mountPosition: string;
  /**
   * 数据ID
   */
  public facilityId: string;
  /**
   * 设备型号
   */
  public equipmentModel: string;
  /**
   * 设备型号类型
   */
  public modelType: string;
  /**
   * 资产编号
   */
  public facilityCode: string;
  /**
   * 部署状态
   */
  public deployStatus: DeployStatusEnum;
  /**
   *项目/规划ID
   */
  public pointId: string;
  /**
   *项目/规划名称
   */
  public pointName: string;
}
