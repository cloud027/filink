import {AreaModel} from './area.model';
import {BusinessStatusEnum} from '../../enum/equipment/equipment.enum';
import {DeployStatusEnum, DeviceStatusEnum, DeviceTypeEnum} from '../../enum/facility/facility.enum';

/**
 * 设施详情数据模型
 */
export class FacilityDetailInfoModel {
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
   * 设施状态
   */
  public deviceStatus: DeviceStatusEnum;
  /**
   * 设施资产编码
   */
  public deviceCode: string;
  /**
   * 详细地址
   */
  public address: string;
  /**
   * 部署状态
   */
  public deployStatus: DeployStatusEnum;
  /**
   * 部署状态的label
   */
  public deployStatusLabel: string;
  /**
   * 部署状态的图标
   */
  public deployStatusIconClass: string;
  /**
   * 省份名称
   */
  public provinceName: string;
  /**
   * 地市名称
   */
  public cityName: string;
  /**
   * 区县名称
   */
  public districtName: string;
  /**
   * 位置
   */
  public position: string;
  /**
   * 基础定位
   */
  public positionBase: string;
  /**
   * GPS
   */
  public positionGps?: string;
  /**
   * 区域信息
   */
  public areaInfo: AreaModel = new AreaModel();
  /**
   * 备注
   */
  public remarks: string;
  /**
   * 更新时间
   */
  public utime: number | string;
  /**
   * 安装时间
   */
  public installationDate?: string | Date;
  /**
   * 所属公司
   */
  public company?: string;
  /**
   * 业务状态
   */
  public businessStatus?: BusinessStatusEnum;
  /**
   * 设施型号
   */
  public deviceModel?: string;
  /**
   * 第三方编码
   */
  public otherSystemNumber?: string;
  /**
   * 供应商
   */
  public supplier?: string;
  /**
   * 供应商Id
   */
  public supplierId?: string;
  /**
   * 设备数量
   */
  public equipmentQuantity?: string;
  /**
   * 项目名称
   */
  public projectName?: string;
  /**
   * 报废年限
   */
  public scrapTime?: string;
  /**
   * 通信方式
   */
  public communicationMode?: string;
  /**
   * 云平台
   */
  public cloudPlatform?: string;
  /**
   * 设施状态图标
   */
  public deviceStatusIconClass?: string;
  /**
   * 设施状态图标 颜色
   */
  public deviceStatusColorClass?: string;
  /**
   * 安装日期
   */
  public instDate?: string;
  /**
   * 更新日期
   */
  public updateTime?: string | number;
  /**
   * 项目id
   */
  public projectId?: string;
  /**
   * 部门名称
   */
  public departmentName?: string;
}
