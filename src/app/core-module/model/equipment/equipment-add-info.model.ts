/**
 * 设备新增或编辑数据模型
 */
import {BusinessStatusEnum, EquipmentStatusEnum, EquipmentTypeEnum} from '../../enum/equipment/equipment.enum';
import {DeviceTypeEnum} from '../../enum/facility/facility.enum';
import {AreaModel} from '../facility/area.model';
import {FacilityDetailInfoModel} from '../facility/facility-detail-info.model';
import {SelectModel} from '../../../shared-module/model/select.model';


export class EquipmentAddInfoModel {
  /**
   *  设备id
   */
  public equipmentId?: string;
  /**
   *资产编号
   */
  public  equipmentCode: string;
  /**
   * 基础点位
   */
  public positionBase: string;
  /**
   * 详细地址
   */
  public address: string;
  /**
   * 第三方编码
   */
  public otherSystemNumber: string;
  /**
   * 设备序号id
   */
  public sequenceId: string;
  /**
   *  名称
   */
  public equipmentName: string;
  /**
   * 类型
   */
  public equipmentType: EquipmentTypeEnum;
  /**
   * 型号
   */
  public equipmentModel: string;
  /**
   * 型号类型
   */
  public equipmentModelType: string;
  /**
   * 安装时间
   */
  public installationDate: number | string;
  /**
   * 安装日期时间戳
   */
  public instDate: number | string;
  /**
   * 供应商
   */
  public supplier: string;
  /**
   * 报废年限
   */
  public scrapTime: string;
  /**
   * 权属公司
   */
  public company: string;
  /**
   * 业务状态
   */
  public businessStatus: BusinessStatusEnum;
  /**
   * 所属区域
   */
  public areaId: string;

  /**
   * 区域编码
   */
  public areaCode: string;
  /**
   * 区域名称
   */
  public areaName: string;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 挂载位置
   */
  public  mountPosition: number;
  /**
   * 所属网关
   */
  public  gatewayId: string;
  /**
   * 传输方式
   */
   public gatewayResolverType: string;
  /**
   * 分组名称
   */
  public groupName: string;
  /**
   *所属回路
   */
  public loopId: string;
  /**
   * 回路名称
   */
  public loopName: string;
  /**
   * 网关端口
   */
  public portNo: string;
  /**
   * 网关端口
   */
  public portType: string;
  /**
   * 网关端口名称
   */
  public portName: string;
  /**
   * 备注
   */
  public remarks: string;
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   *
   * 设施类型
   */
  public deviceType: DeviceTypeEnum;
  /**
   * 网关名称
   */
  public gatewayName: string;
  /**
   * 设备状态
   */
  public equipmentStatus: EquipmentStatusEnum;
  /**
   * 更新时间
   */
  public utime: string;
  /**
   * 电源控制器设备id
   */
  public powerControlId: string;
  /**
   *  电源控制器端口
   */
  public powerControlPortNo: string;
  /**
   *  电源控制器端口
   */
  public powerControlPortType: string;
  /**
   *  电源控制器端口名称
   */
  public powerControlPortName: string;
  /**
   *  电源控制器名称
   */
  public powerControlName: string;
  /**
   * 云平台
   */
  public cloudPlatform?: string;
  /**
   * 云平台名称
   */
  public cloudPlatformName?: string | SelectModel[];
  /**
   * 通信方式
   */
  public communicationMode?: string;
  /**
   * 设施信息
   */
  public deviceInfo: FacilityDetailInfoModel = new FacilityDetailInfoModel();
  /**
   * 区域
   */
  public areaInfo: AreaModel = new AreaModel();

  /**
   * 控制类型
   */
  public equipmentControlType: string;

  /**
   * 责任单位
   */
  public departmentName: string;
  /**
   * 平台id
   */
  public platformId: string;
}
