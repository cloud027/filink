/**
 *  实景图数据模型
 */
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../enum/equipment/equipment.enum';

export class RealPictureModel {
  /**
   * 图片id
   */
  public picId: string;
  /**
   * 对象id
   */
  public objectId: string;
  /**
   * 对象类型
   */
  public objectType: string;
  /**
   * 图片名称
   */
  public picName: string;
  /**
   *  图片大小
   */
  public picSize: number | string;
  /**
   *  图片基础路径
   */
  public picUrlBase: string;
  /**
   * 缩略图路径
   */
  public picUrlThumbnail: string;
  /**
   * 图片类型
   */
  public type: string;
  /**
   * 基础位置
   */
  public positionBase: string;
  /**
   * 来源类型
   */
  public resource: string;
  /**
   * 来源id
   */
  public resourceId: string;
  /**
   * 来源名称
   */
  public resourceName: string;
  /**
   * 工单类型
   */
  public orderType: string;
  /**
   * 创建时间
   */
  public createTime: string;
  /**
   * 创建人
   */
  public createUser: string;
  /**
   * 更逊时间
   */
  public updateTime: string;
  /**
   * 更新人
   */
  public updateUser: string;
  /**
   * 设施类型
   */
  public deviceType: string;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 设施编码
   */
  public deviceCode: string;
  /**
   * 设施状态
   */
  public deviceStatus: string;
  /**
   * 设备类型
   */
  public equipmentType: EquipmentTypeEnum | string;
  /**
   * 设备名称
   */
  public equipmentName: string ;
  /**
   * 资产编码
   */
  public equipmentCode: string;
  /**
   * 设备状态
   */
  public equipmentStatus: EquipmentStatusEnum | string;
  /**
   * 详细地址
   */
  public address: string;
  /**
   * 省份
   */
  public provinceName: string;
  /**
   * 城市名称
   */
  public cityName: string;
  /**
   *  区名称
   */
  public districtName: string;
  /**
   * 区域id
   */
  public areaId: string;
  /**
   * 区域名称
   */
  public areaName: string;
  /**
   * 备注
   */
  public remarks: string;
  /**
   * 上传时间
   */
  public ctime: string;
}
