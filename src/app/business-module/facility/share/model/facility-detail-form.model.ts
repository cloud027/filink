/**
 * 设施新增、编辑表单模型
 */
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';

export class FacilityDetailFormModel {
  /**
   * 设施id 编辑时候有
   */
  public deviceId?: string;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 设施类型
   */
  public deviceType: DeviceTypeEnum;
  /**
   * 设施状态
   */
  public deviceStatus?: DeviceStatusEnum;
  /**
   * 型号
   */
  public deviceModel: string;
  /**
   * 第三方编码
   */
  public otherSystemNumber: string;
  /**
   * 资产编码
   */
  public assetNumbers: string;
  /**
   * 所属公司
   */
  public company: string;
  /**
   * 所属项目
   */
  public project: string;
  /**
   * 所属区域
   */
  public areaId: string;
  /**
   * 省
   */
  public provinceName: string;
  /**
   * 市
   */
  public cityName: string;
  /**
   * 区
   */
  districtName: string;
  /**
   * 项目名称
   */
  public projectName: string;
  /**
   * 项目id
   */
  public projectId: string;
  /**
   * 详细地址
   */
  address: string;
  /**
   * 供应商
   */
  public supplier: string;

  /**
   * 供应商id
   */
  public supplierId?: string;

  /**
   * 报废年限
   */
  public scrapTime: number;
  /**
   * 安装日期
   */
  public installationDate: number;
  /**
   * 安装日期
   */
  public instDate?: number;
  /**
   * 备注
   */
  public remark: string;
  /**
   * 上传图片
   */
  public picUrl?: string;
  /**
   * 位置Base
   */
  public positionBase?: string;
  /**
   * 位置Gps
   */
  public positionGps?: string;
  /**
   * 区域code
   */
  public areaCode?: string;
  /**
   * 设施类型
   */
  public typeObject?: string;
}
