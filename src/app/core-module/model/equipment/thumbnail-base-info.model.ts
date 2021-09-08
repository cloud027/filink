/**
 * 缩略图输入参数模型
 */
import {PointModel} from '../point.model';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../enum/facility/facility.enum';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../enum/equipment/equipment.enum';

export class ThumbnailBaseInfoModel {
  /**
   * 经纬度
   */
  public point?: PointModel;
  /**
   * 基础位置
   */
  public positionBase?: string;
  /**
   * 设施类型
   */
  public deviceType?: DeviceTypeEnum;
  /**
   * 设施状态
   */
  public deviceStatus?: DeviceStatusEnum;
  /**
   * 设备类型
   */
  public equipmentType?: EquipmentTypeEnum;
  /**
   * 设备状态
   */
  public equipmentStatus?: EquipmentStatusEnum;

  /**
   * 区域code
   */
  public areaCode?: string;

  constructor() {
    this.point = new PointModel();
  }
}
