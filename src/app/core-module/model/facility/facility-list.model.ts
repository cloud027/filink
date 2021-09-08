/**
 * 设施列表模型
 */
import {DeployStatusEnum, DeviceStatusEnum, DeviceTypeEnum} from '../../enum/facility/facility.enum';
import {BusinessStatusEnum} from '../../enum/equipment/equipment.enum';
import {AreaModel} from './area.model';

export class FacilityListModel {
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 设施类型
   */
  public deviceType: DeviceTypeEnum;
  /**
   * 设施基础位置
   */
  public positionBase: string;
  /**
   * 型号
   */
  public deviceModel: string;
  /**
   * 设施状态
   */
  public deviceStatus: DeviceStatusEnum;
  /**
   * 设备数量
   */
  public equipmentQuantity: number;
  /**
   * 第三方编码
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
  public areaName: string;

  /**
   * 所属区域编号
   */
  public areaCode: string;
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
  public districtName: string;
  /**
   * 详细地址
   */
  public address: string;
  /**
   * 业务状态
   */
  public businessStatus: BusinessStatusEnum;
  /**
   * 供应商
   */
  public supplier: string;
  /**
   * 报废年限
   */
  public scrapTime: string;
  /**
   * 安装日期
   */
  public installationDate: string;
  /**
   * 备注
   */
  public remark: string;

  /**
   * 区域模型
   */
  public areaInfo: AreaModel = new AreaModel();

  /**
   * 设施状态
   */
  public _deviceStatus: DeviceStatusEnum;

  /**
   * 设施类型
   */
  public _deviceType: DeviceTypeEnum;

  /**
   * 操作按钮枚举 新建一个枚举
   */
  public deployStatus: DeployStatusEnum;
  /**
   * iconClass
   */
  public iconClass: string;
  /**
   * 设施状态IconClass
   */
  public deviceStatusIconClass: string;
  /**
   * 设施状态ColorClass
   */
  public deviceStatusColorClass: string;
  /**
   * 控制info按钮
   */
  public infoButtonShow: boolean;
  /**
   * 控制control按钮
   */
  public controlButtonShow: boolean;
  public wisdomButtonShow: boolean;
  public facilityRelocation: boolean;
  /**
   * 是否选中
   */
  public checked?: boolean;
  /**
   * 分组状态图标
   */
  public deviceStatusTemp: string;
  /**
   * 设施状态名称
   */
  deviceStatusName: string | { label: string; code: any }[];
  /**
   * 报废样式
   */
  public rowStyle: {};
  /**
   * 设施类型名称
   */
  public deviceTypeName: string;
  /**
   * 设施下的门锁集合
   */
  // todo 待后端接口给出lockList结构后将any类型修改
  public  lockList: any;
  /**
   * 设施下的门锁集合
   */
  public  _lockList: any;
  /**
   * 产品id
   */
  public productId?: string;
  /**
   * 项目id
   */
  public projectId?: string;
}
